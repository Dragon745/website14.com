import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { recaptchaConfig } from '../../recaptcha.config.js';
import {
    Step1BusinessAnalysis,
    Step2WebsiteGoals,
    Step3ContentNeeds,
    Step4UserExperience,
    Step5EcommerceAnalysis,
    Step6TechnicalRequirements,
    Step7TimelineBudget,
    Step8FinalRecommendation
} from './ProjectBuilderSteps';

export default function ProjectBuilderForm() {
    // Step management
    const [currentStep, setCurrentStep] = useState(1);
    const [totalSteps] = useState(8);
    const [stepHistory, setStepHistory] = useState([1]);

    // Form data with comprehensive structure
    const [formData, setFormData] = useState({
        // Step 1: Business Analysis
        businessName: '',
        businessType: '',
        industry: '',
        businessSize: '',
        currentOnlinePresence: '',
        currentWebsiteUrl: '',
        competitors: '',
        targetMarket: '',

        // Step 2: Website Goals
        primaryGoals: [],
        secondaryGoals: [],
        successMetrics: [],
        targetAudience: [],
        conversionGoals: [],

        // Step 3: Content Needs
        contentUpdateFrequency: '',
        contentTypes: [],
        contentOwnership: '',
        contentVolume: '',
        multilingualNeeds: '',

        // Step 4: User Experience
        userJourney: [],
        userFeatures: [],
        personalizationNeeds: '',
        accessibilityRequirements: [],
        mobileUsage: '',

        // Step 5: E-commerce Analysis
        sellingOnline: '',
        productTypes: [],
        productCount: '',
        paymentMethods: [],
        inventoryManagement: '',
        shippingOptions: [],

        // Step 6: Technical Requirements
        integrations: [],
        securityNeeds: [],
        performanceRequirements: '',
        scalabilityNeeds: '',
        complianceRequirements: [],

        // Step 7: Timeline & Budget
        timeline: '',
        budget: '',
        urgency: '',
        projectPhase: '',

        // Step 8: Final Recommendation
        recommendedPackage: '',
        recommendedAddons: [],
        confidenceScore: 0,
        reasoning: ''
    });

    // UI States
    const [isProcessing, setIsProcessing] = useState(false);
    const [backgroundData, setBackgroundData] = useState({});
    const [pricingData, setPricingData] = useState(null);
    const [isLoadingPricing, setIsLoadingPricing] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [recommendations, setRecommendations] = useState({
        features: [],
        pages: [],
        purpose: '',
        budget: '',
        timeline: ''
    });

    // Refs
    const formRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Load reCAPTCHA
    useEffect(() => {
        const loadRecaptcha = () => {
            if (typeof window !== 'undefined' && window.grecaptcha) {
                window.grecaptcha.ready(() => {
                    console.log('reCAPTCHA loaded successfully');
                });
            } else {
                setTimeout(loadRecaptcha, 100);
            }
        };

        if (recaptchaConfig.siteKey) {
            loadRecaptcha();
        }
    }, []);

    // Collect background data
    useEffect(() => {
        const collectBackgroundData = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();

                setBackgroundData({
                    ip: data.ip,
                    country: data.country_name,
                    city: data.city,
                    region: data.region,
                    currency: data.currency,
                    timezone: data.timezone,
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                    platform: navigator.platform,
                    screenResolution: `${screen.width}x${screen.height}`
                });
            } catch (error) {
                console.error('Error collecting background data:', error);
            }
        };

        collectBackgroundData();
    }, []);

    // Detect user location and load pricing
    useEffect(() => {
        const detectLocationAndLoadPricing = async () => {
            try {
                // Detect user location
                const response = await fetch('https://ipapi.co/json/');
                const locationData = await response.json();

                setUserLocation({
                    country: locationData.country_name,
                    city: locationData.city,
                    currency: locationData.currency,
                    ip: locationData.ip
                });

                // Load pricing data from Firestore
                const pricingDoc = await getDoc(doc(db, 'pricing', locationData.currency));

                if (pricingDoc.exists()) {
                    const data = pricingDoc.data();
                    console.log(`Loaded pricing for ${locationData.currency}:`, data);
                    setPricingData(data);
                } else {
                    console.log(`No pricing data found for ${locationData.currency}, falling back to USD`);
                    // Fallback to USD if currency not found
                    const usdPricingDoc = await getDoc(doc(db, 'pricing', 'USD'));
                    if (usdPricingDoc.exists()) {
                        const usdData = usdPricingDoc.data();
                        console.log('Loaded USD pricing:', usdData);
                        setPricingData(usdData);
                    } else {
                        console.log('No USD pricing found, using default');
                        setPricingData(defaultPricing);
                    }
                }
            } catch (error) {
                console.error('Error loading pricing:', error);
                setPricingData(defaultPricing);
            } finally {
                setIsLoadingPricing(false);
            }
        };

        detectLocationAndLoadPricing();
    }, []);

    // Generate smart recommendations based on business type
    const generateRecommendations = (businessType) => {
        const recommendations = {
            features: [],
            pages: [],
            purpose: '',
            budget: '',
            timeline: ''
        };

        // Industry-specific recommendations
        if (businessType.includes('Restaurant') || businessType.includes('Food')) {
            recommendations.features = ['Online Ordering', 'Menu Management', 'Reservation System', 'Customer Reviews'];
            recommendations.pages = ['Menu', 'Reservations', 'Location & Hours', 'About Us'];
            recommendations.purpose = 'Dynamic Website - Content management, blog, user accounts';
            recommendations.budget = 'Medium';
            recommendations.timeline = 'Soon (1-2 months)';
        } else if (businessType.includes('E-commerce') || businessType.includes('Store')) {
            recommendations.features = ['Product Catalog', 'Payment Processing', 'Inventory Management', 'Customer Accounts'];
            recommendations.pages = ['Products', 'Shopping Cart', 'Customer Login', 'About Us'];
            recommendations.purpose = 'E-commerce - Online store with products and payments';
            recommendations.budget = 'High';
            recommendations.timeline = 'Flexible (3-6 months)';
        } else if (businessType.includes('Medical') || businessType.includes('Healthcare')) {
            recommendations.features = ['Appointment Booking', 'Patient Portal', 'HIPAA Compliance', 'Online Forms'];
            recommendations.pages = ['Services', 'Appointments', 'Patient Portal', 'Contact'];
            recommendations.purpose = 'Dynamic Website - Content management, blog, user accounts';
            recommendations.budget = 'Medium';
            recommendations.timeline = 'Soon (1-2 months)';
        } else if (businessType.includes('Consulting') || businessType.includes('Professional')) {
            recommendations.features = ['Case Studies', 'Client Portal', 'Blog/Resources', 'Contact Forms'];
            recommendations.pages = ['Services', 'Case Studies', 'Blog', 'Contact'];
            recommendations.purpose = 'Dynamic Website - Content management, blog, user accounts';
            recommendations.budget = 'Medium';
            recommendations.timeline = 'Flexible (3-6 months)';
        } else {
            // Default recommendations
            recommendations.features = ['Contact Forms', 'About Us', 'Services', 'Testimonials'];
            recommendations.pages = ['Home', 'About Us', 'Services', 'Contact'];
            recommendations.purpose = 'Static Website - Simple information site';
            recommendations.budget = 'Low';
            recommendations.timeline = 'ASAP (1-2 weeks)';
        }

        return recommendations;
    };

    // Advanced package recommendation algorithm
    const determineRecommendedPackage = () => {
        let score = {
            static: 0,
            dynamic: 0,
            ecommerce: 0
        };

        // Business type analysis
        if (formData.businessType) {
            const businessType = formData.businessType.toLowerCase();
            if (businessType.includes('ecommerce') || businessType.includes('store') || businessType.includes('retail')) {
                score.ecommerce += 3;
            }
            if (businessType.includes('blog') || businessType.includes('news') || businessType.includes('media')) {
                score.dynamic += 2;
            }
            if (businessType.includes('restaurant') || businessType.includes('food')) {
                score.dynamic += 2;
            }
        }

        // Content needs analysis
        if (formData.contentUpdateFrequency) {
            if (formData.contentUpdateFrequency === 'Daily') {
                score.dynamic += 3;
            } else if (formData.contentUpdateFrequency === 'Weekly') {
                score.dynamic += 2;
            } else if (formData.contentUpdateFrequency === 'Monthly') {
                score.dynamic += 1;
            }
        }

        // User experience analysis
        if (formData.userFeatures && formData.userFeatures.length > 0) {
            if (formData.userFeatures.includes('User Accounts')) {
                score.dynamic += 2;
            }
            if (formData.userFeatures.includes('Member Areas')) {
                score.dynamic += 2;
            }
            if (formData.userFeatures.includes('Customer Portal')) {
                score.dynamic += 1;
            }
        }

        // E-commerce analysis
        if (formData.sellingOnline === 'Yes') {
            score.ecommerce += 4;
        }

        // Goals analysis
        if (formData.primaryGoals && formData.primaryGoals.includes('Sell Products Online')) {
            score.ecommerce += 3;
        }
        if (formData.primaryGoals && formData.primaryGoals.includes('Build Community')) {
            score.dynamic += 2;
        }
        if (formData.primaryGoals && formData.primaryGoals.includes('Share Content')) {
            score.dynamic += 2;
        }

        // Technical requirements
        if (formData.integrations && formData.integrations.length > 0) {
            score.dynamic += 1;
        }

        // Determine the winner
        if (score.ecommerce > score.dynamic && score.ecommerce > score.static) {
            return 'ecommerce';
        } else if (score.dynamic > score.static) {
            return 'dynamic';
        } else {
            return 'static';
        }
    };

    // Determine recommended add-ons
    const determineRecommendedAddons = () => {
        const addons = [];
        const packageType = determineRecommendedPackage();

        // Content management add-ons
        if (formData.contentUpdateFrequency === 'Daily' || formData.contentUpdateFrequency === 'Weekly') {
            addons.push('Advanced CMS');
        }

        // E-commerce add-ons
        if (packageType === 'ecommerce') {
            if (parseInt(formData.productCount) > 30) {
                addons.push('Extra Products');
            }
            if (formData.paymentMethods && formData.paymentMethods.length > 2) {
                addons.push('Extra Payment Gateways');
            }
        }

        // User experience add-ons
        if (formData.userFeatures && formData.userFeatures.includes('User Accounts')) {
            addons.push('User Dashboard');
        }

        // Special features
        if (formData.integrations && formData.integrations.includes('Google Maps')) {
            addons.push('Google Maps Integration');
        }
        if (formData.integrations && formData.integrations.includes('Social Media')) {
            addons.push('Social Media Integration');
        }

        return addons;
    };

    // Calculate confidence score
    const calculateConfidenceScore = () => {
        let score = 0;
        const totalQuestions = 8;
        let answeredQuestions = 0;

        // Check if key questions are answered
        if (formData.businessName) { score += 10; answeredQuestions++; }
        if (formData.businessType) { score += 10; answeredQuestions++; }
        if (formData.primaryGoals && formData.primaryGoals.length > 0) { score += 15; answeredQuestions++; }
        if (formData.contentUpdateFrequency) { score += 15; answeredQuestions++; }
        if (formData.userFeatures && formData.userFeatures.length > 0) { score += 15; answeredQuestions++; }
        if (formData.sellingOnline) { score += 10; answeredQuestions++; }
        if (formData.timeline) { score += 10; answeredQuestions++; }
        if (formData.budget) { score += 15; answeredQuestions++; }

        // Bonus points for detailed answers
        if (formData.primaryGoals && formData.primaryGoals.length > 2) score += 5;
        if (formData.userFeatures && formData.userFeatures.length > 2) score += 5;
        if (formData.integrations && formData.integrations.length > 0) score += 5;

        return Math.min(100, score);
    };

    // Get the recommended package purpose string
    const getRecommendedPackagePurpose = () => {
        const packageType = determineRecommendedPackage();
        switch (packageType) {
            case 'static':
                return 'Static Website - Simple information site';
            case 'dynamic':
                return 'Dynamic Website - Content management, blog, user accounts';
            case 'ecommerce':
                return 'E-commerce - Online store with products and payments';
            default:
                return 'Static Website - Simple information site';
        }
    };

    // Step navigation functions
    const nextStep = () => {
        if (currentStep < totalSteps) {
            const nextStepNumber = currentStep + 1;
            setCurrentStep(nextStepNumber);
            setStepHistory(prev => [...prev, nextStepNumber]);

            // Scroll to top of form
            if (formRef.current) {
                formRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const goToStep = (stepNumber) => {
        if (stepNumber >= 1 && stepNumber <= totalSteps) {
            setCurrentStep(stepNumber);
        }
    };

    // Form validation
    const validateStep = (step) => {
        const errors = {};

        switch (step) {
            case 1:
                if (!formData.businessName) errors.businessName = 'Please enter your business name';
                if (!formData.businessType) errors.businessType = 'Please select your business type';
                if (!formData.industry) errors.industry = 'Please select your industry';
                break;
            case 2:
                if (!formData.primaryGoals || formData.primaryGoals.length === 0) {
                    errors.primaryGoals = 'Please select at least one primary goal';
                }
                break;
            case 3:
                if (!formData.contentUpdateFrequency) {
                    errors.contentUpdateFrequency = 'Please select content update frequency';
                }
                break;
            case 4:
                if (!formData.userFeatures || formData.userFeatures.length === 0) {
                    errors.userFeatures = 'Please select user experience features';
                }
                break;
            case 5:
                if (!formData.sellingOnline) {
                    errors.sellingOnline = 'Please indicate if you plan to sell online';
                }
                break;
            case 6:
                // Technical requirements are optional
                break;
            case 7:
                if (!formData.timeline) errors.timeline = 'Please select your timeline';
                if (!formData.budget) errors.budget = 'Please select your budget';
                break;
            case 8:
                // Final recommendation step - no validation needed
                break;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Form handlers
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Update recommendations when business type changes
        if (field === 'businessType' && value) {
            const newRecommendations = generateRecommendations(value);
            setRecommendations(newRecommendations);
        }
    };

    const handleMultiSelect = (field, value) => {
        setFormData(prev => {
            const currentValues = prev[field] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(item => item !== value)
                : [...currentValues, value];
            return {
                ...prev,
                [field]: newValues
            };
        });
    };

    // Default USD pricing for fallback (only used when no database pricing is available)
    const defaultPricing = {
        static: { setup: 0, monthly: 0 },
        dynamic: { setup: 0, monthly: 0 },
        ecommerce: { setup: 0, monthly: 0 }
    };

    // Currency symbols
    const currencySymbols = {
        USD: '$',
        INR: '₹',
        CAD: 'C$',
        EUR: '€',
        GBP: '£',
        SAR: 'SAR ',
        AED: 'AED ',
        QAR: 'QAR ',
        KWD: 'KWD ',
        BHD: 'BHD ',
        OMR: 'OMR '
    };

    // Business types with enhanced categorization
    const businessTypes = {
        "Food & Beverage": [
            "Restaurant (Fine Dining)", "Restaurant (Casual)", "Restaurant (Fast Food)",
            "Food Truck", "Café & Coffee Shop", "Bakery & Pastry", "Catering Services",
            "Food Delivery & Takeout", "Brewery & Distillery", "Food Manufacturing",
            "Grocery Store & Market"
        ],
        "Retail & E-commerce": [
            "Online Store", "Physical Retail Store", "Fashion & Apparel",
            "Electronics & Technology", "Home & Garden", "Sports & Outdoor",
            "Toys & Games", "Jewelry & Accessories", "Books & Media",
            "Pet Supplies", "Art & Crafts"
        ],
        "Healthcare & Medical": [
            "Medical Practice (General)", "Medical Practice (Specialist)",
            "Dental Practice", "Veterinary Clinic", "Pharmacy", "Medical Equipment",
            "Mental Health Services", "Physical Therapy", "Alternative Medicine",
            "Medical Research", "Healthcare Technology"
        ],
        "Professional Services": [
            "Law Firm", "Accounting & Tax Services", "Consulting (Business)",
            "Consulting (IT)", "Consulting (HR)", "Marketing & Advertising",
            "Public Relations", "Financial Services", "Insurance", "Human Resources",
            "Translation Services", "Event Planning"
        ],
        "Technology & Startup": [
            "Software Development", "Web Development", "Mobile App Development",
            "IT Services & Support", "Cybersecurity", "Data Analytics",
            "Artificial Intelligence", "Blockchain & Cryptocurrency",
            "SaaS (Software as a Service)", "Tech Consulting"
        ],
        "Education & Training": [
            "Elementary School", "Middle School", "High School", "College & University",
            "Community College", "Technical Institute", "Vocational School",
            "Online Education", "Training & Certification", "Tutoring Services",
            "Language Learning", "Skills Development", "Corporate Training",
            "Educational Technology", "Private School", "Charter School",
            "International School", "Special Education", "Adult Education",
            "Continuing Education"
        ],
        "Real Estate": [
            "Real Estate Agency", "Property Management", "Construction Company",
            "Architecture Firm", "Interior Design", "Property Development",
            "Real Estate Investment", "Home Inspection", "Moving Services"
        ],
        "Manufacturing & Industrial": [
            "Manufacturing", "Industrial Equipment", "Chemical & Materials",
            "Textile & Apparel Manufacturing", "Food Processing", "Electronics Manufacturing",
            "Automotive Manufacturing", "Aerospace & Defense"
        ],
        "Construction & Contracting": [
            "General Contracting", "Electrical Services", "Plumbing Services",
            "HVAC Services", "Landscaping", "Roofing", "Painting", "Renovation",
            "Engineering Services"
        ],
        "Automotive & Transportation": [
            "Car Dealership", "Auto Repair & Maintenance", "Car Rental",
            "Transportation Services", "Logistics & Shipping", "Moving Company",
            "Fleet Management", "Auto Parts"
        ],
        "Beauty & Personal Care": [
            "Hair Salon", "Beauty Salon", "Spa & Wellness", "Nail Salon",
            "Barber Shop", "Cosmetics & Skincare", "Personal Training", "Massage Therapy"
        ],
        "Fitness & Wellness": [
            "Gym & Fitness Center", "Yoga Studio", "Personal Training",
            "Nutrition Services", "Wellness Coaching", "Sports Training",
            "Physical Therapy", "Mental Health Services"
        ],
        "Entertainment & Media": [
            "Entertainment Production", "Photography & Videography", "Music & Audio",
            "Gaming", "Broadcasting", "Publishing", "Event Production", "Talent Agency"
        ],
        "Non-profit & Charity": [
            "Charity Organization", "Foundation", "Religious Organization",
            "Community Service", "Environmental Organization", "Animal Welfare",
            "Educational Non-profit", "Healthcare Non-profit"
        ],
        "Government & Public Sector": [
            "Government Agency", "Public Service", "Municipal Services",
            "Public Safety", "Public Health", "Public Transportation", "Public Education"
        ],
        "Other Services": [
            "Cleaning Services", "Security Services", "Pest Control",
            "Waste Management", "Storage & Warehousing", "Printing & Publishing",
            "Research & Development", "Environmental Services", "Legal Services",
            "Financial Services", "Other"
        ]
    };

    // Get feature pricing from database
    const getFeaturePricing = () => {
        if (pricingData) {
            return {
                // Special Features
                'Contact Forms': pricingData.contactForms || 0,
                'Newsletter Signup': pricingData.newsletterSignup || 0,
                'Social Media Integration': pricingData.socialMediaIntegration || 0,
                'Google Maps Integration': pricingData.googleMapsIntegration || 0,
                'Booking/Appointment System': pricingData.bookingAppointmentSystem || 0,
                'Live Chat': pricingData.liveChat || 0,
                'Multi-language Support': pricingData.multiLanguageSupport || 0,
                'Search Functionality': pricingData.searchFunctionality || 0,
                'Image Gallery': pricingData.imageGallery || 0,
                'Video Integration': pricingData.videoIntegration || 0,

                // Content Management Features (these might need to be added to database structure)
                'Advanced CMS': pricingData.advancedCMS || 500,
                'Product Management': pricingData.productManagement || 300,
                'Blog Management': pricingData.blogManagement || 200,

                // User Features (these might need to be added to database structure)
                'User Dashboard': pricingData.userDashboard || 400,
                'User Profiles': pricingData.userProfiles || 300,
                'Member Areas': pricingData.memberAreas || 350,
                'Customer Accounts': pricingData.customerAccounts || 250
            };
        }
        // Fallback to default values if no database pricing
        return {
            'Contact Forms': 150,
            'Newsletter Signup': 100,
            'Social Media Integration': 200,
            'Google Maps Integration': 150,
            'Booking/Appointment System': 300,
            'Live Chat': 250,
            'Multi-language Support': 400,
            'Search Functionality': 200,
            'Image Gallery': 150,
            'Video Integration': 300,
            'Advanced CMS': 500,
            'Product Management': 300,
            'Blog Management': 200,
            'User Dashboard': 400,
            'User Profiles': 300,
            'Member Areas': 350,
            'Customer Accounts': 250
        };
    };

    // Get current pricing (either from Firestore or default)
    const getCurrentPricing = () => {
        if (pricingData && userLocation) {
            // Map flat Firestore data to nested structure
            const mappedPricing = {
                static: {
                    setup: pricingData.staticSetup || defaultPricing.static.setup,
                    monthly: pricingData.staticMonthly || defaultPricing.static.monthly
                },
                dynamic: {
                    setup: pricingData.dynamicSetup || defaultPricing.dynamic.setup,
                    monthly: pricingData.dynamicMonthly || defaultPricing.dynamic.monthly
                },
                ecommerce: {
                    setup: pricingData.ecommerceSetup || defaultPricing.ecommerce.setup,
                    monthly: pricingData.ecommerceMonthly || defaultPricing.ecommerce.monthly
                },
                currency: userLocation.currency
            };

            console.log('Mapped pricing data:', mappedPricing);
            return mappedPricing;
        }
        console.log('Using default pricing (no Firestore data)');
        return {
            ...defaultPricing,
            currency: 'USD'
        };
    };

    // Calculate quote based on form data
    const calculateQuote = () => {
        const currentPricing = getCurrentPricing();
        const featurePricing = getFeaturePricing();
        let basePrice = 0;
        let features = [];
        let featureBreakdown = [];

        // Get recommended package
        const recommendedPackage = determineRecommendedPackage();
        const recommendedPurpose = getRecommendedPackagePurpose();

        // Base price based on recommended package
        switch (recommendedPackage) {
            case 'static':
                basePrice = currentPricing.static.setup;
                features.push('Static Website', 'Mobile Responsive', 'Contact Form', 'Basic SEO');
                break;
            case 'dynamic':
                basePrice = currentPricing.dynamic.setup;
                features.push('Content Management System', 'Blog Functionality', 'User Accounts', 'Advanced SEO');
                break;
            case 'ecommerce':
                basePrice = currentPricing.ecommerce.setup;
                features.push('E-commerce Platform', 'Payment Processing', 'Product Management', 'Order Management');
                break;
            default:
                basePrice = currentPricing.static.setup;
        }

        // Add features based on content management
        if (formData.contentUpdateFrequency === 'Daily' || formData.contentUpdateFrequency === 'Weekly') {
            features.push('Advanced CMS');
            featureBreakdown.push({ name: 'Advanced CMS', price: featurePricing['Advanced CMS'] });
        } else if (formData.contentUpdateFrequency === 'Monthly') {
            features.push('Blog Management');
            featureBreakdown.push({ name: 'Blog Management', price: featurePricing['Blog Management'] });
        }

        // Add features based on user features
        if (formData.userFeatures && formData.userFeatures.includes('User Accounts')) {
            features.push('User Dashboard', 'User Profiles');
            featureBreakdown.push(
                { name: 'User Dashboard', price: featurePricing['User Dashboard'] },
                { name: 'User Profiles', price: featurePricing['User Profiles'] }
            );
        } else if (formData.userFeatures && formData.userFeatures.includes('Member Areas')) {
            features.push('Member Areas');
            featureBreakdown.push({ name: 'Member Areas', price: featurePricing['Member Areas'] });
        } else if (formData.userFeatures && formData.userFeatures.includes('Customer Portal')) {
            features.push('Customer Accounts');
            featureBreakdown.push({ name: 'Customer Accounts', price: featurePricing['Customer Accounts'] });
        }

        // Add e-commerce specific features
        if (recommendedPackage === 'ecommerce') {
            if (formData.productCount && parseInt(formData.productCount) > 30) {
                const extraProducts = parseInt(formData.productCount) - 30;
                const extraProductCost = extraProducts * (pricingData?.extraProduct || 20);
                featureBreakdown.push({ name: `${extraProducts} Extra Products`, price: extraProductCost });
            }
            if (formData.paymentMethods && formData.paymentMethods.length > 2) {
                const extraGateways = formData.paymentMethods.length - 2;
                const extraGatewayCost = extraGateways * (pricingData?.paymentGateway || 500);
                featureBreakdown.push({ name: `${extraGateways} Extra Payment Gateways`, price: extraGatewayCost });
            }
        }

        // Add special features based on integrations
        if (formData.integrations) {
            formData.integrations.forEach(integration => {
                if (integration === 'Google Maps' && featurePricing['Google Maps Integration']) {
                    features.push('Google Maps Integration');
                    featureBreakdown.push({ name: 'Google Maps Integration', price: featurePricing['Google Maps Integration'] });
                }
                if (integration === 'Social Media' && featurePricing['Social Media Integration']) {
                    features.push('Social Media Integration');
                    featureBreakdown.push({ name: 'Social Media Integration', price: featurePricing['Social Media Integration'] });
                }
            });
        }

        // Calculate total
        const featureCost = featureBreakdown.reduce((sum, feature) => sum + feature.price, 0);
        const finalPrice = basePrice + featureCost;

        return {
            basePrice,
            featureBreakdown,
            featureCost,
            finalPrice,
            features: [...new Set(features)], // Remove duplicates
            currency: currentPricing.currency,
            recommendedPackage,
            recommendedPurpose
        };
    };

    const quote = useMemo(() => calculateQuote(), [
        formData,
        pricingData,
        userLocation,
        determineRecommendedPackage,
        determineRecommendedAddons,
        calculateConfidenceScore
    ]);

    // Format price with currency symbol
    const formatPrice = (price, currency = 'USD') => {
        const symbol = currencySymbols[currency] || '$';
        return `${symbol}${price}`;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!auth.currentUser) {
            alert('Please login to submit your project request');
            return;
        }

        setIsProcessing(true);

        try {
            // Get reCAPTCHA token
            let recaptchaToken = '';
            if (window.grecaptcha && recaptchaConfig.siteKey) {
                recaptchaToken = await window.grecaptcha.execute(recaptchaConfig.siteKey, { action: 'submit_project' });
            }

            // Prepare lead data
            const leadData = {
                // User information
                name: formData.businessName,
                email: auth.currentUser.email,
                phone: '', // Could be added to form if needed
                message: `Project request for ${formData.businessName} - ${formData.businessType}`,

                // Project details
                businessType: formData.businessType,
                industry: formData.industry,
                recommendedPackage: determineRecommendedPackage(),
                recommendedAddons: determineRecommendedAddons(),
                confidenceScore: calculateConfidenceScore(),

                // Background data
                ...backgroundData,

                // Authentication
                userId: auth.currentUser.uid,
                userEmail: auth.currentUser.email,
                authenticatedUser: {
                    uid: auth.currentUser.uid,
                    email: auth.currentUser.email,
                    displayName: auth.currentUser.displayName
                },

                // Timestamps
                timestamp: serverTimestamp(),
                status: 'new',
                source: 'project-builder',
                recaptchaToken
            };

            // Save to Firestore
            const leadRef = await addDoc(collection(db, 'leads'), leadData);

            // Save quote data
            const quoteData = {
                userId: auth.currentUser.uid,
                leadId: leadRef.id,
                formData: formData,
                recommendedPackage: determineRecommendedPackage(),
                recommendedAddons: determineRecommendedAddons(),
                confidenceScore: calculateConfidenceScore(),
                quote: {
                    ...quote,
                    createdAt: new Date()
                },
                createdAt: new Date()
            };

            await addDoc(collection(db, 'quotes'), quoteData);

            // Store results in localStorage for quote page
            const builderResults = {
                formData: formData,
                recommendedPackage: determineRecommendedPackage(),
                recommendedAddons: determineRecommendedAddons(),
                confidenceScore: calculateConfidenceScore(),
                quote: quote,
                leadData: {
                    ...leadData,
                    id: leadRef.id
                }
            };

            localStorage.setItem('builderResults', JSON.stringify(builderResults));

            // Redirect to quote page
            window.location.href = '/quote';

        } catch (error) {
            console.error('Error submitting project:', error);
            alert('Error submitting project. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Update final recommendation when form data changes
    useEffect(() => {
        if (currentStep === 8) {
            const recommendedPackage = determineRecommendedPackage();
            const recommendedAddons = determineRecommendedAddons();
            const confidenceScore = calculateConfidenceScore();

            setFormData(prev => ({
                ...prev,
                recommendedPackage,
                recommendedAddons,
                confidenceScore
            }));
        }
    }, [formData, currentStep]);

    return (
        <div ref={formRef} className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Builder</h1>
                    <p className="text-gray-600">Let's build the perfect website for your business</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
                        <span className="text-sm font-medium text-gray-700">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Step Navigation */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
                            <button
                                key={step}
                                onClick={() => goToStep(step)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentStep === step
                                    ? 'bg-blue-600 text-white'
                                    : stepHistory.includes(step)
                                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                            >
                                Step {step}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            {/* Step content will be rendered here */}
                            <div className="min-h-[400px]">
                                {/* Step 1: Business Analysis */}
                                {currentStep === 1 && (
                                    <Step1BusinessAnalysis
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        businessTypes={businessTypes}
                                        validationErrors={validationErrors}
                                        recommendations={recommendations}
                                    />
                                )}

                                {/* Step 2: Website Goals */}
                                {currentStep === 2 && (
                                    <Step2WebsiteGoals
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        handleMultiSelect={handleMultiSelect}
                                        validationErrors={validationErrors}
                                        recommendations={recommendations}
                                    />
                                )}

                                {/* Step 3: Content Needs */}
                                {currentStep === 3 && (
                                    <Step3ContentNeeds
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        handleMultiSelect={handleMultiSelect}
                                        validationErrors={validationErrors}
                                        recommendations={recommendations}
                                    />
                                )}

                                {/* Step 4: User Experience */}
                                {currentStep === 4 && (
                                    <Step4UserExperience
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        handleMultiSelect={handleMultiSelect}
                                        validationErrors={validationErrors}
                                        recommendations={recommendations}
                                    />
                                )}

                                {/* Step 5: E-commerce Analysis */}
                                {currentStep === 5 && (
                                    <Step5EcommerceAnalysis
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        handleMultiSelect={handleMultiSelect}
                                        validationErrors={validationErrors}
                                    />
                                )}

                                {/* Step 6: Technical Requirements */}
                                {currentStep === 6 && (
                                    <Step6TechnicalRequirements
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        handleMultiSelect={handleMultiSelect}
                                        validationErrors={validationErrors}
                                    />
                                )}

                                {/* Step 7: Timeline & Budget */}
                                {currentStep === 7 && (
                                    <Step7TimelineBudget
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        validationErrors={validationErrors}
                                    />
                                )}

                                {/* Step 8: Final Recommendation */}
                                {currentStep === 8 && (
                                    <Step8FinalRecommendation
                                        formData={formData}
                                        quote={quote}
                                        formatPrice={formatPrice}
                                        recommendations={recommendations}
                                    />
                                )}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                                <button
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                {currentStep < totalSteps ? (
                                    <button
                                        onClick={() => {
                                            if (validateStep(currentStep)) {
                                                nextStep();
                                            }
                                        }}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isProcessing || isLoadingPricing || !validateStep(currentStep)}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isProcessing ? 'Processing...' : 'Create Project'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quote Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Quote</h2>

                            <div className="space-y-4">
                                {isLoadingPricing ? (
                                    <div className="text-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                        <p className="text-sm text-gray-600">Loading pricing...</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Base Price */}
                                        <div className="border-b border-gray-200 pb-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-lg font-medium text-gray-700">Base Price:</span>
                                                <span className="text-lg font-bold text-gray-900">{formatPrice(quote.basePrice, quote.currency)}</span>
                                            </div>
                                        </div>

                                        {/* Feature Breakdown */}
                                        {quote.featureBreakdown && quote.featureBreakdown.length > 0 && (
                                            <div className="border-b border-gray-200 pb-4">
                                                <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Features:</h3>
                                                <div className="space-y-2">
                                                    {quote.featureBreakdown.map((feature, index) => (
                                                        <div key={index} className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-600">+ {feature.name}</span>
                                                            <span className="text-gray-900 font-medium">{formatPrice(feature.price, quote.currency)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                                    <span className="text-sm font-medium text-gray-700">Features Total:</span>
                                                    <span className="text-sm font-bold text-gray-900">{formatPrice(quote.featureCost, quote.currency)}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Total Price */}
                                        <div className="pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xl font-bold text-gray-900">Total Price:</span>
                                                <span className="text-xl font-bold text-blue-600">{formatPrice(quote.finalPrice, quote.currency)}</span>
                                            </div>
                                        </div>

                                        {/* All Features List */}
                                        <div className="mt-4">
                                            <h3 className="text-sm font-medium text-gray-700 mb-2">All Included Features:</h3>
                                            <ul className="space-y-1">
                                                {quote.features.map((feature, index) => (
                                                    <li key={index} className="text-sm text-gray-600 flex items-center">
                                                        <span className="text-green-500 mr-2">✓</span>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {!auth.currentUser && (
                                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                                <p className="text-sm text-blue-800 text-center">
                                                    You'll need to login or signup to create your project
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}