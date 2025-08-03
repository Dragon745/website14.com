import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../../lib/firebase';
import { collection, query, where, getDocs, getDoc, doc, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ClientNav from '../../components/ClientNav';

export default function ClientPortal() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [quotes, setQuotes] = useState([]);
    const [leads, setLeads] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [showNewTicket, setShowNewTicket] = useState(false);
    const [newTicket, setNewTicket] = useState({
        subject: '',
        message: '',
        priority: 'medium',
        category: 'general'
    });
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

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
            } else {
                console.log('ClientPortal: No user, redirecting to login');
                router.push('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

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
                                { id: 'billing', label: 'Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' }
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
                            <div className="animate-fadeIn">
                                {/* Header */}
                                <div className="mb-8">
                                    <h1 className="font-jetbrains text-4xl font-bold text-black mb-2">
                                        Welcome back, {userData?.name || user.email}!
                                    </h1>
                                    <p className="text-gray-600">
                                        Manage your website projects and view your quotes
                                    </p>
                                </div>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    <button
                                        onClick={() => window.open('/builder', '_blank')}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-black">New Project</h3>
                                                <p className="text-sm text-gray-600">Start a new website project</p>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setActiveSection('support')}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-black">Support Tickets</h3>
                                                <p className="text-sm text-gray-600">Create and manage tickets</p>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setActiveSection('projects')}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-black">Project Management</h3>
                                                <p className="text-sm text-gray-600">Track project progress</p>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setActiveSection('billing')}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-black">Billing</h3>
                                                <p className="text-sm text-gray-600">View invoices and payments</p>
                                            </div>
                                        </div>
                                    </button>
                                </div>

                                {/* Recent Quotes */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                                    <h2 className="text-2xl font-bold text-black mb-4">Recent Quotes</h2>
                                    {quotes.length > 0 ? (
                                        <div className="space-y-4">
                                            {quotes.map((quote) => (
                                                <div key={quote.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold text-black">
                                                                {getPackageName(quote.recommendedPackage)}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                Created: {formatDate(quote.createdAt)}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Business: {quote.formData?.businessType || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-black">
                                                                {formatCurrency(quote.quote?.setupFee || 0, quote.quote?.currency || 'USD')}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Setup Fee
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-600 mb-4">No quotes yet</p>
                                            <Link
                                                href="/builder"
                                                className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                            >
                                                Get Your First Quote
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Recent Leads */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-2xl font-bold text-black mb-4">Recent Inquiries</h2>
                                    {leads.length > 0 ? (
                                        <div className="space-y-4">
                                            {leads.map((lead) => (
                                                <div key={lead.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold text-black">
                                                                {lead.industry || 'General Inquiry'}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                Submitted: {formatDate(lead.createdAt)}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Status: <span className="capitalize">{lead.status}</span>
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                                                lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                                                                    lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {lead.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-600 mb-4">No inquiries yet</p>
                                            <Link
                                                href="/contact"
                                                className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                            >
                                                Contact Us
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Projects Section */}
                        {activeSection === 'projects' && (
                            <div className="animate-fadeIn">
                                <div className="mb-8">
                                    <h1 className="font-jetbrains text-4xl font-bold text-black mb-2">
                                        Project Management
                                    </h1>
                                    <p className="text-gray-600">
                                        Track the progress of your website projects
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-black mb-2">Project Management Coming Soon</h3>
                                        <p className="text-gray-600 mb-6">We're working on bringing you detailed project tracking and management features.</p>
                                        <button
                                            onClick={() => window.open('/builder', '_blank')}
                                            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            Start New Project
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Support Section */}
                        {activeSection === 'support' && (
                            <div className="animate-fadeIn">
                                <div className="mb-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="font-jetbrains text-4xl font-bold text-black mb-2">
                                                Support Tickets
                                            </h1>
                                            <p className="text-gray-600">
                                                Get help with your website project or billing questions
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setShowNewTicket(true)}
                                            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            New Ticket
                                        </button>
                                    </div>
                                </div>

                                {/* New Ticket Form */}
                                {showNewTicket && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-bold text-black">Create New Ticket</h2>
                                            <button
                                                onClick={() => setShowNewTicket(false)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <form onSubmit={handleSubmitTicket} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Subject *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={newTicket.subject}
                                                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                    placeholder="Brief description of your issue"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Category
                                                    </label>
                                                    <select
                                                        value={newTicket.category}
                                                        onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                    >
                                                        <option value="general">General Support</option>
                                                        <option value="technical">Technical Issue</option>
                                                        <option value="billing">Billing Question</option>
                                                        <option value="feature">Feature Request</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Priority
                                                    </label>
                                                    <select
                                                        value={newTicket.priority}
                                                        onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                    >
                                                        <option value="low">Low</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="high">High</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Message *
                                                </label>
                                                <textarea
                                                    required
                                                    rows={6}
                                                    value={newTicket.message}
                                                    onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                    placeholder="Please describe your issue in detail..."
                                                />
                                            </div>

                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewTicket(false)}
                                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={submitting}
                                                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                                                >
                                                    {submitting ? 'Creating...' : 'Create Ticket'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Tickets List */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-2xl font-bold text-black mb-6">Your Support Tickets</h2>
                                    {tickets.length > 0 ? (
                                        <div className="space-y-4">
                                            {tickets.map((ticket) => (
                                                <div key={ticket.id} className="border border-gray-200 rounded-lg p-6">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-3 mb-2">
                                                                <h3 className="font-semibold text-black">
                                                                    {ticket.subject}
                                                                </h3>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                                                    {ticket.status}
                                                                </span>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                                                    {ticket.priority}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 mb-2">
                                                                Category: {getCategoryName(ticket.category)}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Created: {formatDate(ticket.createdAt)}
                                                            </p>
                                                            {ticket.message && (
                                                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                                    {ticket.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex space-x-2 mt-4 md:mt-0">
                                                            <Link
                                                                href={`/contact?ticket=${ticket.id}`}
                                                                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                                                            >
                                                                View Details
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold text-black mb-2">No tickets yet</h3>
                                            <p className="text-gray-600 mb-6">Create your first support ticket to get help</p>
                                            <button
                                                onClick={() => setShowNewTicket(true)}
                                                className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                            >
                                                Create First Ticket
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Support Information */}
                                <div className="bg-blue-50 rounded-lg p-6 mt-8">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-black mb-2">Need Immediate Help?</h3>
                                            <p className="text-gray-600 mb-4">
                                                For urgent issues or quick questions, you can also contact us directly through our contact form.
                                            </p>
                                            <Link
                                                href="/contact"
                                                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Contact Support
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Billing Section */}
                        {activeSection === 'billing' && (
                            <div className="animate-fadeIn">
                                <div className="mb-8">
                                    <h1 className="font-jetbrains text-4xl font-bold text-black mb-2">
                                        Billing & Payments
                                    </h1>
                                    <p className="text-gray-600">
                                        View your invoices and manage payments
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-black mb-2">Billing Features Coming Soon</h3>
                                        <p className="text-gray-600 mb-6">We're working on bringing you comprehensive billing and payment management features.</p>
                                        <button
                                            onClick={() => setActiveSection('support')}
                                            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            Contact Support
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
} 