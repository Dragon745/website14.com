import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLocation } from '../hooks/useLocation';
import { usePricing } from '../hooks/usePricing';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function OrderPage() {
    const router = useRouter();
    const [selectedServices, setSelectedServices] = useState({});
    const [billingCycle, setBillingCycle] = useState('monthly'); // monthly, yearly, twoYear, threeYear
    const [selectedCurrency, setSelectedCurrency] = useState(null);

    // Use the location hook
    const { location: userLocation, isLoading: locationLoading, error: locationError, resetLocationCache } = useLocation();

    // Use the pricing hook with selected currency or detected currency
    const effectiveCurrency = selectedCurrency || userLocation?.currency;
    const { pricingData, isLoading: pricingLoading, error: pricingError, resetPricingCache } = usePricing(effectiveCurrency);

    // Auto-select package based on URL parameter
    useEffect(() => {
        if (router.query.package) {
            const packageType = router.query.package;

            // Auto-select the package based on URL parameter
            setSelectedServices(prev => ({
                ...prev,
                [packageType]: true
            }));
        }
    }, [router.query.package]);

    // Default USD pricing for fallback
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
            videoIntegration: 4
        },
        discounts: {
            yearly: 10,
            twoYear: 15,
            threeYear: 20
        }
    };

    // Combined loading state
    const isLoading = locationLoading || pricingLoading;

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

    const formatPrice = (price, currency = 'USD') => {
        const symbol = currencySymbols[currency] || '$';
        // Round to 2 decimal places and format
        const roundedPrice = Math.round(price * 100) / 100;
        return `${symbol}${roundedPrice.toFixed(2)}`;
    };

    // Get current pricing (either from Firestore or default)
    const getCurrentPricing = () => {

        // Always use default pricing as fallback, even if pricingData is null
        const basePricing = {
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
                extraPaymentGateway: pricingData?.paymentGateway !== undefined ? pricingData.paymentGateway : defaultPricing.addons.extraPaymentGateway,
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
                videoIntegration: pricingData?.videoIntegration !== undefined ? pricingData.videoIntegration : defaultPricing.addons.videoIntegration
            },
            discounts: {
                yearly: pricingData?.yearlyDiscount !== undefined ? pricingData.yearlyDiscount : defaultPricing.discounts.yearly,
                twoYear: pricingData?.twoYearDiscount !== undefined ? pricingData.twoYearDiscount : defaultPricing.discounts.twoYear,
                threeYear: pricingData?.threeYearDiscount !== undefined ? pricingData.threeYearDiscount : defaultPricing.discounts.threeYear
            },
            currency: effectiveCurrency || 'USD'
        };

        return basePricing;
    };

    const handleServiceToggle = (serviceId) => {
        setSelectedServices(prev => ({
            ...prev,
            [serviceId]: !prev[serviceId]
        }));
    };

    const calculateTotal = () => {
        const pricing = getCurrentPricing();
        let setupTotal = 0;
        let monthlyTotal = 0;
        let breakdown = [];

        Object.keys(selectedServices).forEach(serviceId => {
            if (selectedServices[serviceId]) {
                let setupPrice = 0;
                let monthlyPrice = 0;

                // Handle package pricing
                if (serviceId === 'staticSetup') {
                    setupPrice = pricing.static.setup;
                    monthlyPrice = pricing.static.monthly;
                } else if (serviceId === 'dynamicSetup') {
                    setupPrice = pricing.dynamic.setup;
                    monthlyPrice = pricing.dynamic.monthly;
                } else if (serviceId === 'ecommerceSetup') {
                    setupPrice = pricing.ecommerce.setup;
                    monthlyPrice = pricing.ecommerce.monthly;
                } else {
                    // Handle add-on pricing (most are one-time, some are monthly)
                    const addonKey = serviceId.replace('Setup', '');
                    setupPrice = pricing.addons[addonKey] || 0;
                    // Some add-ons have monthly fees
                    if (serviceId === 'emailAccount') {
                        monthlyPrice = pricing.addons.emailAccount;
                        setupPrice = 0; // Email accounts are monthly only
                    }
                }

                setupTotal += setupPrice;
                monthlyTotal += monthlyPrice;
                breakdown.push({
                    service: serviceId,
                    setupPrice,
                    monthlyPrice,
                    isMonthly: monthlyPrice > 0
                });
            }
        });

        // Calculate billing cycle multipliers and discounts
        const billingCycleMultipliers = {
            monthly: 1,
            yearly: 12,
            twoYear: 24,
            threeYear: 36
        };

        const multiplier = billingCycleMultipliers[billingCycle] || 1;
        const discount = pricing.discounts[billingCycle] || 0;

        // Calculate the total for the billing period (e.g., 12 months for yearly)
        const originalPeriodTotal = monthlyTotal * multiplier;
        const discountedPeriodTotal = originalPeriodTotal * (1 - discount / 100);

        const result = {
            setupTotal,
            monthlyTotal: discountedPeriodTotal,
            originalMonthlyTotal: monthlyTotal,
            originalPeriodTotal,
            discountedPeriodTotal,
            breakdown,
            discount,
            multiplier,
            billingCycle
        };

        return result;
    };

    const { setupTotal, monthlyTotal, originalMonthlyTotal, originalPeriodTotal, discountedPeriodTotal, breakdown, discount, multiplier, billingCycle: calculatedBillingCycle } = calculateTotal();
    const currentPricing = getCurrentPricing();



    const services = [
        {
            id: 'staticSetup',
            name: 'Static Website Package',
            description: '5 pages, mobile responsive, contact forms, basic SEO',
            setupPrice: currentPricing.static.setup,
            monthlyPrice: currentPricing.static.monthly,
            category: 'Packages'
        },
        {
            id: 'dynamicSetup',
            name: 'Dynamic Website Package',
            description: 'Content management system, blog, user accounts, advanced SEO',
            setupPrice: currentPricing.dynamic.setup,
            monthlyPrice: currentPricing.dynamic.monthly,
            category: 'Packages'
        },
        {
            id: 'ecommerceSetup',
            name: 'E-commerce Website Package',
            description: 'Online store, payment processing, product management',
            setupPrice: currentPricing.ecommerce.setup,
            monthlyPrice: currentPricing.ecommerce.monthly,
            category: 'Packages'
        },
        {
            id: 'extraPage',
            name: 'Extra Pages',
            description: 'Additional pages beyond the included ones',
            setupPrice: currentPricing.addons.extraPage,
            monthlyPrice: 0,
            category: 'Add-ons'
        },
        {
            id: 'extraProduct',
            name: 'Extra Products',
            description: 'Additional product listings for e-commerce',
            setupPrice: currentPricing.addons.extraProduct,
            monthlyPrice: 0,
            category: 'Add-ons'
        },
        {
            id: 'extraPaymentGateway',
            name: 'Extra Payment Gateway',
            description: 'Additional payment processing options',
            setupPrice: currentPricing.addons.extraPaymentGateway,
            monthlyPrice: 0,
            category: 'Add-ons'
        },
        {
            id: 'emailAccount',
            name: 'Email Account',
            description: 'Professional email accounts',
            setupPrice: 0,
            monthlyPrice: currentPricing.addons.emailAccount,
            category: 'Add-ons'
        },
        {
            id: 'contactForms',
            name: 'Contact Forms',
            description: 'Custom contact forms with email notifications',
            setupPrice: currentPricing.addons.contactForms,
            monthlyPrice: 0,
            category: 'Add-ons'
        },
        {
            id: 'newsletterSignup',
            name: 'Newsletter Signup',
            description: 'Email newsletter subscription system',
            setupPrice: currentPricing.addons.newsletterSignup,
            monthlyPrice: 0,
            category: 'Add-ons'
        },
        {
            id: 'socialMediaIntegration',
            name: 'Social Media Integration',
            description: 'Social media sharing and feeds',
            setupPrice: currentPricing.addons.socialMediaIntegration,
            monthlyPrice: 0,
            category: 'Add-ons'
        },
        {
            id: 'googleMapsIntegration',
            name: 'Google Maps Integration',
            description: 'Interactive maps and location services',
            setupPrice: currentPricing.addons.googleMapsIntegration,
            monthlyPrice: 0,
            category: 'Add-ons'
        },
        {
            id: 'bookingAppointmentSystem',
            name: 'Booking/Appointment System',
            description: 'Online booking and appointment scheduling',
            setupPrice: currentPricing.addons.bookingAppointmentSystem,
            monthlyPrice: 0,
            category: 'Add-ons'
        },
        {
            id: 'liveChat',
            name: 'Live Chat',
            description: 'Real-time customer support chat',
            setupPrice: currentPricing.addons.liveChat,
            monthlyPrice: 0,
            category: 'Add-ons'
        },
        {
            id: 'multiLanguageSupport',
            name: 'Multi-Language Support',
            description: 'Website in multiple languages',
            setupPrice: currentPricing.addons.multiLanguageSupport,
            monthlyPrice: 0,
            category: 'Add-ons'
        },
        {
            id: 'searchFunctionality',
            name: 'Search Functionality',
            description: 'Advanced search features',
            setupPrice: currentPricing.addons.searchFunctionality,
            monthlyPrice: 0,
            category: 'Add-ons'
        },
        {
            id: 'imageGallery',
            name: 'Image Gallery',
            description: 'Professional image galleries',
            setupPrice: currentPricing.addons.imageGallery,
            monthlyPrice: 0,
            category: 'Add-ons'
        },
        {
            id: 'videoIntegration',
            name: 'Video Integration',
            description: 'Video hosting and streaming',
            setupPrice: currentPricing.addons.videoIntegration,
            monthlyPrice: 0,
            category: 'Add-ons'
        }
    ];

    const categories = [...new Set(services.map(service => service.category))];

    // Show subtle loading indicator when updating prices
    const showUpdateIndicator = isLoading;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Services</h1>
                    <p className="text-gray-600">Select the services you need and see the total</p>
                    {showUpdateIndicator && (
                        <div className="mt-2 text-sm text-blue-600">
                            <span className="inline-flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating prices from database...
                            </span>
                        </div>
                    )}
                </div>

                {/* Floating Currency Selector */}
                <div className="fixed top-20 right-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium">Currency</span>
                            <select
                                value={selectedCurrency || ''}
                                onChange={(e) => setSelectedCurrency(e.target.value || null)}
                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Auto</option>
                                <option value="USD">USD</option>
                                <option value="INR">INR</option>
                                <option value="CAD">CAD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="SAR">SAR</option>
                                <option value="AED">AED</option>
                                <option value="QAR">QAR</option>
                                <option value="KWD">KWD</option>
                                <option value="BHD">BHD</option>
                                <option value="OMR">OMR</option>
                            </select>
                            {selectedCurrency && (
                                <button
                                    onClick={() => setSelectedCurrency(null)}
                                    className="text-xs text-gray-400 hover:text-gray-600"
                                    title="Reset to auto-detect"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Services Selection */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Services</h2>

                            {categories.map(category => (
                                <div key={category} className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                                        {category}
                                    </h3>
                                    <div className="space-y-4">
                                        {services
                                            .filter(service => service.category === category)
                                            .map(service => (
                                                <div key={service.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={service.id}
                                                            checked={selectedServices[service.id] || false}
                                                            onChange={() => handleServiceToggle(service.id)}
                                                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                        <div>
                                                            <label htmlFor={service.id} className="font-medium text-gray-900 cursor-pointer">
                                                                {service.name}
                                                            </label>
                                                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        {service.setupPrice > 0 && (
                                                            <div className="font-bold text-gray-900">
                                                                {formatPrice(service.setupPrice, currentPricing.currency)}
                                                            </div>
                                                        )}
                                                        {service.monthlyPrice > 0 && (
                                                            <div className="text-sm text-gray-600">
                                                                +{formatPrice(service.monthlyPrice, currentPricing.currency)}/month
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            {breakdown.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Billing Cycle Selection */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Billing Cycle
                                        </label>
                                        <select
                                            value={billingCycle}
                                            onChange={(e) => setBillingCycle(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="monthly">Monthly Billing</option>
                                            <option value="yearly">Yearly Billing ({currentPricing.discounts.yearly}% off)</option>
                                            <option value="twoYear">2 Year Billing ({currentPricing.discounts.twoYear}% off)</option>
                                            <option value="threeYear">3 Year Billing ({currentPricing.discounts.threeYear}% off)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        {breakdown.map((item, index) => {
                                            const service = services.find(s => s.id === item.service);
                                            return (
                                                <div key={index} className="text-sm">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600">{service?.name}</span>
                                                    </div>
                                                    {item.setupPrice > 0 && (
                                                        <div className="flex justify-between items-center text-xs text-gray-500 ml-4">
                                                            <span>Setup:</span>
                                                            <span>{formatPrice(item.setupPrice, currentPricing.currency)}</span>
                                                        </div>
                                                    )}
                                                    {item.monthlyPrice > 0 && (
                                                        <div className="flex justify-between items-center text-xs text-gray-500 ml-4">
                                                            <span>Monthly:</span>
                                                            <span>{formatPrice(item.monthlyPrice, currentPricing.currency)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 space-y-2">
                                        {setupTotal > 0 && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span>Setup Total:</span>
                                                <span className="font-medium text-gray-900">
                                                    {formatPrice(setupTotal, currentPricing.currency)}
                                                </span>
                                            </div>
                                        )}

                                        {originalMonthlyTotal > 0 && (
                                            <>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span>Monthly Rate:</span>
                                                    <span className="font-medium text-gray-900">
                                                        {formatPrice(originalMonthlyTotal, currentPricing.currency)}
                                                    </span>
                                                </div>

                                                {multiplier > 1 && (
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span>{billingCycle === 'yearly' ? 'Yearly' : billingCycle === 'twoYear' ? '2 Years' : billingCycle === 'threeYear' ? '3 Years' : 'Period'} Total:</span>
                                                        <span className="font-medium text-gray-900">
                                                            {formatPrice(originalPeriodTotal, currentPricing.currency)}
                                                        </span>
                                                    </div>
                                                )}

                                                {discount > 0 && (
                                                    <div className="flex justify-between items-center text-sm text-green-600">
                                                        <span>Discount ({discount}%):</span>
                                                        <span>-{formatPrice(originalPeriodTotal - discountedPeriodTotal, currentPricing.currency)}</span>
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center text-sm">
                                                    <span>{billingCycle === 'monthly' ? 'Monthly' : billingCycle === 'yearly' ? 'Yearly' : billingCycle === 'twoYear' ? '2 Years' : billingCycle === 'threeYear' ? '3 Years' : 'Period'} After Discount:</span>
                                                    <span className="font-medium text-blue-600">
                                                        {formatPrice(discountedPeriodTotal, currentPricing.currency)}
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                        <div className="border-t border-gray-200 pt-2">
                                            <div className="flex justify-between items-center text-lg font-bold">
                                                <span>Total:</span>
                                                <span className="text-blue-600">
                                                    {formatPrice(setupTotal + discountedPeriodTotal, currentPricing.currency)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                        Place Order
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Select services to see your total</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
} 