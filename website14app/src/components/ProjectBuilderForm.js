import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { recaptchaConfig } from '../../recaptcha.config.js';

export default function ProjectBuilderForm() {
    const [formData, setFormData] = useState({
        businessType: '',
        currentWebsite: '',
        currentWebsiteUrl: '',
        primaryPurpose: '',
        contentManagement: '',
        userFeatures: '',
        productCount: '',
        paymentMethods: [],
        pages: [],
        specialFeatures: [],
        timeline: ''
    });

    const [customPages, setCustomPages] = useState([]);
    const [customPageInput, setCustomPageInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [backgroundData, setBackgroundData] = useState({});

    // Load reCAPTCHA script
    useEffect(() => {
        const loadRecaptcha = () => {
            if (typeof window !== 'undefined' && !window.grecaptcha) {
                const script = document.createElement('script');
                script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaConfig.siteKey}`;
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);
            }
        };

        loadRecaptcha();
    }, []);

    // Collect background data on component mount
    useEffect(() => {
        const collectBackgroundData = async () => {
            const data = {
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                screenResolution: `${screen.width}x${screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                timestamp: new Date().toISOString()
            };

            try {
                const response = await fetch('https://ipapi.co/json/');
                const locationData = await response.json();
                data.ipAddress = locationData.ip;
                data.country = locationData.country_name;
                data.city = locationData.city;
                data.region = locationData.region;
                data.currency = locationData.currency;
                data.timezone = locationData.timezone;
            } catch (error) {
                console.log('Could not fetch location data:', error);
            }

            setBackgroundData(data);
        };

        collectBackgroundData();
    }, []);

    const businessTypes = [
        // Food & Beverage
        "Restaurant (Fine Dining)", "Restaurant (Casual)", "Restaurant (Fast Food)", "Food Truck", "Café & Coffee Shop", "Bakery & Pastry", "Catering Services", "Food Delivery & Takeout", "Brewery & Distillery", "Food Manufacturing", "Grocery Store & Market",
        // Retail & E-commerce
        "Online Store", "Physical Retail Store", "Fashion & Apparel", "Electronics & Technology", "Home & Garden", "Sports & Outdoor", "Toys & Games", "Jewelry & Accessories", "Books & Media", "Pet Supplies", "Art & Crafts",
        // Healthcare & Medical
        "Medical Practice (General)", "Medical Practice (Specialist)", "Dental Practice", "Veterinary Clinic", "Pharmacy", "Medical Equipment", "Mental Health Services", "Physical Therapy", "Alternative Medicine", "Medical Research", "Healthcare Technology",
        // Real Estate
        "Real Estate Agency", "Property Management", "Construction Company", "Architecture Firm", "Interior Design", "Property Development", "Real Estate Investment", "Home Inspection", "Moving Services",
        // Professional Services
        "Law Firm", "Accounting & Tax Services", "Consulting (Business)", "Consulting (IT)", "Consulting (HR)", "Marketing & Advertising", "Public Relations", "Financial Services", "Insurance", "Human Resources", "Translation Services", "Event Planning",
        // Technology & Startup
        "Software Development", "Web Development", "Mobile App Development", "IT Services & Support", "Cybersecurity", "Data Analytics", "Artificial Intelligence", "Blockchain & Cryptocurrency", "SaaS (Software as a Service)", "Tech Consulting",
        // Education & Training
        "Elementary School", "Middle School", "High School", "College & University", "Community College", "Technical Institute", "Vocational School", "Online Education", "Training & Certification", "Tutoring Services", "Language Learning", "Skills Development", "Corporate Training", "Educational Technology", "Private School", "Charter School", "International School", "Special Education", "Adult Education", "Continuing Education",
        // Manufacturing & Industrial
        "Manufacturing", "Industrial Equipment", "Chemical & Materials", "Textile & Apparel Manufacturing", "Food Processing", "Electronics Manufacturing", "Automotive Manufacturing", "Aerospace & Defense",
        // Construction & Contracting
        "General Contracting", "Electrical Services", "Plumbing Services", "HVAC Services", "Landscaping", "Roofing", "Painting", "Renovation", "Engineering Services",
        // Automotive & Transportation
        "Car Dealership", "Auto Repair & Maintenance", "Car Rental", "Transportation Services", "Logistics & Shipping", "Moving Company", "Fleet Management", "Auto Parts",
        // Beauty & Personal Care
        "Hair Salon", "Beauty Salon", "Spa & Wellness", "Nail Salon", "Barber Shop", "Cosmetics & Skincare", "Personal Training", "Massage Therapy",
        // Fitness & Wellness
        "Gym & Fitness Center", "Yoga Studio", "Personal Training", "Nutrition Services", "Wellness Coaching", "Sports Training", "Physical Therapy", "Mental Health Services",
        // Entertainment & Media
        "Entertainment Production", "Photography & Videography", "Music & Audio", "Gaming", "Broadcasting", "Publishing", "Event Production", "Talent Agency",
        // Non-profit & Charity
        "Charity Organization", "Foundation", "Religious Organization", "Community Service", "Environmental Organization", "Animal Welfare", "Educational Non-profit", "Healthcare Non-profit",
        // Government & Public Sector
        "Government Agency", "Public Service", "Municipal Services", "Public Safety", "Public Health", "Public Transportation", "Public Education",
        // Other Services
        "Cleaning Services", "Security Services", "Pest Control", "Waste Management", "Storage & Warehousing", "Printing & Publishing", "Research & Development", "Environmental Services", "Legal Services", "Financial Services",
        "Other"
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleMultiSelect = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(item => item !== value)
                : [...prev[field], value]
        }));
    };

    const handleAddCustomPage = () => {
        if (customPageInput.trim() && !customPages.includes(customPageInput.trim())) {
            setCustomPages(prev => [...prev, customPageInput.trim()]);
            setCustomPageInput('');
        }
    };

    const handleRemoveCustomPage = (page) => {
        setCustomPages(prev => prev.filter(p => p !== page));
    };

    // Calculate quote based on form data
    const calculateQuote = () => {
        let basePrice = 0;
        let complexity = 0;
        let features = [];

        // Base price based on primary purpose
        switch (formData.primaryPurpose) {
            case 'Static Website - Simple information site':
                basePrice = 999;
                features.push('Static Website', 'Mobile Responsive', 'Contact Form', 'Basic SEO');
                break;
            case 'Dynamic Website - Content management, blog, user accounts':
                basePrice = 1999;
                features.push('Content Management System', 'Blog Functionality', 'User Accounts', 'Advanced SEO');
                complexity += 2;
                break;
            case 'E-commerce - Online store with products and payments':
                basePrice = 2999;
                features.push('E-commerce Platform', 'Payment Processing', 'Product Management', 'Order Management');
                complexity += 3;
                break;
            default:
                basePrice = 999;
        }

        // Add complexity based on content management
        if (formData.contentManagement === 'Yes, I need full content management system') {
            complexity += 2;
            features.push('Advanced CMS');
        } else if (formData.contentManagement === 'Yes, I need to update products/services frequently') {
            complexity += 1;
            features.push('Product Management');
        } else if (formData.contentManagement === 'Yes, I want to add blog posts') {
            complexity += 1;
            features.push('Blog Management');
        }

        // Add complexity based on user features
        if (formData.userFeatures === 'Yes, user dashboard and profiles') {
            complexity += 2;
            features.push('User Dashboard', 'User Profiles');
        } else if (formData.userFeatures === 'Yes, member-only content areas') {
            complexity += 1;
            features.push('Member Areas');
        } else if (formData.userFeatures === 'Yes, customer accounts for purchases') {
            complexity += 1;
            features.push('Customer Accounts');
        }

        // Add complexity based on special features
        if (formData.specialFeatures.length > 0) {
            complexity += formData.specialFeatures.length * 0.5;
            features.push(...formData.specialFeatures);
        }

        // Add complexity based on pages
        const totalPages = formData.pages.length + customPages.length;
        if (totalPages > 5) {
            complexity += 1;
        }

        // Add complexity based on e-commerce features
        if (formData.productCount && parseInt(formData.productCount) > 100) {
            complexity += 1;
        }

        if (formData.paymentMethods.length > 1) {
            complexity += 0.5;
        }

        // Calculate final price
        const finalPrice = basePrice + (complexity * 200);

        return {
            basePrice,
            complexity,
            finalPrice,
            features: [...new Set(features)] // Remove duplicates
        };
    };

    const quote = calculateQuote();

    const handleSubmit = async () => {
        if (!auth.currentUser) {
            // Redirect to login/signup
            window.location.href = '/login?redirect=builder';
            return;
        }

        setIsProcessing(true);

        try {
            // Get reCAPTCHA token
            let recaptchaToken = null;
            try {
                recaptchaToken = await new Promise((resolve, reject) => {
                    if (typeof window !== 'undefined' && window.grecaptcha) {
                        window.grecaptcha.ready(() => {
                            window.grecaptcha.execute(recaptchaConfig.siteKey, { action: 'project_builder' })
                                .then(token => {
                                    if (!token || token.length < 10) {
                                        reject(new Error('Invalid reCAPTCHA token received'));
                                    } else {
                                        resolve(token);
                                    }
                                })
                                .catch(error => {
                                    console.error('reCAPTCHA execution error:', error);
                                    reject(new Error('reCAPTCHA verification failed'));
                                });
                        });
                    } else {
                        reject(new Error('reCAPTCHA not loaded'));
                    }
                });
            } catch (error) {
                console.error('reCAPTCHA error:', error);
                setIsProcessing(false);
                return;
            }

            // Note: reCAPTCHA verification is handled client-side for static site
            // The token is included in the data for server-side verification if needed

            // Save to Firestore
            const projectData = {
                ...formData,
                customPages,
                ...backgroundData,
                recaptchaToken,
                quote,
                timestamp: serverTimestamp(),
                status: 'new',
                source: 'project-builder',
                userId: auth.currentUser.uid,
                userEmail: auth.currentUser.email,
                authenticatedUser: {
                    uid: auth.currentUser.uid,
                    email: auth.currentUser.email,
                    displayName: auth.currentUser.displayName
                }
            };

            await addDoc(collection(db, 'projects'), projectData);
            console.log('Project data saved to Firestore');

            // Redirect to project dashboard or payment
            window.location.href = '/dashboard/projects';

        } catch (error) {
            console.error('Error saving project:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Builder</h1>
                    <p className="text-xl text-gray-600">Build your perfect website with our interactive form</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <form className="space-y-6">
                                {/* Business Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        What type of business do you have? *
                                    </label>
                                    <select
                                        value={formData.businessType}
                                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select your business type</option>
                                        {businessTypes.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Current Website */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Do you currently have a website?
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            "No, this is my first website",
                                            "Yes, but it's outdated",
                                            "Yes, but I need a new one",
                                            "Yes, but I want to improve it"
                                        ].map((option) => (
                                            <label key={option} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="currentWebsite"
                                                    value={option}
                                                    checked={formData.currentWebsite === option}
                                                    onChange={(e) => handleInputChange('currentWebsite', e.target.value)}
                                                    className="mr-2"
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Website URL */}
                                {formData.currentWebsite && formData.currentWebsite.includes("Yes") && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            What's your current website URL?
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.currentWebsiteUrl}
                                            onChange={(e) => handleInputChange('currentWebsiteUrl', e.target.value)}
                                            placeholder="Enter your website URL"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                )}

                                {/* Primary Purpose */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        What is the main purpose of your website? *
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            "Static Website - Simple information site",
                                            "Dynamic Website - Content management, blog, user accounts",
                                            "E-commerce - Online store with products and payments"
                                        ].map((option) => (
                                            <label key={option} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="primaryPurpose"
                                                    value={option}
                                                    checked={formData.primaryPurpose === option}
                                                    onChange={(e) => handleInputChange('primaryPurpose', e.target.value)}
                                                    className="mr-2"
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Content Management */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Do you need to update content regularly?
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            "No, static content is fine",
                                            "Yes, I want to add blog posts",
                                            "Yes, I need to update products/services frequently",
                                            "Yes, I need full content management system"
                                        ].map((option) => (
                                            <label key={option} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="contentManagement"
                                                    value={option}
                                                    checked={formData.contentManagement === option}
                                                    onChange={(e) => handleInputChange('contentManagement', e.target.value)}
                                                    className="mr-2"
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* User Features */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Do you need user accounts or member areas?
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            "No user accounts needed",
                                            "Yes, customer accounts for purchases",
                                            "Yes, member-only content areas",
                                            "Yes, user dashboard and profiles"
                                        ].map((option) => (
                                            <label key={option} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="userFeatures"
                                                    value={option}
                                                    checked={formData.userFeatures === option}
                                                    onChange={(e) => handleInputChange('userFeatures', e.target.value)}
                                                    className="mr-2"
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Product Count */}
                                {formData.primaryPurpose === "E-commerce - Online store with products and payments" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            How many products will you sell?
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.productCount}
                                            onChange={(e) => handleInputChange('productCount', e.target.value)}
                                            placeholder="Enter number of products"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                )}

                                {/* Payment Methods */}
                                {formData.primaryPurpose === "E-commerce - Online store with products and payments" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Which payment methods do you need? (select all that apply)
                                        </label>
                                        <div className="space-y-2">
                                            {[
                                                "PayPal",
                                                "Credit/Debit Cards (Stripe)",
                                                "Bank Transfer",
                                                "Cash on Delivery"
                                            ].map((option) => (
                                                <label key={option} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        value={option}
                                                        checked={formData.paymentMethods.includes(option)}
                                                        onChange={(e) => handleMultiSelect('paymentMethods', option)}
                                                        className="mr-2"
                                                    />
                                                    {option}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Pages */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        What pages do you need on your website? (select all that apply)
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            "Home Page",
                                            "About Us",
                                            "Services/Products",
                                            "Contact Page",
                                            "Blog/News",
                                            "Testimonials/Reviews",
                                            "FAQ",
                                            "Privacy Policy",
                                            "Terms of Service"
                                        ].map((option) => (
                                            <label key={option} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    checked={formData.pages.includes(option)}
                                                    onChange={(e) => handleMultiSelect('pages', option)}
                                                    className="mr-2"
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>

                                    {/* Custom Pages */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Add custom pages:
                                        </label>
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                value={customPageInput}
                                                onChange={(e) => setCustomPageInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomPage()}
                                                placeholder="Enter page name..."
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddCustomPage}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        {customPages.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600 mb-1">Custom pages:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {customPages.map((page, index) => (
                                                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center">
                                                            {page}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveCustomPage(page)}
                                                                className="ml-1 text-blue-600 hover:text-blue-800"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Special Features */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        What special features do you need? (select all that apply)
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            "Contact Forms",
                                            "Newsletter Signup",
                                            "Social Media Integration",
                                            "Google Maps Integration",
                                            "Booking/Appointment System",
                                            "Live Chat",
                                            "Multi-language Support",
                                            "Search Functionality",
                                            "Image Gallery",
                                            "Video Integration"
                                        ].map((option) => (
                                            <label key={option} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    checked={formData.specialFeatures.includes(option)}
                                                    onChange={(e) => handleMultiSelect('specialFeatures', option)}
                                                    className="mr-2"
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        What's your timeline for this project?
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            "ASAP (1-2 weeks)",
                                            "Soon (1-2 months)",
                                            "Flexible (3-6 months)",
                                            "No rush (6+ months)"
                                        ].map((option) => (
                                            <label key={option} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="timeline"
                                                    value={option}
                                                    checked={formData.timeline === option}
                                                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                                                    className="mr-2"
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Quote Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Quote</h2>

                            <div className="space-y-4">
                                <div className="border-b border-gray-200 pb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-medium text-gray-700">Base Price:</span>
                                        <span className="text-lg font-bold text-gray-900">${quote.basePrice}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Complexity:</span>
                                        <span className="text-sm font-medium text-gray-900">{quote.complexity.toFixed(1)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Complexity Cost:</span>
                                        <span className="text-sm font-medium text-gray-900">${(quote.complexity * 200).toFixed(0)}</span>
                                    </div>
                                </div>

                                <div className="border-b border-gray-200 pb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-gray-900">Total Price:</span>
                                        <span className="text-2xl font-bold text-blue-600">${quote.finalPrice.toFixed(0)}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-700 mb-2">Included Features:</h3>
                                    <ul className="space-y-1">
                                        {quote.features.map((feature, index) => (
                                            <li key={index} className="text-sm text-gray-600 flex items-center">
                                                <span className="text-green-500 mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isProcessing || !formData.businessType || !formData.primaryPurpose}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    {isProcessing ? 'Processing...' : auth.currentUser ? 'Create Project' : 'Login to Continue'}
                                </button>

                                {!auth.currentUser && (
                                    <p className="text-sm text-gray-600 text-center">
                                        You'll need to login or signup to create your project
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 