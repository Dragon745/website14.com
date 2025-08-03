import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { recaptchaConfig } from '../../recaptcha.config.js';

export default function ProjectBuilderChat() {
    const [currentStep, setCurrentStep] = useState(0);
    const [userData, setUserData] = useState({});
    const [inputValue, setInputValue] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [messages, setMessages] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [recommendedPackage, setRecommendedPackage] = useState('');
    const [totalPoints, setTotalPoints] = useState(0);
    const [backgroundData, setBackgroundData] = useState({});
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [customPages, setCustomPages] = useState([]);
    const [showCustomPageInput, setShowCustomPageInput] = useState(false);
    const [pricingData, setPricingData] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [isLoadingPricing, setIsLoadingPricing] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const initialQuestionAddedRef = useRef(false);

    const steps = [
        {
            question: "Hi! I'm here to help you build the perfect website for your business. Let's start with the basics - what type of business do you have?",
            field: "businessType",
            type: "autocomplete",
            options: [
                // Food & Beverage
                "Restaurant (Fine Dining)",
                "Restaurant (Casual)",
                "Restaurant (Fast Food)",
                "Food Truck",
                "Café & Coffee Shop",
                "Bakery & Pastry",
                "Catering Services",
                "Food Delivery & Takeout",
                "Brewery & Distillery",
                "Food Manufacturing",
                "Grocery Store & Market",

                // Retail & E-commerce
                "Online Store",
                "Physical Retail Store",
                "Fashion & Apparel",
                "Electronics & Technology",
                "Home & Garden",
                "Sports & Outdoor",
                "Toys & Games",
                "Jewelry & Accessories",
                "Books & Media",
                "Pet Supplies",
                "Art & Crafts",

                // Healthcare & Medical
                "Medical Practice (General)",
                "Medical Practice (Specialist)",
                "Dental Practice",
                "Veterinary Clinic",
                "Pharmacy",
                "Medical Equipment",
                "Mental Health Services",
                "Physical Therapy",
                "Alternative Medicine",
                "Medical Research",
                "Healthcare Technology",

                // Real Estate
                "Real Estate Agency",
                "Property Management",
                "Construction Company",
                "Architecture Firm",
                "Interior Design",
                "Property Development",
                "Real Estate Investment",
                "Home Inspection",
                "Moving Services",

                // Professional Services
                "Law Firm",
                "Accounting & Tax Services",
                "Consulting (Business)",
                "Consulting (IT)",
                "Consulting (HR)",
                "Marketing & Advertising",
                "Public Relations",
                "Financial Services",
                "Insurance",
                "Human Resources",
                "Translation Services",
                "Event Planning",

                // Technology & Startup
                "Software Development",
                "Web Development",
                "Mobile App Development",
                "IT Services & Support",
                "Cybersecurity",
                "Data Analytics",
                "Artificial Intelligence",
                "Blockchain & Cryptocurrency",
                "SaaS (Software as a Service)",
                "Tech Consulting",

                // Education & Training
                "Elementary School",
                "Middle School",
                "High School",
                "College & University",
                "Community College",
                "Technical Institute",
                "Vocational School",
                "Online Education",
                "Training & Certification",
                "Tutoring Services",
                "Language Learning",
                "Skills Development",
                "Corporate Training",
                "Educational Technology",
                "Private School",
                "Charter School",
                "International School",
                "Special Education",
                "Adult Education",
                "Continuing Education",

                // Manufacturing & Industrial
                "Manufacturing",
                "Industrial Equipment",
                "Chemical & Materials",
                "Textile & Apparel Manufacturing",
                "Food Processing",
                "Electronics Manufacturing",
                "Automotive Manufacturing",
                "Aerospace & Defense",

                // Construction & Contracting
                "General Contracting",
                "Electrical Services",
                "Plumbing Services",
                "HVAC Services",
                "Landscaping",
                "Roofing",
                "Painting",
                "Renovation",
                "Engineering Services",

                // Automotive & Transportation
                "Car Dealership",
                "Auto Repair & Maintenance",
                "Car Rental",
                "Transportation Services",
                "Logistics & Shipping",
                "Moving Company",
                "Fleet Management",
                "Auto Parts",

                // Beauty & Personal Care
                "Hair Salon",
                "Beauty Salon",
                "Spa & Wellness",
                "Nail Salon",
                "Barber Shop",
                "Cosmetics & Skincare",
                "Personal Training",
                "Massage Therapy",

                // Fitness & Wellness
                "Gym & Fitness Center",
                "Yoga Studio",
                "Personal Training",
                "Nutrition Services",
                "Wellness Coaching",
                "Sports Training",
                "Physical Therapy",
                "Mental Health Services",

                // Entertainment & Media
                "Entertainment Production",
                "Photography & Videography",
                "Music & Audio",
                "Gaming",
                "Broadcasting",
                "Publishing",
                "Event Production",
                "Talent Agency",

                // Non-profit & Charity
                "Charity Organization",
                "Foundation",
                "Religious Organization",
                "Community Service",
                "Environmental Organization",
                "Animal Welfare",
                "Educational Non-profit",
                "Healthcare Non-profit",

                // Government & Public Sector
                "Government Agency",
                "Public Service",
                "Municipal Services",
                "Public Safety",
                "Public Health",
                "Public Transportation",
                "Public Education",

                // Other Services
                "Cleaning Services",
                "Security Services",
                "Pest Control",
                "Waste Management",
                "Storage & Warehousing",
                "Printing & Publishing",
                "Research & Development",
                "Environmental Services",
                "Legal Services",
                "Financial Services",

                "Other"
            ],
            validation: (value) => {
                if (!value || value.trim() === '') {
                    return "Please select your business type";
                }
                return null;
            }
        },
        {
            question: "Great! Do you currently have a website?",
            field: "currentWebsite",
            type: "radio",
            options: [
                "No, this is my first website",
                "Yes, but it's outdated",
                "Yes, but I need a new one",
                "Yes, but I want to improve it"
            ],
            validation: (value) => {
                if (!value) {
                    return "Please select an option";
                }
                return null;
            }
        },
        {
            question: "What's your current website URL?",
            field: "currentWebsiteUrl",
            type: "text",
            placeholder: "Enter your website URL (e.g., https://example.com)",
            showIf: (data) => data.currentWebsite && data.currentWebsite.includes("Yes"),
            validation: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Please enter your website URL";
                return null;
            }
        },
        {
            question: "What is the main purpose of your website?",
            field: "primaryPurpose",
            type: "radio",
            options: [
                "Static Website - Simple information site",
                "Dynamic Website - Content management, blog, user accounts",
                "E-commerce - Online store with products and payments"
            ],
            validation: (value) => {
                if (!value) {
                    return "Please select the main purpose";
                }
                return null;
            }
        },
        {
            question: "Do you need to update content regularly?",
            field: "contentManagement",
            type: "radio",
            options: [
                "No, static content is fine",
                "Yes, I want to add blog posts",
                "Yes, I need to update products/services frequently",
                "Yes, I need full content management system"
            ],
            validation: (value) => {
                if (!value) {
                    return "Please select an option";
                }
                return null;
            }
        },
        {
            question: "Do you need user accounts or member areas?",
            field: "userFeatures",
            type: "radio",
            options: [
                "No user accounts needed",
                "Yes, customer accounts for purchases",
                "Yes, member-only content areas",
                "Yes, user dashboard and profiles"
            ],
            validation: (value) => {
                if (!value) {
                    return "Please select an option";
                }
                return null;
            }
        },
        {
            question: "How many products will you sell? (if applicable)",
            field: "productCount",
            type: "number",
            placeholder: "Enter number of products",
            showIf: (data) => data.primaryPurpose === "E-commerce - Online store with products and payments",
            validation: (value) => {
                if (!value || value.trim() === '') {
                    return "Please enter the number of products";
                }
                const num = parseInt(value);
                if (isNaN(num) || num < 1) {
                    return "Please enter a valid number (minimum 1)";
                }
                return null;
            }
        },
        {
            question: "Which payment methods do you need? (select all that apply)",
            field: "paymentMethods",
            type: "multiselect",
            options: [
                "PayPal",
                "Credit/Debit Cards (Stripe)",
                "Bank Transfer",
                "Cash on Delivery"
            ],
            showIf: (data) => data.primaryPurpose === "E-commerce - Online store with products and payments",
            validation: (value) => {
                if (!value || value.length === 0) {
                    return "Please select at least one payment method";
                }
                return null;
            }
        },
        {
            question: "What pages do you need on your website? (select all that apply)",
            field: "pages",
            type: "multiselect",
            options: [
                "Home Page",
                "About Us",
                "Services/Products",
                "Contact Page",
                "Blog/News",
                "Testimonials/Reviews",
                "FAQ",
                "Privacy Policy",
                "Terms of Service",
                "Custom Pages"
            ],
            validation: (value) => {
                if (!value || value.length === 0) {
                    return "Please select at least one page";
                }
                return null;
            }
        },
        {
            question: "What special features do you need? (select all that apply)",
            field: "specialFeatures",
            type: "multiselect",
            options: [
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
            ],
            validation: (value) => {
                if (!value || value.length === 0) {
                    return "Please select at least one feature";
                }
                return null;
            }
        },
        {
            question: "What's your timeline for this project?",
            field: "timeline",
            type: "radio",
            options: [
                "ASAP (1-2 weeks)",
                "Soon (1-2 months)",
                "Flexible (3-6 months)",
                "No rush (6+ months)"
            ],
            validation: (value) => {
                if (!value) {
                    return "Please select your timeline";
                }
                return null;
            }
        },
        {
            question: "What's your email address?",
            field: "email",
            type: "text",
            validation: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Please enter your email address";

                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(trimmed)) {
                    return "Please enter a valid email address";
                }

                const disposableDomains = [
                    'tempmail.com', 'temp-mail.org', 'guerrillamail.com',
                    '10minutemail.com', 'mailinator.com', 'yopmail.com'
                ];
                const domain = trimmed.split('@')[1]?.toLowerCase();
                if (disposableDomains.some(d => domain?.includes(d))) {
                    return "Please use a valid email address (no temporary emails)";
                }

                return null;
            }
        },
        {
            question: "What's your phone number? (Include country code if international)",
            field: "phone",
            type: "text",
            validation: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Please enter your phone number";

                const digitsOnly = trimmed.replace(/\D/g, '');
                if (digitsOnly.length < 7) {
                    return "Please enter a valid phone number (at least 7 digits)";
                }

                if (digitsOnly.length > 15) {
                    return "Phone number seems too long. Please check and try again";
                }

                const uniqueDigits = new Set(digitsOnly);
                if (uniqueDigits.size < 3) {
                    return "Please enter a valid phone number";
                }

                return null;
            }
        }
    ];

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
                        setPricingData(null);
                    }
                }
            } catch (error) {
                console.error('Error loading pricing:', error);
                setPricingData(null);
            } finally {
                setIsLoadingPricing(false);
            }
        };

        detectLocationAndLoadPricing();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Add initial question when component mounts
    useEffect(() => {
        if (messages.length === 0 && steps.length > 0 && !initialQuestionAddedRef.current) {
            addMessage(steps[0].question);
            initialQuestionAddedRef.current = true;
        }
    }, [messages.length]);

    // Auto-focus input field when it becomes enabled
    useEffect(() => {
        if (!isProcessing && !showResults && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isProcessing, showResults, currentStep]);

    const addMessage = (text, isUser = false) => {
        setMessages(prev => [...prev, { text, isUser, id: Date.now() }]);
    };

    // Get reCAPTCHA token
    const getRecaptchaToken = async () => {
        return new Promise((resolve, reject) => {
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
    };

    const handleSubmit = async () => {
        await handleSubmitWithValue(inputValue);
    };

    const handleSubmitWithValue = async (value) => {
        if (isProcessing || currentStep >= steps.length) return;

        const trimmedValue = value.trim();
        if (!trimmedValue) return;

        const currentStepData = steps[currentStep];

        // Validate input
        const validation = currentStepData.validation(trimmedValue);
        if (validation) {
            addMessage(validation);
            return;
        }

        // Process the input based on field type
        let processedValue = trimmedValue;

        if (currentStepData.type === 'checkbox') {
            // For checkboxes, we need to handle multiple selections
            // This is a simplified version - you might want to enhance this
            processedValue = [trimmedValue];
        } else if (currentStepData.type === 'number') {
            processedValue = parseInt(trimmedValue);
        }

        // Create updated user data
        const updatedUserData = {
            ...userData,
            [currentStepData.field]: processedValue
        };

        // Update user data
        setUserData(updatedUserData);

        // Add user message to chat
        addMessage(trimmedValue, true);

        // Clear input and suggestions
        setInputValue('');
        setShowSuggestions(false);
        setFilteredOptions([]);

        // Move to next step with updated data
        await moveToNextStep(updatedUserData);
    };

    const moveToNextStep = async (updatedData = null) => {
        let nextStep = currentStep + 1;

        // Use updated data if provided, otherwise use current userData
        const dataToCheck = updatedData || userData;

        // Check if next step should be skipped based on showIf condition
        while (nextStep < steps.length && steps[nextStep].showIf && !steps[nextStep].showIf(dataToCheck)) {
            nextStep++;
        }

        if (nextStep < steps.length) {
            setCurrentStep(nextStep);
            // Add next question after a short delay
            setTimeout(() => {
                addMessage(steps[nextStep].question);
            }, 500);
        } else {
            // We're done! Calculate results
            await calculateResults();
        }
    };

    const calculateResults = async () => {
        setIsProcessing(true);
        addMessage("Perfect! Let me analyze your requirements and create your personalized quote...");

        try {
            // Calculate package recommendation based on user data
            let points = 0;
            let packageType = 'static';

            // Analyze primary purpose
            if (userData.primaryPurpose === 'E-commerce - Online store with products and payments') {
                points += 50;
                packageType = 'ecommerce';
            } else if (userData.primaryPurpose === 'Dynamic Website - Content management, blog, user accounts') {
                points += 30;
                packageType = 'dynamic';
            }

            // Analyze content management needs
            if (userData.contentManagement === 'Yes, I need full content management system') {
                points += 20;
            } else if (userData.contentManagement === 'Yes, I need to update products/services frequently') {
                points += 15;
            }

            // Analyze user features
            if (userData.userFeatures === 'Yes, user dashboard and profiles') {
                points += 25;
            } else if (userData.userFeatures === 'Yes, member-only content areas') {
                points += 15;
            }

            // Analyze special features
            if (userData.specialFeatures && userData.specialFeatures.length > 5) {
                points += 20;
            } else if (userData.specialFeatures && userData.specialFeatures.length > 2) {
                points += 10;
            }

            // Analyze e-commerce features
            if (userData.productCount && parseInt(userData.productCount) > 100) {
                points += 15;
            }

            setTotalPoints(points);
            setRecommendedPackage(packageType);
            setShowResults(true);

            // Save to Firestore
            await saveToFirestore(packageType, points);

        } catch (error) {
            console.error('Error calculating results:', error);
            addMessage("Sorry, there was an error processing your request. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const saveToFirestore = async (packageType, points) => {
        try {
            // Get reCAPTCHA token
            let recaptchaToken = null;
            try {
                recaptchaToken = await getRecaptchaToken();
                if (!recaptchaToken || recaptchaToken.length < 10) {
                    throw new Error('Invalid reCAPTCHA token received');
                }
            } catch (error) {
                console.error('reCAPTCHA error:', error);
                return;
            }

            // Note: reCAPTCHA verification is handled client-side for static site
            // The token is included in the data for server-side verification if needed

            // Get current authenticated user
            const currentUser = auth.currentUser;

            const leadData = {
                ...userData,
                ...backgroundData,
                recaptchaToken,
                recommendedPackage: packageType,
                totalPoints: points,
                timestamp: serverTimestamp(),
                status: 'new',
                source: 'project-builder',
                userId: currentUser?.uid || null,
                userEmail: currentUser?.email || null,
                authenticatedUser: currentUser ? {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    displayName: currentUser.displayName
                } : null
            };

            await addDoc(collection(db, 'leads'), leadData);
            console.log('Project builder data saved to Firestore');

        } catch (error) {
            console.error('Error saving to Firestore:', error);
        }
    };

    const getPackageName = (packageType) => {
        switch (packageType) {
            case 'static': return 'Static Website';
            case 'dynamic': return 'Dynamic Website';
            case 'ecommerce': return 'E-commerce Website';
            default: return 'Custom Package';
        }
    };

    const getPackageDescription = (packageType) => {
        switch (packageType) {
            case 'static':
                return 'Perfect for simple business websites with static content. Includes basic pages, contact forms, and mobile responsiveness.';
            case 'dynamic':
                return 'Ideal for businesses that need to update content regularly. Includes content management system, blog functionality, and user accounts.';
            case 'ecommerce':
                return 'Complete online store solution with product management, payment processing, inventory tracking, and advanced e-commerce features.';
            default:
                return 'Custom solution tailored to your specific requirements.';
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        const currentStepData = steps[currentStep];

        if (currentStepData.type === 'autocomplete') {
            if (value.trim() === '') {
                setShowSuggestions(false);
                setFilteredOptions([]);
            } else {
                const filtered = currentStepData.options.filter(option =>
                    option.toLowerCase().includes(value.toLowerCase())
                );
                setFilteredOptions(filtered.slice(0, 8)); // Limit to 8 suggestions
                setShowSuggestions(filtered.length > 0);
            }
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        setShowSuggestions(false);
        setFilteredOptions([]);
        // Auto-submit when suggestion is clicked with the suggestion value
        setTimeout(() => {
            handleSubmitWithValue(suggestion);
        }, 100); // Small delay to ensure state is updated
    };

    const handleOptionClick = (option) => {
        // Directly submit the option without setting input value first
        handleSubmitWithValue(option);
    };

    const handleMultiselectClick = (option) => {
        if (option === "Custom Pages") {
            setShowCustomPageInput(true);
            setSelectedOptions(prev => {
                if (prev.includes(option)) {
                    return prev.filter(item => item !== option);
                } else {
                    return [...prev, option];
                }
            });
        } else {
            setSelectedOptions(prev => {
                if (prev.includes(option)) {
                    return prev.filter(item => item !== option);
                } else {
                    return [...prev, option];
                }
            });
        }
    };

    const handleMultiselectSubmit = () => {
        if (selectedOptions.length > 0) {
            let allPages = [...selectedOptions];

            // Add custom pages if any
            if (customPages.length > 0) {
                allPages = allPages.filter(page => page !== "Custom Pages");
                allPages = [...allPages, ...customPages];
            }

            handleSubmitWithValue(allPages.join(', '));
            setSelectedOptions([]);
            setCustomPages([]);
            setShowCustomPageInput(false);
        }
    };

    const handleAddCustomPage = () => {
        const trimmedValue = inputValue.trim();
        if (trimmedValue && !customPages.includes(trimmedValue)) {
            setCustomPages(prev => [...prev, trimmedValue]);
            setInputValue('');
        }
    };

    const resetChat = () => {
        setMessages([]);
        setCurrentStep(0);
        setUserData({});
        setShowResults(false);
        setRecommendedPackage('');
        setTotalPoints(0);
        setIsProcessing(false);
        setShowSuggestions(false);
        setFilteredOptions([]);
        setSelectedOptions([]);
        setCustomPages([]);
        setShowCustomPageInput(false);
        initialQuestionAddedRef.current = false;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h1 className="font-inter text-xl font-semibold text-gray-800">Project Builder</h1>
                    <p className="text-gray-600 text-sm mt-1">Let's build your perfect website</p>
                </div>
                {showResults && (
                    <button
                        onClick={resetChat}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 font-inter text-sm font-medium"
                    >
                        Start Over
                    </button>
                )}
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                    <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${message.isUser
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {message.text}

                            {/* Show radio options as buttons for non-user messages */}
                            {!message.isUser && currentStep < steps.length &&
                                steps[currentStep].type === 'radio' &&
                                index === messages.length - 1 && (
                                    <div className="mt-3 space-y-2">
                                        {steps[currentStep].options.map((option, optionIndex) => (
                                            <button
                                                key={optionIndex}
                                                onClick={() => handleOptionClick(option)}
                                                className="w-full text-left px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}

                            {/* Show multiselect options as buttons for non-user messages */}
                            {!message.isUser && currentStep < steps.length &&
                                steps[currentStep].type === 'multiselect' &&
                                index === messages.length - 1 && (
                                    <div className="mt-3 space-y-2">
                                        {steps[currentStep].options.map((option, optionIndex) => (
                                            <button
                                                key={optionIndex}
                                                onClick={() => handleMultiselectClick(option)}
                                                className={`w-full text-left px-3 py-2 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedOptions.includes(option)
                                                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                                                    : 'bg-white hover:bg-gray-50 border-gray-200'
                                                    }`}
                                            >
                                                {option}
                                                {selectedOptions.includes(option) && (
                                                    <span className="ml-2 text-blue-600">✓</span>
                                                )}
                                            </button>
                                        ))}

                                        {/* Custom page input */}
                                        {showCustomPageInput && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <p className="text-sm text-gray-600 mb-2">Add custom pages:</p>
                                                <div className="flex space-x-2">
                                                    <input
                                                        type="text"
                                                        value={inputValue}
                                                        onChange={(e) => setInputValue(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && handleAddCustomPage()}
                                                        placeholder="Enter page name..."
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                    <button
                                                        onClick={handleAddCustomPage}
                                                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                                {customPages.length > 0 && (
                                                    <div className="mt-2">
                                                        <p className="text-xs text-gray-500 mb-1">Custom pages added:</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {customPages.map((page, index) => (
                                                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                                    {page}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {selectedOptions.length > 0 && (
                                            <button
                                                onClick={handleMultiselectSubmit}
                                                className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium mt-3"
                                            >
                                                Continue with {selectedOptions.length + customPages.length} selected
                                            </button>
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>
                ))}

                {/* Results Section */}
                {showResults && (
                    <div className="flex justify-start">
                        <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-blue-100 text-gray-800">
                            <div className="mb-4">
                                <h3 className="font-semibold text-lg mb-2">🎉 Your Recommended Package</h3>
                                <p className="text-2xl font-bold text-blue-800 mb-2">
                                    {getPackageName(recommendedPackage)}
                                </p>
                                <p className="text-sm text-gray-600 mb-4">
                                    {getPackageDescription(recommendedPackage)}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm"><strong>Complexity Score:</strong> {totalPoints} points</p>
                                <p className="text-sm"><strong>Timeline:</strong> {userData.timeline}</p>
                                <p className="text-sm"><strong>Budget Range:</strong> {userData.budget}</p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-blue-200">
                                <p className="text-sm text-gray-600 mb-3">
                                    Ready to get your personalized quote?
                                </p>
                                <button
                                    onClick={() => window.location.href = '/quote'}
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    Get Your Quote
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            {!showResults && (
                <div className="border-t border-gray-200 p-4">
                    <div className="flex space-x-3">
                        <div className="flex-1">
                            {currentStep < steps.length && (
                                <div className="relative">
                                    {steps[currentStep].type === 'autocomplete' && (
                                        <div className="relative">
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={inputValue}
                                                onChange={handleInputChange}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Type your business type..."
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                disabled={isProcessing}
                                            />
                                            {showSuggestions && (
                                                <div className="absolute bottom-full left-0 right-0 mb-2 z-10">
                                                    <div className="flex flex-wrap gap-2 bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                                        {filteredOptions.map((option, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() => handleSuggestionClick(option)}
                                                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-full border border-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {steps[currentStep].type === 'select' && (
                                        <select
                                            ref={inputRef}
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                            disabled={isProcessing}
                                        >
                                            <option value="">Select an option...</option>
                                            {steps[currentStep].options.map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    )}

                                    {steps[currentStep].type === 'radio' && (
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-600 mb-2">Click an option above to continue</p>
                                        </div>
                                    )}

                                    {steps[currentStep].type === 'multiselect' && (
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-600 mb-2">Click options above to select multiple pages</p>
                                        </div>
                                    )}

                                    {steps[currentStep].type === 'checkbox' && (
                                        <div className="space-y-2">
                                            {steps[currentStep].options.map((option, index) => (
                                                <label key={index} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        value={option}
                                                        checked={inputValue.includes(option)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setInputValue(prev => [...prev, option]);
                                                            } else {
                                                                setInputValue(prev => prev.filter(item => item !== option));
                                                            }
                                                        }}
                                                        className="text-black focus:ring-black"
                                                        disabled={isProcessing}
                                                    />
                                                    <span className="text-sm">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {(steps[currentStep].type === 'text' || steps[currentStep].type === 'number') && (
                                        <input
                                            ref={inputRef}
                                            type={steps[currentStep].type}
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder={steps[currentStep].placeholder || "Type your answer..."}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                            disabled={isProcessing}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={isProcessing || !inputValue.trim()}
                            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? 'Processing...' : 'Send'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 