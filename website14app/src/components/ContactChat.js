import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { recaptchaConfig } from '../../recaptcha.config.js';

export default function ContactChat() {
    const [currentStep, setCurrentStep] = useState(0);
    const [userData, setUserData] = useState({});
    const [inputValue, setInputValue] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [messages, setMessages] = useState([]);
    const [showNewChat, setShowNewChat] = useState(false);
    const [backgroundData, setBackgroundData] = useState({});
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const steps = [
        {
            question: "Hi! I'm here to help you get in touch with our team. What's your full name? (First and Last)",
            field: "name",
            validation: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Please enter your full name";

                // Check if it contains at least first and last name
                const nameParts = trimmed.split(' ').filter(part => part.length > 0);
                if (nameParts.length < 2) {
                    return "Please enter both your first and last name";
                }

                // Check for valid characters (letters, spaces, hyphens, apostrophes)
                const nameRegex = /^[a-zA-Z\s\-']+$/;
                if (!nameRegex.test(trimmed)) {
                    return "Please enter a valid name (letters only)";
                }

                // Check minimum length for each part
                for (let part of nameParts) {
                    if (part.length < 2) {
                        return "Each name part must be at least 2 characters long";
                    }
                }

                return null;
            }
        },
        {
            question: "Great! What's your phone number? (Include country code if international)",
            field: "phone",
            validation: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Please enter your phone number";

                // Remove all non-digit characters for validation
                const digitsOnly = trimmed.replace(/\D/g, '');

                // Check minimum length (7 digits minimum for valid phone numbers)
                if (digitsOnly.length < 7) {
                    return "Please enter a valid phone number (at least 7 digits)";
                }

                // Check maximum length (15 digits max for international numbers)
                if (digitsOnly.length > 15) {
                    return "Phone number seems too long. Please check and try again";
                }

                // Check for repeated digits (likely invalid)
                const uniqueDigits = new Set(digitsOnly);
                if (uniqueDigits.size < 3) {
                    return "Please enter a valid phone number";
                }

                return null;
            }
        },
        {
            question: "Perfect! What's your email address?",
            field: "email",
            validation: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Please enter your email address";

                // Comprehensive email validation
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(trimmed)) {
                    return "Please enter a valid email address";
                }

                // Check for common disposable email domains
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
            question: "Finally, what would you like to contact us about? Please describe your project or inquiry in detail.",
            field: "message",
            validation: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Please describe your inquiry";

                // Check minimum length for meaningful message
                if (trimmed.length < 10) {
                    return "Please provide more details about your project or inquiry (at least 10 characters)";
                }

                // Check maximum length to prevent spam
                if (trimmed.length > 1000) {
                    return "Message is too long. Please keep it under 1000 characters";
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

            // Try to get IP and location data
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (currentStep < steps.length) {
            addMessage(steps[currentStep].question);
        }
    }, [currentStep]);

    // Auto-focus input field when it becomes enabled
    useEffect(() => {
        if (!isProcessing && !showNewChat && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isProcessing, showNewChat, currentStep]);

    const addMessage = (text, isUser = false) => {
        setMessages(prev => [...prev, { text, isUser, id: Date.now() }]);
    };

    // Get reCAPTCHA token
    const getRecaptchaToken = async () => {
        return new Promise((resolve, reject) => {
            if (typeof window !== 'undefined' && window.grecaptcha) {
                window.grecaptcha.ready(() => {
                    window.grecaptcha.execute(recaptchaConfig.siteKey, { action: 'contact_form' })
                        .then(token => {
                            // Validate that we got a proper token
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
        const input = inputValue.trim();
        if (!input || isProcessing) return;

        // Add user message
        addMessage(input, true);
        setInputValue('');

        // Validate input
        const currentStepData = steps[currentStep];
        const validationError = currentStepData.validation(input);

        if (validationError) {
            addMessage(validationError);
            return;
        }

        // Store user data
        setUserData(prev => ({ ...prev, [currentStepData.field]: input }));

        // Check if this is the last step before incrementing
        const isLastStep = currentStep === steps.length - 1;

        setCurrentStep(prev => prev + 1);
        setIsProcessing(true);

        // If we've collected all data, submit to Firestore
        if (isLastStep) {
            // Create the complete user data including the current input
            const completeUserData = {
                ...userData,
                [currentStepData.field]: input
            };
            await submitToFirestore(completeUserData);
        } else {
            // Show next step after a short delay
            setTimeout(() => {
                setIsProcessing(false);
            }, 500);
        }
    };

    const submitToFirestore = async (completeUserData) => {
        try {
            addMessage("Thank you! I'm submitting your information to our team...");

            // Get reCAPTCHA token
            let recaptchaToken = null;
            try {
                recaptchaToken = await getRecaptchaToken();

                // Additional validation to ensure we have a proper token
                if (!recaptchaToken || recaptchaToken.length < 10) {
                    throw new Error('Invalid reCAPTCHA token received');
                }
            } catch (error) {
                console.error('reCAPTCHA error:', error);
                addMessage("Security verification failed. Please refresh the page and try again.");
                setIsProcessing(false);
                return;
            }

            // Note: reCAPTCHA verification is handled client-side for static site
            // The token is included in the data for server-side verification if needed

            // Get current authenticated user
            const currentUser = auth.currentUser;

            const contactData = {
                ...completeUserData,
                ...backgroundData,
                recaptchaToken,
                timestamp: serverTimestamp(),
                status: 'new',
                source: 'website-form',
                // Add authenticated user information
                userId: currentUser?.uid || null,
                userEmail: currentUser?.email || null,
                authenticatedUser: currentUser ? {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    displayName: currentUser.displayName
                } : null
            };

            await addDoc(collection(db, 'leads'), contactData);

            addMessage("Perfect! Your message has been sent to our team. We'll get back to you within 24 hours.");
            setShowNewChat(true);

        } catch (error) {
            console.error('Error submitting to Firestore:', error);
            addMessage("Sorry, there was an error submitting your message. Please try again or contact us directly.");
        } finally {
            setIsProcessing(false);
        }
    };

    const resetChat = () => {
        setMessages([]);
        setCurrentStep(0);
        setUserData({});
        setShowNewChat(false);
        setIsProcessing(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h1 className="font-inter text-xl font-semibold text-gray-800">Contact Us</h1>
                    <p className="text-gray-600 text-sm mt-1">Let's get started with your inquiry</p>
                </div>
                {showNewChat && (
                    <button
                        onClick={resetChat}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 font-inter text-sm font-medium"
                    >
                        New Chat
                    </button>
                )}
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${message.isUser
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {message.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
                <div className="flex gap-3">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent font-inter"
                        disabled={isProcessing || showNewChat}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={isProcessing || showNewChat || !inputValue.trim()}
                        className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
} 