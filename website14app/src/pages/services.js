import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { useLocation } from '../hooks/useLocation';
import { usePricing } from '../hooks/usePricing';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Services() {
  const router = useRouter();
  // State for manual currency selection
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  // Use the location hook
  const { location: userLocation, isLoading: locationLoading, error: locationError } = useLocation();

  // Use the pricing hook with selected currency or detected currency
  const effectiveCurrency = selectedCurrency || userLocation?.currency;
  const { pricingData, isLoading: pricingLoading, error: pricingError } = usePricing(effectiveCurrency);

  // Debug: Log when pricing hook is called
  useEffect(() => {
    console.log('Services page - usePricing called with currency:', userLocation?.currency);
  }, [userLocation?.currency]);

  // Combined loading state
  const isLoading = locationLoading || pricingLoading;

  // Handle package selection and redirect
  const handlePackageSelection = (packageType) => {
    const user = auth.currentUser;

    if (user) {
      // User is logged in, redirect to client portal projects with package pre-selected
      router.push(`/client?section=projects&package=${packageType}`);
    } else {
      // User is not logged in, redirect to login with return URL to client portal projects
      router.push(`/login?returnUrl=${encodeURIComponent(`/client?section=projects&package=${packageType}`)}`);
    }
  };

  // Default USD pricing for SEO and fallback
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

  // Debug logging for pricing
  useEffect(() => {
    const detectLocationAndLoadPricing = async () => {
      try {
        // Detect user location with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch('https://ipapi.co/json/', {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
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
          console.log('Discount values:', {
            yearly: data.yearlyDiscount,
            twoYear: data.twoYearDiscount,
            threeYear: data.threeYearDiscount
          });
          setPricingData(data);
        } else {
          console.log(`No pricing data found for ${locationData.currency}, falling back to USD`);
          // Fallback to USD if currency not found
          const usdPricingDoc = await getDoc(doc(db, 'pricing', 'USD'));
          if (usdPricingDoc.exists()) {
            const usdData = usdPricingDoc.data();
            console.log('Loaded USD pricing:', usdData);
            console.log('USD Discount values:', {
              yearly: usdData.yearlyDiscount,
              twoYear: usdData.twoYearDiscount,
              threeYear: usdData.threeYearDiscount
            });
            setPricingData(usdData);
            // Also update user location to USD for consistency
            setUserLocation(prev => ({
              ...prev,
              currency: 'USD'
            }));
          } else {
            console.log('No USD pricing found, using default');
            // Convert default pricing to flat structure for consistency
            setPricingData({
              staticSetup: defaultPricing.static.setup,
              staticMonthly: defaultPricing.static.monthly,
              dynamicSetup: defaultPricing.dynamic.setup,
              dynamicMonthly: defaultPricing.dynamic.monthly,
              ecommerceSetup: defaultPricing.ecommerce.setup,
              ecommerceMonthly: defaultPricing.ecommerce.monthly,
              extraPage: defaultPricing.addons.extraPage,
              extraProduct: defaultPricing.addons.extraProduct,
              extraPaymentGateway: defaultPricing.addons.extraPaymentGateway,
              emailAccount: defaultPricing.addons.emailAccount,
              contactForms: defaultPricing.addons.contactForms,
              newsletterSignup: defaultPricing.addons.newsletterSignup,
              socialMediaIntegration: defaultPricing.addons.socialMediaIntegration,
              googleMapsIntegration: defaultPricing.addons.googleMapsIntegration,
              bookingAppointmentSystem: defaultPricing.addons.bookingAppointmentSystem,
              liveChat: defaultPricing.addons.liveChat,
              multiLanguageSupport: defaultPricing.addons.multiLanguageSupport,
              searchFunctionality: defaultPricing.addons.searchFunctionality,
              imageGallery: defaultPricing.addons.imageGallery,
              videoIntegration: defaultPricing.addons.videoIntegration,
              yearlyDiscount: defaultPricing.discounts.yearly,
              twoYearDiscount: defaultPricing.discounts.twoYear,
              threeYearDiscount: defaultPricing.discounts.threeYear
            });
            // Also update user location to USD for consistency
            setUserLocation(prev => ({
              ...prev,
              currency: 'USD'
            }));
          }
        }
      } catch (error) {
        console.error('Error loading pricing:', error);
        // Set default USD location when API fails
        setUserLocation({
          country: 'United States',
          city: 'Unknown',
          currency: 'USD',
          ip: '0.0.0.0'
        });

        // Try to load USD pricing from database first
        try {
          const usdPricingDoc = await getDoc(doc(db, 'pricing', 'USD'));
          if (usdPricingDoc.exists()) {
            const usdData = usdPricingDoc.data();
            console.log('Loaded USD pricing from database after API failure:', usdData);
            setPricingData(usdData);
          } else {
            console.log('No USD pricing found in database, using default');
            // Convert default pricing to flat structure for consistency
            setPricingData({
              staticSetup: defaultPricing.static.setup,
              staticMonthly: defaultPricing.static.monthly,
              dynamicSetup: defaultPricing.dynamic.setup,
              dynamicMonthly: defaultPricing.dynamic.monthly,
              ecommerceSetup: defaultPricing.ecommerce.setup,
              ecommerceMonthly: defaultPricing.ecommerce.monthly,
              extraPage: defaultPricing.addons.extraPage,
              extraProduct: defaultPricing.addons.extraProduct,
              extraPaymentGateway: defaultPricing.addons.extraPaymentGateway,
              emailAccount: defaultPricing.addons.emailAccount,
              contactForms: defaultPricing.addons.contactForms,
              newsletterSignup: defaultPricing.addons.newsletterSignup,
              socialMediaIntegration: defaultPricing.addons.socialMediaIntegration,
              googleMapsIntegration: defaultPricing.addons.googleMapsIntegration,
              bookingAppointmentSystem: defaultPricing.addons.bookingAppointmentSystem,
              liveChat: defaultPricing.addons.liveChat,
              multiLanguageSupport: defaultPricing.addons.multiLanguageSupport,
              searchFunctionality: defaultPricing.addons.searchFunctionality,
              imageGallery: defaultPricing.addons.imageGallery,
              videoIntegration: defaultPricing.addons.videoIntegration,
              yearlyDiscount: defaultPricing.discounts.yearly,
              twoYearDiscount: defaultPricing.discounts.twoYear,
              threeYearDiscount: defaultPricing.discounts.threeYear
            });
          }
        } catch (dbError) {
          console.error('Error loading USD pricing from database:', dbError);
          // Final fallback to hardcoded default pricing
          setPricingData({
            staticSetup: defaultPricing.static.setup,
            staticMonthly: defaultPricing.static.monthly,
            dynamicSetup: defaultPricing.dynamic.setup,
            dynamicMonthly: defaultPricing.dynamic.monthly,
            ecommerceSetup: defaultPricing.ecommerce.setup,
            ecommerceMonthly: defaultPricing.ecommerce.monthly,
            extraPage: defaultPricing.addons.extraPage,
            extraProduct: defaultPricing.addons.extraProduct,
            extraPaymentGateway: defaultPricing.addons.extraPaymentGateway,
            emailAccount: defaultPricing.addons.emailAccount,
            contactForms: defaultPricing.addons.contactForms,
            newsletterSignup: defaultPricing.addons.newsletterSignup,
            socialMediaIntegration: defaultPricing.addons.socialMediaIntegration,
            googleMapsIntegration: defaultPricing.addons.googleMapsIntegration,
            bookingAppointmentSystem: defaultPricing.addons.bookingAppointmentSystem,
            liveChat: defaultPricing.addons.liveChat,
            multiLanguageSupport: defaultPricing.addons.multiLanguageSupport,
            searchFunctionality: defaultPricing.addons.searchFunctionality,
            imageGallery: defaultPricing.addons.imageGallery,
            videoIntegration: defaultPricing.addons.videoIntegration,
            yearlyDiscount: defaultPricing.discounts.yearly,
            twoYearDiscount: defaultPricing.discounts.twoYear,
            threeYearDiscount: defaultPricing.discounts.threeYear
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    console.log('Services page - Pricing state:', {
      pricingData,
      pricingLoading,
      pricingError: pricingError?.message,
      userLocation
    });
  }, [pricingData, pricingLoading, pricingError, userLocation]);

  // Format price with currency symbol
  const formatPrice = (price, currency = 'USD') => {
    const symbol = currencySymbols[currency] || '$';
    return `${symbol}${price}`;
  };

  // Get current pricing (either from Firestore or default)
  const getCurrentPricing = () => {
    console.log('getCurrentPricing called with:', { pricingData, userLocation, effectiveCurrency });

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

    console.log('Final pricing data:', basePricing);
    console.log('Final discount values:', basePricing.discounts);
    return basePricing;
  };

  const currentPricing = getCurrentPricing();

  // Debug logging
  useEffect(() => {
    if (pricingData) {
      console.log('Pricing data updated:', pricingData);
      console.log('Current pricing calculated:', currentPricing);
    }
  }, [pricingData, currentPricing]);

  return (
    <>
      <Head>
        <title>Professional Website Development Services - Website14</title>
        <meta name="description" content="Get a professional, mobile-first website with unlimited updates for less than DIY platforms. Trusted by 500+ businesses. Start from $59 setup + $5/month." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
        <Header />

        {/* Main Content */}
        <div className="flex-1">

          {/* Hero Section with Social Proof */}
          <div className="max-w-6xl mx-auto px-5 py-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Trusted by 500+ businesses worldwide
              </div>
              <h1
                className="font-jetbrains text-4xl md:text-6xl font-bold text-black mb-6"
              >
                Professional Websites
                <span className="text-blue-600">That Convert</span>
              </h1>
              <p className="font-inter text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Get a custom-built, mobile-first website with unlimited updates for less than DIY platforms.
                <span className="font-semibold text-black">No templates. No compromises.</span>
              </p>
              {isLoading && pricingData && (
                <div className="mb-4 text-sm text-blue-600">
                  <span className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating prices from database...
                  </span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Free consultation
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  30-day money-back guarantee
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Unlimited updates included
                </div>
              </div>
              <button
                onClick={() => handlePackageSelection('dynamicSetup')}
                className="bg-black text-white py-4 px-8 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 text-lg"
              >
                Get Your Free Quote Now
              </button>
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

            {/* Social Proof Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-black">500+</div>
                  <div className="text-sm text-gray-600">Happy Clients</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-black">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-black">24/7</div>
                  <div className="text-sm text-gray-600">Support Available</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-black">30 Days</div>
                  <div className="text-sm text-gray-600">Money Back</div>
                </div>
              </div>
            </div>

            {/* Services Grid with Dynamic Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Static Website */}
              <div
                className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-gray-400 transition-all duration-300 relative"
              >
                <div className="mb-6">
                  <h3 className="font-jetbrains text-2xl font-bold text-black mb-2">
                    Static Website
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Perfect for portfolios, landing pages, and simple business sites
                  </p>
                  <div className="text-3xl font-bold text-black mb-2">
                    {formatPrice(currentPricing.static.setup, currentPricing.currency)}
                  </div>
                  <div className="text-sm text-gray-500 mb-6">
                    One-time setup + {formatPrice(currentPricing.static.monthly, currentPricing.currency)}/month
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium mb-4">
                    Most Popular for Small Businesses
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    5 Pages Included
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    Mobile-first Design
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    SEO + Speed Optimization
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    Unlimited Updates
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    SSL Certificate
                  </li>
                </ul>

                <button
                  onClick={() => handlePackageSelection('staticSetup')}
                  className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300 mb-3"
                >
                  Start Your Website
                </button>
                <p className="text-xs text-gray-500 text-center">Free consultation included</p>
              </div>

              {/* Dynamic Website */}
              <div
                className="bg-white border-2 border-gray-300 rounded-lg p-8 hover:border-gray-500 transition-all duration-300 relative"
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span
                    className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium"
                  >Most Popular</span
                  >
                </div>
                <div className="mb-6">
                  <h3 className="font-jetbrains text-2xl font-bold text-black mb-2">
                    Dynamic Website
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Ideal for blogs, service businesses, and content-heavy sites
                  </p>
                  <div className="text-3xl font-bold text-black mb-2">
                    {formatPrice(currentPricing.dynamic.setup, currentPricing.currency)}
                  </div>
                  <div className="text-sm text-gray-500 mb-6">
                    One-time setup + {formatPrice(currentPricing.dynamic.monthly, currentPricing.currency)}/month
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium mb-4">
                    Best Value for Growing Businesses
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    7 Pages Included
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    1 Product Listing
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    CMS Admin Panel
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    1 Payment Gateway
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    Mobile-first Design
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    SEO + Speed Optimization
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    Unlimited Updates
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    SSL Certificate
                  </li>
                </ul>

                <button
                  onClick={() => handlePackageSelection('dynamicSetup')}
                  className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300 mb-3"
                >
                  Start Your Website
                </button>
                <p className="text-xs text-gray-500 text-center">Free consultation included</p>
              </div>

              {/* E-commerce Website */}
              <div
                className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-gray-400 transition-all duration-300 relative"
              >
                <div className="mb-6">
                  <h3 className="font-jetbrains text-2xl font-bold text-black mb-2">
                    E-commerce Website
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Complete online stores with payment processing
                  </p>
                  <div className="text-3xl font-bold text-black mb-2">
                    {formatPrice(currentPricing.ecommerce.setup, currentPricing.currency)}
                  </div>
                  <div className="text-sm text-gray-500 mb-6">
                    One-time setup + {formatPrice(currentPricing.ecommerce.monthly, currentPricing.currency)}/month
                  </div>
                  <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium mb-4">
                    Complete Online Store Solution
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    10 Pages Included
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    30 Products Listing
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    Full Dashboard
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    2 Payment Gateways
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    Inventory Management
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    Mobile-first Design
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    SEO + Speed Optimization
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    Unlimited Updates
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    SSL Certificate
                  </li>
                </ul>

                <button
                  onClick={() => handlePackageSelection('ecommerceSetup')}
                  className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300 mb-3"
                >
                  Start Your Store
                </button>
                <p className="text-xs text-gray-500 text-center">Free consultation included</p>
              </div>
            </div>

            {/* Why Choose Website14 Section */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-16">
              <div className="px-6 py-8">
                <div className="text-center mb-8">
                  <h2 className="font-jetbrains text-3xl font-bold text-black mb-4">
                    💡 Why Choose Website14?
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    We're not just another web design company — we're your tech partners.
                  </p>
                </div>

                <div className="max-w-4xl mx-auto">
                  <div className="mb-8">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      We started Website14 with one simple idea:
                    </p>
                    <div className="bg-gray-50 border-l-4 border-black p-6 my-6">
                      <p className="text-lg font-medium text-gray-900 italic">
                        &quot;Why should people struggle with DIY tools like Wix or Shopify when they can get a professionally-built, lightning-fast, mobile-first website — with unlimited updates and ongoing support — for a price even cheaper than DIY platforms?"
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">1</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Professional Websites for the Price of DIY Tools</h3>
                          <p className="text-gray-600 text-sm">
                            You pay a small monthly fee — and get a full-blown custom-built website that looks better, loads faster, and ranks higher on Google. No templates. No compromises.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">2</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Unlimited Updates, Forever</h3>
                          <p className="text-gray-600 text-sm">
                            Tired of agencies that ghost you after delivery? With us, you get unlimited content updates and edits — as long as you're hosted with us. We treat your website like a living, growing asset.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">3</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Mobile-First, Speed-Optimized, SEO-Ready</h3>
                          <p className="text-gray-600 text-sm">
                            Every site we build is optimized for mobile phones (first!), blazing speed, Google rankings, and security (SSL + proactive monitoring).
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">4</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">No Hidden Charges</h3>
                          <p className="text-gray-600 text-sm">
                            Our pricing is simple, clear, and flexible. You pay for what you use, and can upgrade anytime. Want more pages? More products? More emails? We'll grow with you.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">5</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Real Human Support, Always</h3>
                          <p className="text-gray-600 text-sm">
                            You're not dealing with bots or a faceless company. We're a real team — driven, skilled, and just one message away. We'll guide you, advise you, and handle everything technical so you can focus on your business.
                          </p>
                        </div>
                      </div>

                      <div className="bg-black text-white p-6 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3">💬 In Short:</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <span className="text-green-400 mr-2">✓</span>
                            You focus on your brand
                          </li>
                          <li className="flex items-center">
                            <span className="text-green-400 mr-2">✓</span>
                            We'll handle the tech, design, updates, speed, security, and everything in between
                          </li>
                          <li className="flex items-center">
                            <span className="text-green-400 mr-2">✓</span>
                            Affordably, professionally, and passionately
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-16">
              <div className="px-6 py-8">
                <div className="text-center mb-8">
                  <h2 className="font-jetbrains text-3xl font-bold text-black mb-4">
                    What Our Clients Say
                  </h2>
                  <p className="text-lg text-gray-600">
                    Don't just take our word for it
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="text-yellow-400 text-xl">★★★★★</div>
                      <span className="ml-2 text-sm text-gray-600">5.0</span>
                    </div>
                    <p className="text-gray-700 mb-4">
                      &quot;Website14 built our e-commerce site in just 2 weeks. The site loads super fast and we're already seeing sales. Their unlimited updates policy is a game-changer!"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                      <div>
                        <div className="font-semibold text-gray-900">Sarah Johnson</div>
                        <div className="text-sm text-gray-600">Boutique Owner</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="text-yellow-400 text-xl">★★★★★</div>
                      <span className="ml-2 text-sm text-gray-600">5.0</span>
                    </div>
                    <p className="text-gray-700 mb-4">
                      &quot;Finally, a web company that doesn't disappear after launch! They've been updating our site for 6 months and always respond within hours."
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                      <div>
                        <div className="font-semibold text-gray-900">Mike Chen</div>
                        <div className="text-sm text-gray-600">Restaurant Owner</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="text-yellow-400 text-xl">★★★★★</div>
                      <span className="ml-2 text-sm text-gray-600">5.0</span>
                    </div>
                    <p className="text-gray-700 mb-4">
                      &quot;I was paying $300/month for a basic Shopify store. Website14 built me a custom site for $59 setup + $5/month. It looks 10x better and converts better too!"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                      <div>
                        <div className="font-semibold text-gray-900">Lisa Rodriguez</div>
                        <div className="text-sm text-gray-600">Online Store Owner</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Comparison Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-16">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Feature Comparison</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Static Website</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dynamic Website</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-commerce Website</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pages Included</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Extra Page</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(currentPricing.addons.extraPage, currentPricing.currency)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(currentPricing.addons.extraPage, currentPricing.currency)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(currentPricing.addons.extraPage, currentPricing.currency)}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Products</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Extra Product</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(currentPricing.addons.extraProduct, currentPricing.currency)}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Payment Gateways</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Extra Payment Gateway</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(currentPricing.addons.extraPaymentGateway, currentPricing.currency)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(currentPricing.addons.extraPaymentGateway, currentPricing.currency)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add-ons Section */}
            <div id="addons-section" className="bg-white rounded-lg shadow overflow-hidden mb-16">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Add-ons & Extras</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Extra Pages</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Static Website Page</span>
                        <span>{formatPrice(currentPricing.addons.extraPage, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dynamic Website Page</span>
                        <span>{formatPrice(currentPricing.addons.extraPage, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>E-commerce Page</span>
                        <span>{formatPrice(currentPricing.addons.extraPage, currentPricing.currency)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">E-commerce Features</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Extra Product</span>
                        <span>{formatPrice(currentPricing.addons.extraProduct, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Extra Payment Gateway</span>
                        <span>{formatPrice(currentPricing.addons.extraPaymentGateway, currentPricing.currency)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Additional Features</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Contact Forms</span>
                        <span>{formatPrice(currentPricing.addons.contactForms, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Newsletter Signup</span>
                        <span>{formatPrice(currentPricing.addons.newsletterSignup, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Social Media Integration</span>
                        <span>{formatPrice(currentPricing.addons.socialMediaIntegration, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Google Maps Integration</span>
                        <span>{formatPrice(currentPricing.addons.googleMapsIntegration, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Booking/Appointment System</span>
                        <span>{formatPrice(currentPricing.addons.bookingAppointmentSystem, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Live Chat</span>
                        <span>{formatPrice(currentPricing.addons.liveChat, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Multi-language Support</span>
                        <span>{formatPrice(currentPricing.addons.multiLanguageSupport, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Search Functionality</span>
                        <span>{formatPrice(currentPricing.addons.searchFunctionality, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Image Gallery</span>
                        <span>{formatPrice(currentPricing.addons.imageGallery, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Video Integration</span>
                        <span>{formatPrice(currentPricing.addons.videoIntegration, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Logo Design</span>
                        <span>{formatPrice(currentPricing.addons.logoDesign, currentPricing.currency)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Features Section */}
            <div id="additional-features-section" className="bg-white rounded-lg shadow overflow-hidden mb-16">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Additional Features & Integrations</h2>
                <p className="text-sm text-gray-600 mt-1">Enhance your website with powerful features and integrations</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Communication Features
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Contact Forms</span>
                        <span className="font-semibold text-blue-600">{formatPrice(currentPricing.addons.contactForms, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Newsletter Signup</span>
                        <span className="font-semibold text-blue-600">{formatPrice(currentPricing.addons.newsletterSignup, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Live Chat</span>
                        <span className="font-semibold text-blue-600">{formatPrice(currentPricing.addons.liveChat, currentPricing.currency)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Social & Maps
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Social Media Integration</span>
                        <span className="font-semibold text-green-600">{formatPrice(currentPricing.addons.socialMediaIntegration, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Google Maps Integration</span>
                        <span className="font-semibold text-green-600">{formatPrice(currentPricing.addons.googleMapsIntegration, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Booking/Appointment System</span>
                        <span className="font-semibold text-green-600">{formatPrice(currentPricing.addons.bookingAppointmentSystem, currentPricing.currency)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Advanced Features
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Multi-language Support</span>
                        <span className="font-semibold text-purple-600">{formatPrice(currentPricing.addons.multiLanguageSupport, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Search Functionality</span>
                        <span className="font-semibold text-purple-600">{formatPrice(currentPricing.addons.searchFunctionality, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Image Gallery</span>
                        <span className="font-semibold text-purple-600">{formatPrice(currentPricing.addons.imageGallery, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Video Integration</span>
                        <span className="font-semibold text-purple-600">{formatPrice(currentPricing.addons.videoIntegration, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Logo Design</span>
                        <span className="font-semibold text-purple-600">{formatPrice(currentPricing.addons.logoDesign, currentPricing.currency)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">💡 Why Add These Features?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      These features can significantly improve user engagement, lead generation, and overall website performance.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-blue-600 mb-1">📈 Higher Conversions</div>
                        <div className="text-gray-600">Contact forms and live chat increase lead capture</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600 mb-1">🌍 Global Reach</div>
                        <div className="text-gray-600">Multi-language support expands your audience</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-purple-600 mb-1">🎯 Better UX</div>
                        <div className="text-gray-600">Advanced features improve user experience</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hosting & Maintenance Plans Section */}
            <div id="hosting-section" className="bg-white rounded-lg shadow overflow-hidden mb-16">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Hosting & Maintenance Plans</h2>
                <p className="text-sm text-gray-600 mt-1">Choose your hosting plan with unlimited updates and support</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Static Website Plans */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">Static Website</h3>
                    <div className="space-y-3">
                      <div className="text-center p-3 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-1">Monthly</h4>
                        <div className="text-xl font-bold text-black">{formatPrice(currentPricing.static.monthly, currentPricing.currency)}</div>
                        <div className="text-xs text-gray-500">per month</div>
                      </div>
                      <div className="text-center p-3 border border-green-200 rounded-lg bg-green-50">
                        <h4 className="font-medium text-gray-900 mb-1">Yearly</h4>
                        <div className="text-xl font-bold text-green-600">
                          {formatPrice(Math.round(currentPricing.static.monthly * 10 * (1 - currentPricing.discounts.yearly / 100)), currentPricing.currency)}
                        </div>
                        <div className="text-xs text-gray-500">per year</div>
                        <div className="text-xs text-green-600 font-medium mt-1">
                          Save {currentPricing.discounts.yearly}%
                        </div>
                      </div>
                      <div className="text-center p-3 border border-blue-200 rounded-lg bg-blue-50">
                        <h4 className="font-medium text-gray-900 mb-1">2 Year Plan</h4>
                        <div className="text-xl font-bold text-blue-600">
                          {formatPrice(Math.round(currentPricing.static.monthly * 18 * (1 - currentPricing.discounts.twoYear / 100)), currentPricing.currency)}
                        </div>
                        <div className="text-xs text-gray-500">per 2 years</div>
                        <div className="text-xs text-blue-600 font-medium mt-1">
                          Save {currentPricing.discounts.twoYear}%
                        </div>
                      </div>
                      <div className="text-center p-3 border border-purple-200 rounded-lg bg-purple-50">
                        <h4 className="font-medium text-gray-900 mb-1">3 Year Plan</h4>
                        <div className="text-xl font-bold text-purple-600">
                          {formatPrice(Math.round(currentPricing.static.monthly * 25 * (1 - currentPricing.discounts.threeYear / 100)), currentPricing.currency)}
                        </div>
                        <div className="text-xs text-gray-500">per 3 years</div>
                        <div className="text-xs text-purple-600 font-medium mt-1">
                          Save {currentPricing.discounts.threeYear}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Website Plans */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">Dynamic Website</h3>
                    <div className="space-y-3">
                      <div className="text-center p-3 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-1">Monthly</h4>
                        <div className="text-xl font-bold text-black">{formatPrice(currentPricing.dynamic.monthly, currentPricing.currency)}</div>
                        <div className="text-xs text-gray-500">per month</div>
                      </div>
                      <div className="text-center p-3 border border-green-200 rounded-lg bg-green-50">
                        <h4 className="font-medium text-gray-900 mb-1">Yearly</h4>
                        <div className="text-xl font-bold text-green-600">
                          {formatPrice(Math.round(currentPricing.dynamic.monthly * 10 * (1 - currentPricing.discounts.yearly / 100)), currentPricing.currency)}
                        </div>
                        <div className="text-xs text-gray-500">per year</div>
                        <div className="text-xs text-green-600 font-medium mt-1">
                          Save {currentPricing.discounts.yearly}%
                        </div>
                      </div>
                      <div className="text-center p-3 border border-blue-200 rounded-lg bg-blue-50">
                        <h4 className="font-medium text-gray-900 mb-1">2 Year Plan</h4>
                        <div className="text-xl font-bold text-blue-600">
                          {formatPrice(Math.round(currentPricing.dynamic.monthly * 18 * (1 - currentPricing.discounts.twoYear / 100)), currentPricing.currency)}
                        </div>
                        <div className="text-xs text-gray-500">per 2 years</div>
                        <div className="text-xs text-blue-600 font-medium mt-1">
                          Save {currentPricing.discounts.twoYear}%
                        </div>
                      </div>
                      <div className="text-center p-3 border border-purple-200 rounded-lg bg-purple-50">
                        <h4 className="font-medium text-gray-900 mb-1">3 Year Plan</h4>
                        <div className="text-xl font-bold text-purple-600">
                          {formatPrice(Math.round(currentPricing.dynamic.monthly * 25 * (1 - currentPricing.discounts.threeYear / 100)), currentPricing.currency)}
                        </div>
                        <div className="text-xs text-gray-500">per 3 years</div>
                        <div className="text-xs text-purple-600 font-medium mt-1">
                          Save {currentPricing.discounts.threeYear}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* E-commerce Website Plans */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">E-commerce Website</h3>
                    <div className="space-y-3">
                      <div className="text-center p-3 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-1">Monthly</h4>
                        <div className="text-xl font-bold text-black">{formatPrice(currentPricing.ecommerce.monthly, currentPricing.currency)}</div>
                        <div className="text-xs text-gray-500">per month</div>
                      </div>
                      <div className="text-center p-3 border border-green-200 rounded-lg bg-green-50">
                        <h4 className="font-medium text-gray-900 mb-1">Yearly</h4>
                        <div className="text-xl font-bold text-green-600">
                          {formatPrice(Math.round(currentPricing.ecommerce.monthly * 10 * (1 - currentPricing.discounts.yearly / 100)), currentPricing.currency)}
                        </div>
                        <div className="text-xs text-gray-500">per year</div>
                        <div className="text-xs text-green-600 font-medium mt-1">
                          Save {currentPricing.discounts.yearly}%
                        </div>
                      </div>
                      <div className="text-center p-3 border border-blue-200 rounded-lg bg-blue-50">
                        <h4 className="font-medium text-gray-900 mb-1">2 Year Plan</h4>
                        <div className="text-xl font-bold text-blue-600">
                          {formatPrice(Math.round(currentPricing.ecommerce.monthly * 18 * (1 - currentPricing.discounts.twoYear / 100)), currentPricing.currency)}
                        </div>
                        <div className="text-xs text-gray-500">per 2 years</div>
                        <div className="text-xs text-blue-600 font-medium mt-1">
                          Save {currentPricing.discounts.twoYear}%
                        </div>
                      </div>
                      <div className="text-center p-3 border border-purple-200 rounded-lg bg-purple-50">
                        <h4 className="font-medium text-gray-900 mb-1">3 Year Plan</h4>
                        <div className="text-xl font-bold text-purple-600">
                          {formatPrice(Math.round(currentPricing.ecommerce.monthly * 25 * (1 - currentPricing.discounts.threeYear / 100)), currentPricing.currency)}
                        </div>
                        <div className="text-xs text-gray-500">per 3 years</div>
                        <div className="text-xs text-purple-600 font-medium mt-1">
                          Save {currentPricing.discounts.threeYear}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">What's Included</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Unlimited Updates
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        24/7 Support
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        SSL Certificate
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Daily Backups
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Performance Monitoring
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Security Updates
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Content Updates
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        SEO Optimization
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Hosting Section */}
            <div id="email-section" className="bg-white rounded-lg shadow overflow-hidden mb-16">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Email Hosting</h2>
                <p className="text-sm text-gray-600 mt-1">Professional email accounts for your domain</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Monthly</h3>
                    <div className="text-2xl font-bold text-black">{formatPrice(currentPricing.addons.emailAccount, currentPricing.currency)}</div>
                    <div className="text-sm text-gray-500">per email account</div>
                  </div>
                  <div className="text-center p-4 border border-green-200 rounded-lg bg-green-50">
                    <h3 className="font-semibold text-gray-900 mb-2">Yearly</h3>
                    <div className="text-2xl font-bold text-green-600">
                      {formatPrice(Math.round(currentPricing.addons.emailAccount * 10 * (1 - currentPricing.discounts.yearly / 100)), currentPricing.currency)}
                    </div>
                    <div className="text-sm text-gray-500">per email account</div>
                    <div className="text-xs text-green-600 font-medium mt-1">
                      Save {currentPricing.discounts.yearly}%
                    </div>
                  </div>
                  <div className="text-center p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <h3 className="font-semibold text-gray-900 mb-2">2 Year Plan</h3>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(Math.round(currentPricing.addons.emailAccount * 18 * (1 - currentPricing.discounts.twoYear / 100)), currentPricing.currency)}
                    </div>
                    <div className="text-sm text-gray-500">per email account</div>
                    <div className="text-xs text-blue-600 font-medium mt-1">
                      Save {currentPricing.discounts.twoYear}%
                    </div>
                  </div>
                  <div className="text-center p-4 border border-purple-200 rounded-lg bg-purple-50">
                    <h3 className="font-semibold text-gray-900 mb-2">3 Year Plan</h3>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatPrice(Math.round(currentPricing.addons.emailAccount * 25 * (1 - currentPricing.discounts.threeYear / 100)), currentPricing.currency)}
                    </div>
                    <div className="text-sm text-gray-500">per email account</div>
                    <div className="text-xs text-purple-600 font-medium mt-1">
                      Save {currentPricing.discounts.threeYear}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Reversal & Final CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-16">
              <div className="text-center">
                <h2 className="font-jetbrains text-3xl font-bold mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-xl mb-6 opacity-90">
                  Join 500+ businesses who trust Website14 with their online presence
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">30 Days</div>
                    <div className="text-sm opacity-90">Money Back Guarantee</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">Free</div>
                    <div className="text-sm opacity-90">Consultation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">Unlimited</div>
                    <div className="text-sm opacity-90">Updates Included</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => handlePackageSelection('dynamicSetup')}
                    className="bg-white text-blue-600 py-4 px-8 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 text-lg"
                  >
                    Get Your Free Quote
                  </button>
                  <Link href="/contact">
                    <button className="border-2 border-white text-white py-4 px-8 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 text-lg">
                      Talk to Our Team
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
} 