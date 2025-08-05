import { useState } from 'react';
import { usePricing } from '../hooks/usePricing';

export default function Projects({
    showProjectForm,
    setShowProjectForm,
    projectData,
    setProjectData,
    selectedCurrency,
    setSelectedCurrency,
    userLocation,
    effectiveCurrency,
    getCurrentPricing,
    formatPrice,
    isCreatingProject,
    handleProjectSubmit,
    setActiveSection,
    projects,
    formatDate,
    getPackageName,
    getStatusColor
}) {
    // Debug logging
    console.log('Projects component: projects prop received:', projects);
    console.log('Projects component: projects length:', projects?.length);

    // Use the pricing hook for dynamic pricing
    const { pricingData, isLoading: pricingLoading } = usePricing(effectiveCurrency);

    // Business types with comprehensive list
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

    // All business types flattened for autocomplete
    const allBusinessTypes = Object.values(businessTypes).flat();

    // Get dynamic addon options based on pricing data
    const getAddonOptions = () => {
        if (!pricingData) return [];

        return [
            { id: 'logoDesign', name: 'Logo Design', price: pricingData.logoDesign || 15, type: 'setup', description: 'Professional logo design' },
            { id: 'extraPaymentGateway', name: 'Extra Payment Gateway', price: pricingData.paymentGateway || 5, type: 'setup', description: 'Additional payment methods' },
            { id: 'contactForms', name: 'Contact Forms', price: pricingData.contactForms || 2, type: 'setup', description: 'Advanced contact forms' },
            { id: 'newsletterSignup', name: 'Newsletter Signup', price: pricingData.newsletterSignup || 2.5, type: 'setup', description: 'Email newsletter integration' },
            { id: 'socialMediaIntegration', name: 'Social Media Integration', price: pricingData.socialMediaIntegration || 4, type: 'setup', description: 'Social media feeds and sharing' },
            { id: 'googleMapsIntegration', name: 'Google Maps Integration', price: pricingData.googleMapsIntegration || 3, type: 'setup', description: 'Interactive maps and location services' },
            { id: 'bookingAppointmentSystem', name: 'Booking System', price: pricingData.bookingAppointmentSystem || 10, type: 'setup', description: 'Appointment booking functionality' },
            { id: 'liveChat', name: 'Live Chat', price: pricingData.liveChat || 5, type: 'setup', description: 'Real-time customer support chat' },
            { id: 'multiLanguageSupport', name: 'Multi-language Support', price: pricingData.multiLanguageSupport || 8, type: 'setup', description: 'Multiple language support' },
            { id: 'searchFunctionality', name: 'Search Functionality', price: pricingData.searchFunctionality || 2.5, type: 'setup', description: 'Advanced search features' },
            { id: 'imageGallery', name: 'Image Gallery', price: pricingData.imageGallery || 2, type: 'setup', description: 'Professional image galleries' },
            { id: 'videoIntegration', name: 'Video Integration', price: pricingData.videoIntegration || 4, type: 'setup', description: 'Video hosting and streaming' }
        ];
    };

    // Calculate email cost based on quantity and duration
    const calculateEmailCost = () => {
        const emailPrice = pricingData?.emailAccount || 2.4;
        const emailQuantity = projectData.emailAccountQuantity || 0;
        const emailDuration = projectData.emailDuration || 'monthly';
        const discount = getCurrentPricing().discounts?.[emailDuration] || 0;

        let totalEmailCost = emailPrice * emailQuantity;

        switch (emailDuration) {
            case 'yearly':
                totalEmailCost = emailPrice * 10 * emailQuantity * (1 - discount / 100);
                break;
            case 'twoYear':
                totalEmailCost = emailPrice * 18 * emailQuantity * (1 - discount / 100);
                break;
            case 'threeYear':
                totalEmailCost = emailPrice * 25 * emailQuantity * (1 - discount / 100);
                break;
        }

        return {
            totalCost: totalEmailCost,
            perAccount: emailPrice,
            quantity: emailQuantity,
            duration: emailDuration,
            discount: discount
        };
    };

    // Calculate total pages and extra pages
    const calculatePages = () => {
        const totalSelectedPages = projectData.selectedPages.length;
        const totalCustomPages = projectData.customPages.length;
        const totalPages = totalSelectedPages + totalCustomPages;

        const freePages = packages[projectData.package]?.freePages || 0;
        const extraPages = Math.max(0, totalPages - freePages);

        return {
            totalPages,
            freePages,
            extraPages,
            extraPagesCost: extraPages * (pricingData?.extraPage || 3)
        };
    };

    // Calculate extra products for e-commerce
    const calculateProducts = () => {
        const totalProducts = parseInt(projectData.productCount) || 0;
        const freeProducts = packages.ecommerce?.freeProducts || 30;
        const extraProducts = Math.max(0, totalProducts - freeProducts);

        return {
            totalProducts,
            freeProducts,
            extraProducts,
            extraProductsCost: extraProducts * (pricingData?.extraProduct || 0.2)
        };
    };

    const calculateTotal = () => {
        const pricing = getCurrentPricing();
        let total = pricing[projectData.package]?.setup || 0;

        // Add hosting cost
        const monthlyCost = pricing[projectData.package]?.monthly || 0;
        let hostingCost = monthlyCost;
        const discount = pricing.discounts?.[projectData.hostingDuration] || 0;

        switch (projectData.hostingDuration) {
            case 'yearly':
                hostingCost = monthlyCost * 10 * (1 - discount / 100);
                break;
            case 'twoYear':
                hostingCost = monthlyCost * 18 * (1 - discount / 100);
                break;
            case 'threeYear':
                hostingCost = monthlyCost * 25 * (1 - discount / 100);
                break;
        }
        total += hostingCost;

        // Add extra pages cost
        const pagesCalculation = calculatePages();
        total += pagesCalculation.extraPagesCost;

        // Add extra products cost for e-commerce
        if (projectData.package === 'ecommerce') {
            const productsCalculation = calculateProducts();
            total += productsCalculation.extraProductsCost;
        }

        // Add email costs
        const emailCalculation = calculateEmailCost();
        total += emailCalculation.totalCost;

        // Add addon costs
        const addonOptions = getAddonOptions();
        projectData.addons.forEach(addonName => {
            const addon = addonOptions.find(a => a.name === addonName);
            if (addon) {
                total += addon.price;
            }
        });

        return total;
    };

    // Package configurations
    const packages = {
        static: {
            name: 'Static Website',
            description: 'Perfect for simple business websites',
            freePages: 5,
            features: ['Mobile responsive', 'Contact forms', 'Basic SEO', 'Fast loading'],
            addons: ['logoDesign', 'extraPage', 'emailAccount', 'contactForms', 'newsletterSignup', 'socialMediaIntegration', 'googleMapsIntegration', 'liveChat', 'multiLanguageSupport', 'searchFunctionality', 'imageGallery', 'videoIntegration']
        },
        dynamic: {
            name: 'Dynamic Website',
            description: 'Great for content-heavy sites with CMS',
            freePages: 7,
            features: ['Content management system', 'Admin section', 'Blog functionality', 'User accounts', 'Advanced SEO', 'Custom forms'],
            addons: ['logoDesign', 'extraPage', 'emailAccount', 'contactForms', 'newsletterSignup', 'socialMediaIntegration', 'googleMapsIntegration', 'bookingAppointmentSystem', 'liveChat', 'multiLanguageSupport', 'searchFunctionality', 'imageGallery', 'videoIntegration'],
            includedAddons: ['extraProduct', 'extraPaymentGateway']
        },
        ecommerce: {
            name: 'E-commerce Website',
            description: 'Complete online store solution',
            freePages: 10,
            features: ['Product catalog', 'Payment processing', 'Order management', 'Inventory tracking', 'Customer accounts'],
            addons: ['logoDesign', 'extraPage', 'extraProduct', 'extraPaymentGateway', 'emailAccount', 'contactForms', 'newsletterSignup', 'socialMediaIntegration', 'googleMapsIntegration', 'bookingAppointmentSystem', 'liveChat', 'multiLanguageSupport', 'searchFunctionality', 'imageGallery', 'videoIntegration'],
            includedAddons: ['extraProduct', 'extraPaymentGateway'],
            freeProducts: 30
        }
    };

    return (
        <div className="animate-fadeIn">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-jetbrains text-4xl font-bold text-black mb-2">
                            Project Management
                        </h1>
                        <p className="text-gray-600">
                            Create new projects and track their progress
                        </p>
                    </div>
                    <button
                        onClick={() => setShowProjectForm(true)}
                        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        New Project
                    </button>
                </div>
            </div>

            {/* Project Creation Form */}
            {showProjectForm && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h2>
                            <p className="text-gray-600">Let's build something amazing together</p>
                        </div>
                        <button
                            onClick={() => {
                                setShowProjectForm(false);
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
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Currency Selector */}
                    <div className="mb-8 flex justify-end">
                        <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2">
                            <span className="text-sm font-medium text-gray-700">Currency:</span>
                            <select
                                value={selectedCurrency || ''}
                                onChange={(e) => setSelectedCurrency(e.target.value || null)}
                                className="text-sm border-0 bg-transparent focus:outline-none focus:ring-0 font-medium text-gray-900"
                            >
                                <option value="">Auto ({userLocation?.currency || 'USD'})</option>
                                <option value="USD">USD ($)</option>
                                <option value="INR">INR (₹)</option>
                                <option value="CAD">CAD (C$)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="SAR">SAR</option>
                                <option value="AED">AED</option>
                                <option value="QAR">QAR</option>
                                <option value="KWD">KWD</option>
                                <option value="BHD">BHD</option>
                                <option value="OMR">OMR</option>
                            </select>
                        </div>
                    </div>

                    <form onSubmit={handleProjectSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Business Information</h3>
                                    <p className="text-gray-600">Tell us about your business</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Business Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={projectData.businessName}
                                        onChange={(e) => setProjectData({ ...projectData, businessName: e.target.value })}
                                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                                        placeholder="Enter your business name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Domain *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={projectData.domain}
                                        onChange={(e) => setProjectData({ ...projectData, domain: e.target.value })}
                                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                                        placeholder="yourdomain.com"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Business Type *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={projectData.businessType}
                                    onChange={(e) => setProjectData({ ...projectData, businessType: e.target.value })}
                                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                                    placeholder="Start typing your business type..."
                                    list="businessTypes"
                                />
                                <datalist id="businessTypes">
                                    {allBusinessTypes.map((type) => (
                                        <option key={type} value={type} />
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        {/* Package Selection */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Choose Your Package</h3>
                                    <p className="text-gray-600">Select the perfect plan for your needs</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {Object.entries(packages).map(([key, pkg]) => (
                                    <label key={key} className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg ${projectData.package === key
                                        ? 'border-green-500 bg-white shadow-lg'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="package"
                                            value={key}
                                            checked={projectData.package === key}
                                            onChange={(e) => setProjectData({ ...projectData, package: e.target.value })}
                                            className="sr-only"
                                        />
                                        {projectData.package === key && (
                                            <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</div>
                                            <div className="text-sm text-gray-600 mb-4">{pkg.description}</div>
                                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                                <div className="text-sm text-gray-600 mb-1">
                                                    {pkg.freePages} pages included
                                                </div>
                                                {key === 'ecommerce' && (
                                                    <div className="text-sm text-gray-600">
                                                        30 products included
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {formatPrice(getCurrentPricing()[key]?.setup || 0, effectiveCurrency || 'USD')}
                                                </div>
                                                <div className="text-sm text-gray-600">setup</div>
                                                <div className="text-sm font-medium text-gray-700">
                                                    + {formatPrice(getCurrentPricing()[key]?.monthly || 0, effectiveCurrency || 'USD')}/month
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Hosting Duration */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Hosting Duration</h3>
                                    <p className="text-gray-600">Choose your hosting plan duration</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { value: 'monthly', label: 'Monthly', description: 'Pay monthly', icon: '📅' },
                                    { value: 'yearly', label: 'Yearly', description: `Save ${getCurrentPricing().discounts?.yearly || 0}%`, icon: '🎯' },
                                    { value: 'twoYear', label: '2 Years', description: `Save ${getCurrentPricing().discounts?.twoYear || 0}%`, icon: '⭐' },
                                    { value: 'threeYear', label: '3 Years', description: `Save ${getCurrentPricing().discounts?.threeYear || 0}%`, icon: '🏆' }
                                ].map((option) => (
                                    <label key={option.value} className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg ${projectData.hostingDuration === option.value
                                        ? 'border-purple-500 bg-white shadow-lg'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="hostingDuration"
                                            value={option.value}
                                            checked={projectData.hostingDuration === option.value}
                                            onChange={(e) => setProjectData({ ...projectData, hostingDuration: e.target.value })}
                                            className="sr-only"
                                        />
                                        {projectData.hostingDuration === option.value && (
                                            <div className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="text-center">
                                            <div className="text-3xl mb-2">{option.icon}</div>
                                            <div className="text-lg font-bold text-gray-900 mb-1">{option.label}</div>
                                            <div className="text-sm text-gray-600">{option.description}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Email Accounts */}
                        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Email Configuration</h3>
                                    <p className="text-gray-600">Set up professional email accounts</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Email Quantity */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-4">
                                            Number of Email Accounts
                                        </label>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (projectData.emailAccountQuantity > 0) {
                                                            setProjectData({
                                                                ...projectData,
                                                                emailAccountQuantity: projectData.emailAccountQuantity - 1
                                                            });
                                                        }
                                                    }}
                                                    className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors text-xl font-bold"
                                                >
                                                    -
                                                </button>
                                                <span className="text-2xl font-bold w-12 text-center">
                                                    {projectData.emailAccountQuantity || 0}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setProjectData({
                                                            ...projectData,
                                                            emailAccountQuantity: (projectData.emailAccountQuantity || 0) + 1
                                                        });
                                                    }}
                                                    className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors text-xl font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {formatPrice((pricingData?.emailAccount || 2.4) * (projectData.emailAccountQuantity || 0), effectiveCurrency || 'USD')}/month per account
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Duration */}
                                    {projectData.emailAccountQuantity > 0 && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-4">
                                                Email Duration
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { value: 'monthly', label: 'Monthly', description: 'Pay monthly', icon: '📅' },
                                                    { value: 'yearly', label: 'Yearly', description: `Save ${getCurrentPricing().discounts?.yearly || 0}%`, icon: '🎯' },
                                                    { value: 'twoYear', label: '2 Years', description: `Save ${getCurrentPricing().discounts?.twoYear || 0}%`, icon: '⭐' },
                                                    { value: 'threeYear', label: '3 Years', description: `Save ${getCurrentPricing().discounts?.threeYear || 0}%`, icon: '🏆' }
                                                ].map((option) => (
                                                    <label key={option.value} className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${projectData.emailDuration === option.value
                                                        ? 'border-orange-500 bg-orange-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}>
                                                        <input
                                                            type="radio"
                                                            name="emailDuration"
                                                            value={option.value}
                                                            checked={projectData.emailDuration === option.value}
                                                            onChange={(e) => setProjectData({ ...projectData, emailDuration: e.target.value })}
                                                            className="sr-only"
                                                        />
                                                        <div className="text-center">
                                                            <div className="text-2xl mb-1">{option.icon}</div>
                                                            <div className="font-semibold text-gray-900 text-sm">{option.label}</div>
                                                            <div className="text-xs text-gray-600">{option.description}</div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Email Cost Summary */}
                                    {projectData.emailAccountQuantity > 0 && (() => {
                                        const emailCalculation = calculateEmailCost();
                                        return (
                                            <div className="md:col-span-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4 border border-orange-200">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {emailCalculation.quantity} email accounts ({emailCalculation.duration})
                                                    </span>
                                                    <span className="text-lg font-bold text-orange-600">
                                                        {formatPrice(emailCalculation.totalCost, effectiveCurrency || 'USD')}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* E-commerce Product Count */}
                        {projectData.package === 'ecommerce' && (
                            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8">
                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center mr-4">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Product Information</h3>
                                        <p className="text-gray-600">Configure your online store products</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-4">
                                                Number of Products
                                            </label>
                                            <input
                                                type="number"
                                                value={projectData.productCount}
                                                onChange={(e) => {
                                                    setProjectData({
                                                        ...projectData,
                                                        productCount: e.target.value
                                                    });
                                                }}
                                                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-lg"
                                                placeholder="Enter number of products"
                                            />
                                            <p className="text-sm text-gray-500 mt-3">
                                                E-commerce packages include up to {packages.ecommerce.freeProducts} products
                                            </p>
                                        </div>
                                        {(() => {
                                            const productsCalculation = calculateProducts();
                                            if (productsCalculation.extraProducts > 0) {
                                                return (
                                                    <div className="bg-gradient-to-r from-teal-100 to-cyan-100 rounded-xl p-4 border border-teal-200">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {productsCalculation.extraProducts} additional products
                                                            </span>
                                                            <span className="text-lg font-bold text-teal-600">
                                                                {formatPrice(productsCalculation.extraProductsCost, effectiveCurrency || 'USD')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pages Selection */}
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Page Selection</h3>
                                    <p className="text-gray-600">Choose the pages you need for your website</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                                    {[
                                        'Home Page', 'About Us', 'Services', 'Contact',
                                        'Blog', 'Portfolio', 'Testimonials', 'FAQ',
                                        'Team', 'Careers', 'Privacy Policy', 'Terms'
                                    ].map((page) => (
                                        <label key={page} className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 ${projectData.selectedPages.includes(page) ? 'bg-indigo-50 border-2 border-indigo-200' : 'border-2 border-gray-100'
                                            }`}>
                                            <input
                                                type="checkbox"
                                                checked={projectData.selectedPages.includes(page)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setProjectData({
                                                            ...projectData,
                                                            selectedPages: [...projectData.selectedPages, page]
                                                        });
                                                    } else {
                                                        setProjectData({
                                                            ...projectData,
                                                            selectedPages: projectData.selectedPages.filter(p => p !== page)
                                                        });
                                                    }
                                                }}
                                                className="mr-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <span className="text-sm font-medium text-gray-700">{page}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Custom Pages */}
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Custom Pages</h3>
                                    <p className="text-gray-600">Add custom pages beyond standard options</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex gap-3 mb-4">
                                    <input
                                        type="text"
                                        id="customPageInput"
                                        placeholder="Enter custom page name (e.g., Product Catalog)"
                                        className="flex-1 px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-lg"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const input = e.target;
                                                const pageName = input.value.trim();
                                                if (pageName && !projectData.customPages.includes(pageName)) {
                                                    setProjectData({
                                                        ...projectData,
                                                        customPages: [...projectData.customPages, pageName]
                                                    });
                                                    input.value = '';
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const input = document.getElementById('customPageInput');
                                            const pageName = input.value.trim();
                                            if (pageName && !projectData.customPages.includes(pageName)) {
                                                setProjectData({
                                                    ...projectData,
                                                    customPages: [...projectData.customPages, pageName]
                                                });
                                                input.value = '';
                                            }
                                        }}
                                        className="px-8 py-4 bg-pink-600 text-white rounded-xl hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors font-semibold"
                                    >
                                        Add
                                    </button>
                                </div>

                                {projectData.customPages.length > 0 && (
                                    <div className="space-y-3">
                                        {projectData.customPages.map((page, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl p-4 border border-pink-200">
                                                <span className="text-sm font-medium text-gray-700">{page}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setProjectData({
                                                            ...projectData,
                                                            customPages: projectData.customPages.filter((_, i) => i !== index)
                                                        });
                                                    }}
                                                    className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add-ons */}
                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Add-ons & Features</h3>
                                    <p className="text-gray-600">Enhance your website with additional features</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                                    {getAddonOptions().map((addon) => (
                                        <label key={addon.id} className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${projectData.addons.includes(addon.name)
                                            ? 'border-amber-500 bg-amber-50 shadow-md'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={projectData.addons.includes(addon.name)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setProjectData({
                                                                ...projectData,
                                                                addons: [...projectData.addons, addon.name]
                                                            });
                                                        } else {
                                                            setProjectData({
                                                                ...projectData,
                                                                addons: projectData.addons.filter(a => a !== addon.name)
                                                            });
                                                        }
                                                    }}
                                                    className="mr-3 h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                                                />
                                                <div>
                                                    <div className="font-semibold text-gray-900">{addon.name}</div>
                                                    <div className="text-sm text-gray-600">{addon.description}</div>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-amber-600">
                                                {formatPrice(addon.price, effectiveCurrency || 'USD')}
                                                {addon.type === 'monthly' ? '/month' : ''}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>



                        {/* Pricing Summary */}
                        {projectData.package && (
                            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-8 border border-gray-200">
                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-4">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Pricing Summary</h3>
                                        <p className="text-gray-600">Review your project costs</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-700 font-medium">Package Setup:</span>
                                            <span className="font-bold text-lg">
                                                {formatPrice(getCurrentPricing()[projectData.package]?.setup || 0, effectiveCurrency || 'USD')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-700 font-medium">Hosting ({projectData.hostingDuration === 'monthly' ? 'Monthly' : projectData.hostingDuration === 'yearly' ? 'Yearly' : projectData.hostingDuration === 'twoYear' ? '2 Years' : '3 Years'}):</span>
                                            <span className="font-bold text-lg">
                                                {(() => {
                                                    const pricing = getCurrentPricing();
                                                    const monthlyCost = pricing[projectData.package]?.monthly || 0;
                                                    const discount = pricing.discounts?.[projectData.hostingDuration] || 0;
                                                    let hostingCost = monthlyCost;

                                                    switch (projectData.hostingDuration) {
                                                        case 'yearly':
                                                            hostingCost = monthlyCost * 10 * (1 - discount / 100);
                                                            break;
                                                        case 'twoYear':
                                                            hostingCost = monthlyCost * 18 * (1 - discount / 100);
                                                            break;
                                                        case 'threeYear':
                                                            hostingCost = monthlyCost * 25 * (1 - discount / 100);
                                                            break;
                                                    }

                                                    return formatPrice(hostingCost, effectiveCurrency || 'USD');
                                                })()}
                                            </span>
                                        </div>

                                        {/* Pages Summary */}
                                        {(() => {
                                            const pagesCalculation = calculatePages();
                                            if (pagesCalculation.totalPages > 0) {
                                                return (
                                                    <div className="border-t border-gray-200 pt-4">
                                                        <div className="text-sm font-semibold text-gray-700 mb-3">Pages:</div>
                                                        <div className="flex justify-between items-center py-2">
                                                            <span className="text-gray-600">
                                                                {pagesCalculation.totalPages} total pages ({pagesCalculation.freePages} included)
                                                            </span>
                                                            <span className="font-bold">
                                                                {pagesCalculation.extraPages > 0
                                                                    ? formatPrice(pagesCalculation.extraPagesCost, effectiveCurrency || 'USD')
                                                                    : 'Included'
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}

                                        {/* Products Summary for E-commerce */}
                                        {projectData.package === 'ecommerce' && (() => {
                                            const productsCalculation = calculateProducts();
                                            if (productsCalculation.totalProducts > 0) {
                                                return (
                                                    <div className="border-t border-gray-200 pt-4">
                                                        <div className="text-sm font-semibold text-gray-700 mb-3">Products:</div>
                                                        <div className="flex justify-between items-center py-2">
                                                            <span className="text-gray-600">
                                                                {productsCalculation.totalProducts} total products ({productsCalculation.freeProducts} included)
                                                            </span>
                                                            <span className="font-bold">
                                                                {productsCalculation.extraProducts > 0
                                                                    ? formatPrice(productsCalculation.extraProductsCost, effectiveCurrency || 'USD')
                                                                    : 'Included'
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}

                                        {/* Email Summary */}
                                        {projectData.emailAccountQuantity > 0 && (() => {
                                            const emailCalculation = calculateEmailCost();
                                            return (
                                                <div className="border-t border-gray-200 pt-4">
                                                    <div className="text-sm font-semibold text-gray-700 mb-3">Email Accounts:</div>
                                                    <div className="flex justify-between items-center py-2">
                                                        <span className="text-gray-600">
                                                            {emailCalculation.quantity} accounts ({emailCalculation.duration})
                                                        </span>
                                                        <span className="font-bold">
                                                            {formatPrice(emailCalculation.totalCost, effectiveCurrency || 'USD')}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {projectData.addons.length > 0 && (
                                            <div className="border-t border-gray-200 pt-4">
                                                <div className="text-sm font-semibold text-gray-700 mb-3">Add-ons:</div>
                                                {projectData.addons.map((addon) => {
                                                    const addonData = getAddonOptions().find(a => a.name === addon);
                                                    return (
                                                        <div key={addon} className="flex justify-between items-center py-2">
                                                            <span className="text-gray-600">{addon}</span>
                                                            <span className="font-bold">
                                                                {formatPrice(addonData?.price || 0, effectiveCurrency || 'USD')}
                                                                {addonData?.type === 'monthly' ? '/month' : ''}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        <div className="border-t-2 border-gray-300 pt-6">
                                            <div className="flex justify-between items-center">
                                                <span className="text-2xl font-bold text-gray-900">Total Setup Cost:</span>
                                                <span className="text-3xl font-bold text-green-600">
                                                    {formatPrice(calculateTotal(), effectiveCurrency || 'USD')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-center pt-8">
                            <button
                                type="submit"
                                disabled={isCreatingProject || !projectData.businessName || !projectData.domain || !projectData.businessType || !projectData.package}
                                className="px-12 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                {isCreatingProject ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Project...
                                    </div>
                                ) : (
                                    'Create Project & Generate Invoice'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Project List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-black">Your Projects</h2>
                    <button
                        onClick={() => setShowProjectForm(true)}
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Create New Project
                    </button>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-black mb-2">No projects yet</h3>
                        <p className="text-gray-600 mb-6">Create your first project to get started</p>
                        <button
                            onClick={() => setShowProjectForm(true)}
                            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Create First Project
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {projects.map((project) => (
                            <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-black mb-2">{project.businessName}</h3>
                                        <p className="text-gray-600 mb-1">Domain: {project.domain}</p>
                                        <p className="text-gray-600 mb-1">Business Type: {project.businessType}</p>
                                        <p className="text-gray-600 mb-1">Package: {getPackageName(project.selectedPackage)}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                            {project.status}
                                        </span>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Created: {formatDate(project.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2">Project Details</h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>Hosting Duration: {project.hostingDuration}</p>
                                            <p>Email Duration: {project.emailDuration}</p>
                                            <p>Email Accounts: {project.emailAccountQuantity}</p>
                                            {project.productCount && <p>Products: {project.productCount}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2">Pricing</h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>Setup Fee: {formatPrice(project.setupFee, project.currency)}</p>
                                            <p>Monthly Fee: {formatPrice(project.monthlyFee, project.currency)}</p>
                                            {project.hostingDiscount > 0 && <p>Hosting Discount: {project.hostingDiscount}%</p>}
                                            {project.emailDiscount > 0 && <p>Email Discount: {project.emailDiscount}%</p>}
                                        </div>
                                    </div>
                                </div>

                                {project.addons && project.addons.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-gray-700 mb-2">Add-ons</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.addons.map((addon, index) => (
                                                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                                                    {addon}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                    <div className="text-sm text-gray-500">
                                        Project ID: {project.id}
                                    </div>
                                    <div className="space-x-2">
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            View Details
                                        </button>
                                        <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                                            View Invoice
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 