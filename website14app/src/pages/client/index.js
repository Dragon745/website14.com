import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../../lib/firebase';
import { collection, query, where, getDocs, getDoc, doc, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ClientNav from '../../components/ClientNav';
import { useLocation } from '../../hooks/useLocation';
import { usePricing } from '../../hooks/usePricing';
import Dashboard from '../../components/Dashboard';
import Projects from '../../components/Projects';
import Support from '../../components/Support';
import Billing from '../../components/Billing';
import Profile from '../../components/Profile';

export default function ClientPortal() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [quotes, setQuotes] = useState([]);
    const [leads, setLeads] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [projects, setProjects] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [showNewTicket, setShowNewTicket] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [newTicket, setNewTicket] = useState({
        subject: '',
        message: '',
        priority: 'medium',
        category: 'general'
    });
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    // Project creation states
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [projectData, setProjectData] = useState({
        businessName: '',
        domain: '',
        businessType: '',
        package: '',
        hostingDuration: 'monthly',
        emailDuration: 'monthly',
        emailAccountQuantity: 1,
        productCount: '',
        extraProducts: 0,
        pagesNeeded: [],
        selectedPages: [],
        customPages: [],
        featuresNeeded: [],
        addons: []
    });
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [isCreatingProject, setIsCreatingProject] = useState(false);

    // Use location and pricing hooks
    const { location: userLocation, isLoading: locationLoading } = useLocation();
    const effectiveCurrency = selectedCurrency || userLocation?.currency;
    const { pricingData, isLoading: pricingLoading } = usePricing(effectiveCurrency);

    useEffect(() => {
        console.log('ClientPortal: useEffect started');
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            console.log('ClientPortal: Auth state changed', user ? 'User logged in' : 'No user');
            if (user) {
                console.log('ClientPortal: User found, fetching data for', user.uid);
                setUser(user);
                await fetchUserData(user.uid);
                await fetchUserQuotes(user.uid);
                await fetchUserLeads(user.uid);
                await fetchUserTickets(user.uid);
                await fetchUserProjects(user.uid);
                await fetchUserInvoices(user.uid);
            } else {
                console.log('ClientPortal: No user, redirecting to login');
                router.push('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    // Handle URL parameters for section and package
    useEffect(() => {
        if (router.query.section) {
            setActiveSection(router.query.section);
        }

        if (router.query.package && !showProjectForm) {
            setShowProjectForm(true);
            setActiveSection('projects');

            // Pre-select package based on URL parameter
            const packageType = router.query.package;
            if (packageType === 'staticSetup') {
                setProjectData(prev => ({ ...prev, package: 'static' }));
            } else if (packageType === 'dynamicSetup') {
                setProjectData(prev => ({ ...prev, package: 'dynamic' }));
            } else if (packageType === 'ecommerceSetup') {
                setProjectData(prev => ({ ...prev, package: 'ecommerce' }));
            }
        }
    }, [router.query, showProjectForm]);

    const fetchUserData = async (userId) => {
        console.log('ClientPortal: Fetching user data for', userId);
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                console.log('ClientPortal: User data found', userDoc.data());
                setUserData(userDoc.data());
            } else {
                console.log('ClientPortal: No user document found');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchUserQuotes = async (userId) => {
        console.log('ClientPortal: Fetching quotes for', userId);
        try {
            const q = query(
                collection(db, 'quotes'),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc'),
                limit(5)
            );
            const querySnapshot = await getDocs(q);
            const quotesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log('ClientPortal: Found quotes', quotesData.length);
            setQuotes(quotesData);
        } catch (error) {
            console.error('Error fetching quotes:', error);
        }
    };

    const fetchUserLeads = async (userId) => {
        console.log('ClientPortal: Fetching leads for', userId);
        try {
            const q = query(
                collection(db, 'leads'),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc'),
                limit(5)
            );
            const querySnapshot = await getDocs(q);
            const leadsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log('ClientPortal: Found leads', leadsData.length);
            setLeads(leadsData);
        } catch (error) {
            console.error('Error fetching leads:', error);
        }
    };

    const fetchUserTickets = async (userId) => {
        try {
            const q = query(
                collection(db, 'tickets'),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const ticketsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTickets(ticketsData);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    const fetchUserProjects = async (userId) => {
        console.log('ClientPortal: Fetching projects for', userId);
        try {
            const q = query(
                collection(db, 'projects'),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const projectsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log('ClientPortal: Found projects', projectsData.length);
            console.log('ClientPortal: Projects data:', projectsData);
            setProjects(projectsData);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchUserInvoices = async (userId) => {
        console.log('ClientPortal: Fetching invoices for', userId);
        try {
            // Try the user-specific query without orderBy first to avoid index issues
            console.log('ClientPortal: Trying user-specific query without orderBy...');
            const q = query(
                collection(db, 'invoices'),
                where('userId', '==', userId)
            );
            const querySnapshot = await getDocs(q);
            const invoicesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sort client-side to avoid index requirements
            invoicesData.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
                return dateB - dateA; // Descending order
            });

            console.log('ClientPortal: Found invoices', invoicesData.length);
            console.log('ClientPortal: Invoices data:', invoicesData);
            setInvoices(invoicesData);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            // Try getting all invoices and filter client-side
            try {
                console.log('ClientPortal: Trying to get all invoices and filter...');
                const allInvoicesQuery = query(collection(db, 'invoices'));
                const allInvoicesSnapshot = await getDocs(allInvoicesQuery);
                const allInvoicesData = allInvoicesSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(invoice => invoice.userId === userId)
                    .sort((a, b) => {
                        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
                        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
                        return dateB - dateA; // Descending order
                    });
                console.log('ClientPortal: Found invoices (filtered client-side):', allInvoicesData.length);
                console.log('ClientPortal: Invoices data (filtered):', allInvoicesData);
                setInvoices(allInvoicesData);
            } catch (error2) {
                console.error('Error fetching all invoices:', error2);
                setInvoices([]);
            }
        }
    };

    const handleSubmitTicket = async (e) => {
        e.preventDefault();
        if (!user) return;

        setSubmitting(true);
        try {
            const ticketData = {
                ...newTicket,
                userId: user.uid,
                userEmail: user.email,
                status: 'open',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            await addDoc(collection(db, 'tickets'), ticketData);

            // Reset form
            setNewTicket({
                subject: '',
                message: '',
                priority: 'medium',
                category: 'general'
            });
            setShowNewTicket(false);

            // Refresh tickets
            await fetchUserTickets(user.uid);
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert('Failed to create ticket. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setIsCreatingProject(true);
        try {
            // Use the selected package directly
            const selectedPackage = projectData.package;
            let confidenceScore = 100;
            let reasoning = `Package selected by user: ${selectedPackage}`;

            // Calculate pricing
            const pricing = getCurrentPricing();
            let setupFee = 0;
            let monthlyFee = 0;
            let hostingDiscount = 0;

            switch (selectedPackage) {
                case 'static':
                    setupFee = pricing.static.setup;
                    monthlyFee = pricing.static.monthly;
                    break;
                case 'dynamic':
                    setupFee = pricing.dynamic.setup;
                    monthlyFee = pricing.dynamic.monthly;
                    break;
                case 'ecommerce':
                    setupFee = pricing.ecommerce.setup;
                    monthlyFee = pricing.ecommerce.monthly;
                    break;
                default:
                    setupFee = pricing.static.setup;
                    monthlyFee = pricing.static.monthly;
                    break;
            }

            // Calculate hosting discount based on duration
            switch (projectData.hostingDuration) {
                case 'yearly':
                    hostingDiscount = pricing.discounts.yearly;
                    break;
                case 'twoYear':
                    hostingDiscount = pricing.discounts.twoYear;
                    break;
                case 'threeYear':
                    hostingDiscount = pricing.discounts.threeYear;
                    break;
                default:
                    hostingDiscount = 0;
                    break;
            }

            // Calculate add-on costs
            let addonCosts = 0;
            let emailDiscount = 0;

            // Calculate email discount based on duration
            switch (projectData.emailDuration) {
                case 'yearly':
                    emailDiscount = pricing.discounts.yearly;
                    break;
                case 'twoYear':
                    emailDiscount = pricing.discounts.twoYear;
                    break;
                case 'threeYear':
                    emailDiscount = pricing.discounts.threeYear;
                    break;
                default:
                    emailDiscount = 0;
                    break;
            }

            projectData.addons.forEach((addon) => {
                switch (addon) {
                    case 'Logo Design':
                        addonCosts += pricing.addons.logoDesign || 15;
                        break;
                    case 'Extra Pages':
                        // Calculate cost based on custom pages
                        const extraPagesCount = projectData.customPages.length;
                        addonCosts += extraPagesCount * (pricing.addons.extraPage || 3);
                        break;
                    case 'Extra Products':
                        addonCosts += projectData.extraProducts * (pricing.addons.extraProduct || 0.2);
                        break;
                    case 'Extra Payment Gateway':
                        addonCosts += pricing.addons.extraPaymentGateway || 5;
                        break;
                    case 'Email Account':
                        const emailBaseCost = pricing.addons.emailAccount || 2.4;
                        const emailCost = emailDiscount > 0 ?
                            emailBaseCost * (1 - emailDiscount / 100) : emailBaseCost;
                        addonCosts += emailCost * projectData.emailAccountQuantity;
                        break;
                    case 'Live Chat':
                        addonCosts += pricing.addons.liveChat || 5;
                        break;
                    case 'Multi-language Support':
                        addonCosts += pricing.addons.multiLanguageSupport || 8;
                        break;
                    case 'Search Functionality':
                        addonCosts += pricing.addons.searchFunctionality || 2.5;
                        break;
                    default:
                        addonCosts += 0;
                }
            });

            // Create project document
            const projectDoc = {
                userId: user.uid,
                businessName: projectData.businessName,
                domain: projectData.domain,
                businessType: projectData.businessType,
                selectedPackage: selectedPackage,
                hostingDuration: projectData.hostingDuration,
                emailDuration: projectData.emailDuration,
                emailAccountQuantity: projectData.emailAccountQuantity,
                productCount: projectData.productCount,
                extraProducts: projectData.extraProducts,
                pagesNeeded: projectData.pagesNeeded,
                selectedPages: projectData.selectedPages,
                customPages: projectData.customPages,
                featuresNeeded: projectData.featuresNeeded,
                addons: projectData.addons,
                recommendedPackage: selectedPackage,
                confidenceScore,
                reasoning,
                setupFee: setupFee + addonCosts,
                monthlyFee,
                hostingDiscount,
                emailDiscount,
                currency: effectiveCurrency || 'USD',
                status: 'pending',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            const projectRef = await addDoc(collection(db, 'projects'), projectDoc);

            // Create invoice
            const invoiceDoc = {
                projectId: projectRef.id,
                userId: user.uid,
                userEmail: user.email,
                businessName: projectData.businessName,
                domain: projectData.domain,
                businessType: projectData.businessType,
                packageType: selectedPackage,
                hostingDuration: projectData.hostingDuration,
                emailDuration: projectData.emailDuration,
                emailAccountQuantity: projectData.emailAccountQuantity,
                productCount: projectData.productCount,
                extraProducts: projectData.extraProducts,
                setupFee: setupFee + addonCosts,
                monthlyFee,
                hostingDiscount,
                emailDiscount,
                addons: projectData.addons,
                addonCosts,
                currency: effectiveCurrency || 'USD',
                status: 'pending',
                invoiceNumber: `INV-${Date.now()}`,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            await addDoc(collection(db, 'invoices'), invoiceDoc);

            // Reset form and show success
            setProjectData({
                businessName: '',
                domain: '',
                businessType: '',
                package: '',
                hostingDuration: 'monthly',
                emailDuration: 'monthly',
                emailAccountQuantity: 1,
                productCount: '',
                extraProducts: 0,
                pagesNeeded: [],
                selectedPages: [],
                customPages: [],
                featuresNeeded: [],
                addons: []
            });
            setShowProjectForm(false);
            setIsCreatingProject(false);

            // Refresh projects and invoices list
            await fetchUserProjects(user.uid);
            await fetchUserInvoices(user.uid);

            alert('Project created successfully! Invoice has been generated.');

        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project. Please try again.');
            setIsCreatingProject(false);
        }
    };

    const getCurrentPricing = () => {
        const defaultPricing = {
            static: { setup: 59, monthly: 5 },
            dynamic: { setup: 120, monthly: 7.2 },
            ecommerce: { setup: 180, monthly: 11 },
            addons: {
                extraPage: 3,
                extraProduct: 0.2,
                extraPaymentGateway: 5,
                emailAccount: 2.4,
                contactForms: 2,
                newsletterSignup: 2.5,
                socialMediaIntegration: 4,
                googleMapsIntegration: 3,
                bookingAppointmentSystem: 10,
                liveChat: 5,
                multiLanguageSupport: 8,
                searchFunctionality: 2.5,
                imageGallery: 2,
                videoIntegration: 4,
                logoDesign: 15
            },
            discounts: {
                yearly: 10,
                twoYear: 15,
                threeYear: 20
            }
        };

        return {
            static: {
                setup: pricingData?.staticSetup !== undefined ? pricingData.staticSetup : defaultPricing.static.setup,
                monthly: pricingData?.staticMonthly !== undefined ? pricingData.staticMonthly : defaultPricing.static.monthly
            },
            dynamic: {
                setup: pricingData?.dynamicSetup !== undefined ? pricingData.dynamicSetup : defaultPricing.dynamic.setup,
                monthly: pricingData?.dynamicMonthly !== undefined ? pricingData.dynamicMonthly : defaultPricing.dynamic.monthly
            },
            ecommerce: {
                setup: pricingData?.ecommerceSetup !== undefined ? pricingData.ecommerceSetup : defaultPricing.ecommerce.setup,
                monthly: pricingData?.ecommerceMonthly !== undefined ? pricingData.ecommerceMonthly : defaultPricing.ecommerce.monthly
            },
            addons: {
                extraPage: pricingData?.extraPage !== undefined ? pricingData.extraPage : defaultPricing.addons.extraPage,
                extraProduct: pricingData?.extraProduct !== undefined ? pricingData.extraProduct : defaultPricing.addons.extraProduct,
                extraPaymentGateway: pricingData?.extraPaymentGateway !== undefined ? pricingData.extraPaymentGateway : defaultPricing.addons.extraPaymentGateway,
                emailAccount: pricingData?.emailAccount !== undefined ? pricingData.emailAccount : defaultPricing.addons.emailAccount,
                contactForms: pricingData?.contactForms !== undefined ? pricingData.contactForms : defaultPricing.addons.contactForms,
                newsletterSignup: pricingData?.newsletterSignup !== undefined ? pricingData.newsletterSignup : defaultPricing.addons.newsletterSignup,
                socialMediaIntegration: pricingData?.socialMediaIntegration !== undefined ? pricingData.socialMediaIntegration : defaultPricing.addons.socialMediaIntegration,
                googleMapsIntegration: pricingData?.googleMapsIntegration !== undefined ? pricingData.googleMapsIntegration : defaultPricing.addons.googleMapsIntegration,
                bookingAppointmentSystem: pricingData?.bookingAppointmentSystem !== undefined ? pricingData.bookingAppointmentSystem : defaultPricing.addons.bookingAppointmentSystem,
                liveChat: pricingData?.liveChat !== undefined ? pricingData.liveChat : defaultPricing.addons.liveChat,
                multiLanguageSupport: pricingData?.multiLanguageSupport !== undefined ? pricingData.multiLanguageSupport : defaultPricing.addons.multiLanguageSupport,
                searchFunctionality: pricingData?.searchFunctionality !== undefined ? pricingData.searchFunctionality : defaultPricing.addons.searchFunctionality,
                imageGallery: pricingData?.imageGallery !== undefined ? pricingData.imageGallery : defaultPricing.addons.imageGallery,
                videoIntegration: pricingData?.videoIntegration !== undefined ? pricingData.videoIntegration : defaultPricing.addons.videoIntegration,
                logoDesign: pricingData?.logoDesign !== undefined ? pricingData.logoDesign : defaultPricing.addons.logoDesign
            },
            discounts: {
                yearly: pricingData?.yearlyDiscount !== undefined ? pricingData.yearlyDiscount : defaultPricing.discounts.yearly,
                twoYear: pricingData?.twoYearDiscount !== undefined ? pricingData.twoYearDiscount : defaultPricing.discounts.twoYear,
                threeYear: pricingData?.threeYearDiscount !== undefined ? pricingData.threeYearDiscount : defaultPricing.discounts.threeYear
            },
            currency: effectiveCurrency || 'USD'
        };
    };

    const formatPrice = (price, currency = 'USD') => {
        const symbols = {
            USD: '$', INR: '₹', CAD: 'C$', EUR: '€', GBP: '£',
            SAR: 'SAR ', AED: 'AED ', QAR: 'QAR ', KWD: 'KWD ', BHD: 'BHD ', OMR: 'OMR '
        };
        const symbol = symbols[currency] || '$';
        return `${symbol}${price.toFixed(2)}`;
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount, currency = 'USD') => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
        return formatter.format(amount);
    };

    const getPackageName = (packageType) => {
        switch (packageType) {
            case 'static': return 'Static Website';
            case 'dynamic': return 'Dynamic Website';
            case 'ecommerce': return 'E-commerce Website';
            default: return 'Custom Package';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-800';
            case 'in-progress': return 'bg-yellow-100 text-yellow-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryName = (category) => {
        switch (category) {
            case 'technical': return 'Technical Issue';
            case 'billing': return 'Billing Question';
            case 'feature': return 'Feature Request';
            case 'general': return 'General Support';
            default: return 'General Support';
        }
    };

    console.log('ClientPortal: Rendering with loading=', loading, 'user=', !!user, 'userData=', !!userData);

    if (loading) {
        console.log('ClientPortal: Showing loading state');
        return (
            <>
                <Head>
                    <title>Client Portal - Website14</title>
                    <meta name="description" content="Manage your website projects and quotes" />
                    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                </Head>

                <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
                    <Header />

                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading portal...</p>
                        </div>
                    </div>

                    <Footer />
                </div>
            </>
        );
    }

    console.log('ClientPortal: Showing main portal');

    return (
        <>
            <Head>
                <title>Client Portal - Website14</title>
                <meta name="description" content="Manage your website projects and quotes" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </Head>

            <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
                <Header />

                {/* Enhanced Navigation */}
                <nav className="bg-white border-b border-gray-200 mb-8">
                    <div className="max-w-6xl mx-auto px-5">
                        <div className="flex space-x-8">
                            {[
                                { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                                { id: 'projects', label: 'Projects', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                                { id: 'support', label: 'Support', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                                { id: 'billing', label: 'Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
                                { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${activeSection === item.id
                                        ? 'border-black text-black'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                    </svg>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>

                <div className="flex-1 py-8">
                    <div className="max-w-6xl mx-auto px-5">
                        {/* Dashboard Section */}
                        {activeSection === 'dashboard' && (
                            <Dashboard
                                userData={userData}
                                user={user}
                                projects={projects}
                                invoices={invoices}
                                tickets={tickets}
                                formatDate={formatDate}
                                formatCurrency={formatCurrency}
                                getPackageName={getPackageName}
                                getPriorityColor={getPriorityColor}
                                getStatusColor={getStatusColor}
                                getCategoryName={getCategoryName}
                                setActiveSection={setActiveSection}
                            />
                        )}

                        {/* Projects Section */}
                        {activeSection === 'projects' && (
                            <Projects
                                showProjectForm={showProjectForm}
                                setShowProjectForm={setShowProjectForm}
                                projectData={projectData}
                                setProjectData={setProjectData}
                                selectedCurrency={selectedCurrency}
                                setSelectedCurrency={setSelectedCurrency}
                                userLocation={userLocation}
                                effectiveCurrency={effectiveCurrency}
                                getCurrentPricing={getCurrentPricing}
                                formatPrice={formatPrice}
                                isCreatingProject={isCreatingProject}
                                handleProjectSubmit={handleProjectSubmit}
                                setActiveSection={setActiveSection}
                                projects={projects}
                                formatDate={formatDate}
                                getPackageName={getPackageName}
                                getStatusColor={getStatusColor}
                            />
                        )}

                        {/* Support Section */}
                        {activeSection === 'support' && (
                            <Support
                                showNewTicket={showNewTicket}
                                setShowNewTicket={setShowNewTicket}
                                newTicket={newTicket}
                                setNewTicket={setNewTicket}
                                submitting={submitting}
                                handleSubmitTicket={handleSubmitTicket}
                                tickets={tickets}
                                formatDate={formatDate}
                                getPriorityColor={getPriorityColor}
                                getStatusColor={getStatusColor}
                                getCategoryName={getCategoryName}
                                selectedTicket={selectedTicket}
                                setSelectedTicket={setSelectedTicket}
                                user={user}
                            />
                        )}

                        {/* Billing Section */}
                        {activeSection === 'billing' && (
                            <Billing
                                selectedCurrency={selectedCurrency}
                                setSelectedCurrency={setSelectedCurrency}
                                userLocation={userLocation}
                                effectiveCurrency={effectiveCurrency}
                                getCurrentPricing={getCurrentPricing}
                                formatPrice={formatPrice}
                                setActiveSection={setActiveSection}
                                invoices={invoices}
                                formatDate={formatDate}
                                formatCurrency={formatCurrency}
                            />
                        )}

                        {/* Profile Section */}
                        {activeSection === 'profile' && (
                            <Profile
                                user={user}
                                userData={userData}
                            />
                        )}
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
} 