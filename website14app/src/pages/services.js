import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { useLocation } from '../hooks/useLocation';
import { usePricing } from '../hooks/usePricing';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import AnimatedCounter from '../components/AnimatedCounter';

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
      <SEO
        title="Professional Website Development Services - Website14"
        description="Get a professional, mobile-first website with unlimited updates for less than DIY platforms. Trusted by 500+ businesses. Start from $59 setup + $5/month."
        keywords="web development services, website design, custom websites, static websites, dynamic websites, e-commerce development, professional web design"
        url="https://website14.com/services"
        type="website"
      />

      <div className="bg-white text-slate-900 font-sans min-h-screen flex flex-col">
        <Header />

        {/* Main Content */}
        <div className="flex-1">

          {/* Hero Section - Compact Split Layout with Integrated Trust Indicators */}
          <section className="bg-gradient-to-br from-slate-50 via-white to-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Content */}
                <div>
                  <div className="inline-flex items-center bg-slate-50 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-slate-200">
                    <span className="w-2 h-2 bg-purple-800 rounded-full mr-2 animate-pulse"></span>
                    Trusted by 500+ Businesses Worldwide
                  </div>
                  <h1 className="font-heading text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                    Professional Websites
                    <span className="text-purple-800 block">That Convert</span>
                  </h1>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed font-body">
                    Get a custom-built, mobile-first website with unlimited updates for less than DIY platforms.
                    <span className="font-semibold text-slate-900"> No templates. No compromises.</span>
                  </p>
                  {isLoading && pricingData && (
                    <div className="mb-4 text-sm text-purple-800">
                      <span className="inline-flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating prices from database...
                      </span>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-6">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">Free Consultation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">30-Day Guarantee</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">Unlimited Updates</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePackageSelection('dynamicSetup')}
                    className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-900 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Get Your Free Quote Now
                  </button>
                </div>

                {/* Right Column - Trust Indicators Card */}
                <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                  <h3 className="font-subheading text-lg font-semibold text-slate-900 mb-6 text-center">Why Businesses Trust Us</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <AnimatedCounter
                        target={500}
                        suffix="+"
                        duration={2000}
                        className="font-heading text-3xl lg:text-4xl font-bold text-purple-800 mb-2"
                      />
                      <div className="text-sm text-slate-600 font-medium">Happy Clients</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <AnimatedCounter
                        target={98}
                        suffix="%"
                        duration={2000}
                        className="font-heading text-3xl lg:text-4xl font-bold text-purple-800 mb-2"
                      />
                      <div className="text-sm text-slate-600 font-medium">Satisfaction Rate</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="font-heading text-3xl lg:text-4xl font-bold text-purple-800 mb-2">24/7</div>
                      <div className="text-sm text-slate-600 font-medium">Support Available</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <AnimatedCounter
                        target={30}
                        suffix=" Days"
                        duration={2000}
                        className="font-heading text-3xl lg:text-4xl font-bold text-purple-800 mb-2"
                      />
                      <div className="text-sm text-slate-600 font-medium">Money Back</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Floating Currency Selector */}
            <div className="fixed top-20 right-4 z-50">
              <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-medium">Currency</span>
                  <select
                    value={selectedCurrency || ''}
                    onChange={(e) => setSelectedCurrency(e.target.value || null)}
                    className="text-xs border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-800"
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
                      className="text-xs text-slate-400 hover:text-slate-600"
                      title="Reset to auto-detect"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Services Grid with Dynamic Pricing */}
            <section className="mb-24">
              <div className="text-center mb-16">
                <h2 className="font-heading text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Choose Your Package</h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto font-body">
                  Professional web development solutions tailored to your business needs
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                {/* Static Website */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-purple-300 transform hover:-translate-y-1">
                  <div className="mb-6">
                    <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="font-subheading text-2xl font-semibold text-slate-900 mb-2">
                      Static Website
                    </h3>
                    <p className="text-slate-600 mb-4 font-body">
                      Perfect for portfolios, landing pages, and simple business sites
                    </p>
                    <div className="text-4xl font-heading font-bold text-slate-900 mb-2">
                      {formatPrice(currentPricing.static.setup, currentPricing.currency)}
                    </div>
                    <div className="text-sm text-slate-500 mb-6 font-body">
                      One-time setup + {formatPrice(currentPricing.static.monthly, currentPricing.currency)}/month
                    </div>
                    <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold mb-4 inline-block">
                      Most Popular for Small Businesses
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      5 Pages Included
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Mobile-First Design
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      SEO + Speed Optimization
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Unlimited Updates
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      SSL Certificate
                    </li>
                  </ul>

                  <button
                    onClick={() => handlePackageSelection('staticSetup')}
                    className="w-full bg-gradient-to-r from-purple-800 to-purple-900 text-white py-3 rounded-lg font-semibold hover:from-purple-900 hover:to-slate-900 transition-colors mb-3"
                  >
                    Start Your Website
                  </button>
                  <p className="text-xs text-slate-500 text-center font-body">Free consultation included</p>
                </div>

                {/* Dynamic Website */}
                <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-purple-800/40 relative transform hover:-translate-y-1">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-lg">Most Popular</span>
                  </div>
                  <div className="mb-6">
                    <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-7 h-7 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                    <h3 className="font-subheading text-2xl font-semibold text-slate-900 mb-2">
                      Dynamic Website
                    </h3>
                    <p className="text-slate-600 mb-4 font-body">
                      Ideal for blogs, service businesses, and content-heavy sites
                    </p>
                    <div className="text-4xl font-heading font-bold text-slate-900 mb-2">
                      {formatPrice(currentPricing.dynamic.setup, currentPricing.currency)}
                    </div>
                    <div className="text-sm text-slate-500 mb-6 font-body">
                      One-time setup + {formatPrice(currentPricing.dynamic.monthly, currentPricing.currency)}/month
                    </div>
                    <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold mb-4 inline-block">
                      Best Value for Growing Businesses
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      7 Pages Included
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      1 Product Listing
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      CMS Admin Panel
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      1 Payment Gateway
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Mobile-First Design
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      SEO + Speed Optimization
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Unlimited Updates
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      SSL Certificate
                    </li>
                  </ul>

                  <button
                    onClick={() => handlePackageSelection('dynamicSetup')}
                    className="w-full bg-gradient-to-r from-purple-800 to-purple-900 text-white py-3 rounded-lg font-semibold hover:from-purple-900 hover:to-slate-900 transition-colors mb-3"
                  >
                    Start Your Website
                  </button>
                  <p className="text-xs text-slate-500 text-center font-body">Free consultation included</p>
                </div>

                {/* E-commerce Website */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-purple-300 transform hover:-translate-y-1">
                  <div className="mb-6">
                    <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-7 h-7 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="font-subheading text-2xl font-semibold text-slate-900 mb-2">
                      E-commerce Website
                    </h3>
                    <p className="text-slate-600 mb-4 font-body">
                      Complete online stores with payment processing
                    </p>
                    <div className="text-4xl font-heading font-bold text-slate-900 mb-2">
                      {formatPrice(currentPricing.ecommerce.setup, currentPricing.currency)}
                    </div>
                    <div className="text-sm text-slate-500 mb-6 font-body">
                      One-time setup + {formatPrice(currentPricing.ecommerce.monthly, currentPricing.currency)}/month
                    </div>
                    <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold mb-4 inline-block">
                      Complete Online Store Solution
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      10 Pages Included
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      30 Products Listing
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Full Dashboard
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      2 Payment Gateways
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Inventory Management
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Mobile-First Design
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      SEO + Speed Optimization
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Unlimited Updates
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      SSL Certificate
                    </li>
                  </ul>

                  <button
                    onClick={() => handlePackageSelection('ecommerceSetup')}
                    className="w-full bg-gradient-to-r from-purple-800 to-purple-900 text-white py-3 rounded-lg font-semibold hover:from-purple-900 hover:to-slate-900 transition-colors mb-3"
                  >
                    Start Your Store
                  </button>
                  <p className="text-xs text-slate-500 text-center font-body">Free consultation included</p>
                </div>
              </div>
            </section>

            {/* Why Choose Website14 Section */}
            <section className="bg-gradient-to-br from-slate-50 to-white py-24 mb-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                  <h2 className="font-heading text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Why Choose Website14?</h2>
                  <p className="text-xl text-slate-600 max-w-3xl mx-auto font-body">
                    We're not just another web design company — we're your tech partners.
                  </p>
                </div>

                <div className="max-w-5xl mx-auto">
                  <div className="mb-12">
                    <p className="text-slate-700 text-lg leading-relaxed font-body mb-4">
                      We started Website14 with one simple idea:
                    </p>
                    <div className="bg-gradient-to-r from-purple-50 to-slate-50 border-l-4 border-purple-800 p-8 my-6 rounded-r-xl shadow-lg">
                      <p className="text-lg font-medium text-slate-900 italic font-body leading-relaxed">
                        &quot;Why should people struggle with DIY tools like Wix or Shopify when they can get a professionally-built, lightning-fast, mobile-first website — with unlimited updates and ongoing support — for a price even cheaper than DIY platforms?&quot;
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-purple-300">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                          <svg className="w-7 h-7 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-subheading font-semibold text-slate-900 mb-2">Professional Websites for the Price of DIY Tools</h3>
                          <p className="text-slate-600 text-sm font-body leading-relaxed">
                            You pay a small monthly fee — and get a full-blown custom-built website that looks better, loads faster, and ranks higher on Google. No templates. No compromises.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-purple-300">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                          <svg className="w-7 h-7 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-subheading font-semibold text-slate-900 mb-2">Unlimited Updates, Forever</h3>
                          <p className="text-slate-600 text-sm font-body leading-relaxed">
                            Tired of agencies that ghost you after delivery? With us, you get unlimited content updates and edits — as long as you're hosted with us. We treat your website like a living, growing asset.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-purple-300">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                          <svg className="w-7 h-7 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-subheading font-semibold text-slate-900 mb-2">Mobile-First, Speed-Optimized, SEO-Ready</h3>
                          <p className="text-slate-600 text-sm font-body leading-relaxed">
                            Every site we build is optimized for mobile phones (first!), blazing speed, Google rankings, and security (SSL + proactive monitoring).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-purple-300">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                          <svg className="w-7 h-7 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-subheading font-semibold text-slate-900 mb-2">No Hidden Charges</h3>
                          <p className="text-slate-600 text-sm font-body leading-relaxed">
                            Our pricing is simple, clear, and flexible. You pay for what you use, and can upgrade anytime. Want more pages? More products? More emails? We'll grow with you.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-purple-300">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                          <svg className="w-7 h-7 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-subheading font-semibold text-slate-900 mb-2">Real Human Support, Always</h3>
                          <p className="text-slate-600 text-sm font-body leading-relaxed">
                            You're not dealing with bots or a faceless company. We're a real team — driven, skilled, and just one message away. We'll guide you, advise you, and handle everything technical so you can focus on your business.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-800 via-purple-900 to-slate-900 text-white p-8 rounded-xl shadow-xl border border-purple-700/50">
                      <h3 className="font-subheading font-semibold text-xl mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        In Short:
                      </h3>
                      <ul className="space-y-3 text-sm font-body">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>You focus on your brand</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>We'll handle the tech, design, updates, speed, security, and everything in between</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Affordably, professionally, and passionately</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-white py-24 mb-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="font-heading text-4xl lg:text-5xl font-bold text-slate-900 mb-4">What Our Clients Say</h2>
                  <p className="text-xl text-slate-600 font-body">
                    Don't just take our word for it
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-slate-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-purple-300 transform hover:-translate-y-1">
                    <div className="flex items-center mb-4">
                      <div className="text-yellow-400 text-xl">★★★★★</div>
                      <span className="ml-2 text-sm text-slate-600 font-medium">5.0</span>
                    </div>
                    <p className="text-slate-700 mb-6 font-body leading-relaxed">
                      &quot;Website14 built our e-commerce site in just 2 weeks. The site loads super fast and we're already seeing sales. Their unlimited updates policy is a game-changer!&quot;
                    </p>
                    <div className="flex items-center pt-4 border-t border-slate-200">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mr-3 flex items-center justify-center text-white font-semibold text-lg">SJ</div>
                      <div>
                        <div className="font-semibold text-slate-900">Sarah Johnson</div>
                        <div className="text-sm text-slate-600">Boutique Owner</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-purple-300 transform hover:-translate-y-1">
                    <div className="flex items-center mb-6">
                      <div className="text-yellow-400 text-xl">★★★★★</div>
                      <span className="ml-2 text-sm text-slate-600 font-semibold">5.0</span>
                    </div>
                    <p className="text-slate-700 mb-6 font-body leading-relaxed text-base">
                      &quot;Finally, a web company that doesn't disappear after launch! They've been updating our site for 6 months and always respond within hours.&quot;
                    </p>
                    <div className="flex items-center pt-4 border-t border-slate-200">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mr-3 flex items-center justify-center text-white font-semibold text-lg">MC</div>
                      <div>
                        <div className="font-semibold text-slate-900">Mike Chen</div>
                        <div className="text-sm text-slate-600">Restaurant Owner</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-purple-300 transform hover:-translate-y-1">
                    <div className="flex items-center mb-6">
                      <div className="text-yellow-400 text-xl">★★★★★</div>
                      <span className="ml-2 text-sm text-slate-600 font-semibold">5.0</span>
                    </div>
                    <p className="text-slate-700 mb-6 font-body leading-relaxed text-base">
                      &quot;I was paying $300/month for a basic Shopify store. Website14 built me a custom site for $59 setup + $5/month. It looks 10x better and converts better too!&quot;
                    </p>
                    <div className="flex items-center pt-4 border-t border-slate-200">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mr-3 flex items-center justify-center text-white font-semibold text-lg">LR</div>
                      <div>
                        <div className="font-semibold text-slate-900">Lisa Rodriguez</div>
                        <div className="text-sm text-slate-600">Online Store Owner</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Feature Comparison Table */}
            <section className="bg-white rounded-xl shadow-lg overflow-hidden mb-24 border border-slate-200">
              <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <h2 className="text-xl font-subheading font-semibold text-slate-900">Feature Comparison</h2>
                <p className="text-sm text-slate-600 mt-1 font-body">Compare features across all packages</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-subheading font-semibold text-slate-700 uppercase tracking-wider">Feature</th>
                      <th className="px-6 py-3 text-left text-xs font-subheading font-semibold text-slate-700 uppercase tracking-wider">Static Website</th>
                      <th className="px-6 py-3 text-left text-xs font-subheading font-semibold text-slate-700 uppercase tracking-wider">Dynamic Website</th>
                      <th className="px-6 py-3 text-left text-xs font-subheading font-semibold text-slate-700 uppercase tracking-wider">E-commerce Website</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Pages Included</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">5</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">7</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">10</td>
                    </tr>
                    <tr className="bg-slate-50/50 hover:bg-slate-100 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Extra Page</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{formatPrice(currentPricing.addons.extraPage, currentPricing.currency)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{formatPrice(currentPricing.addons.extraPage, currentPricing.currency)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{formatPrice(currentPricing.addons.extraPage, currentPricing.currency)}</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Products</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-semibold text-purple-800">30</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Extra Product</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{formatPrice(currentPricing.addons.extraProduct, currentPricing.currency)}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Payment Gateways</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-semibold text-purple-800">1</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-semibold text-purple-800">2</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Extra Payment Gateway</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{formatPrice(currentPricing.addons.extraPaymentGateway, currentPricing.currency)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{formatPrice(currentPricing.addons.extraPaymentGateway, currentPricing.currency)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Add-ons Section */}
            <section id="addons-section" className="bg-slate-50 rounded-xl shadow-lg overflow-hidden mb-24 border border-slate-200">
              <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <h2 className="text-xl font-subheading font-semibold text-slate-900">Add-ons & Extras</h2>
                <p className="text-sm text-slate-600 mt-1 font-body">Enhance your website with additional features</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-purple-300 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="font-subheading font-semibold text-slate-900">Extra Pages</h3>
                    </div>
                    <div className="space-y-2 text-sm font-body">
                      <div className="flex justify-between">
                        <span className="text-slate-700">Static Website Page</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.extraPage, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Dynamic Website Page</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.extraPage, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">E-commerce Page</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.extraPage, currentPricing.currency)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-purple-300 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <h3 className="font-subheading font-semibold text-slate-900">E-commerce Features</h3>
                    </div>
                    <div className="space-y-2 text-sm font-body">
                      <div className="flex justify-between">
                        <span className="text-slate-700">Extra Product</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.extraProduct, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Extra Payment Gateway</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.extraPaymentGateway, currentPricing.currency)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-purple-300 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </div>
                      <h3 className="font-subheading font-semibold text-slate-900">Additional Features</h3>
                    </div>
                    <div className="space-y-2 text-sm font-body">
                      <div className="flex justify-between">
                        <span className="text-slate-700">Contact Forms</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.contactForms, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Newsletter Signup</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.newsletterSignup, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Social Media Integration</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.socialMediaIntegration, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Google Maps Integration</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.googleMapsIntegration, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Booking/Appointment System</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.bookingAppointmentSystem, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Live Chat</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.liveChat, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Multi-language Support</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.multiLanguageSupport, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Search Functionality</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.searchFunctionality, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Image Gallery</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.imageGallery, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Video Integration</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.videoIntegration, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Logo Design</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.logoDesign, currentPricing.currency)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Additional Features Section */}
            <section id="additional-features-section" className="bg-white rounded-xl shadow-lg overflow-hidden mb-24 border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-subheading font-semibold text-slate-900">Additional Features & Integrations</h2>
                <p className="text-sm text-slate-600 mt-1 font-body">Enhance your website with powerful features and integrations</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="border border-slate-200 rounded-lg p-4 bg-white hover:border-purple-300 transition-colors">
                    <h3 className="font-subheading font-semibold text-slate-900 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Communication Features
                    </h3>
                    <div className="space-y-3 text-sm font-body">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">Contact Forms</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.contactForms, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">Newsletter Signup</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.newsletterSignup, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">Live Chat</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.liveChat, currentPricing.currency)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4 bg-white hover:border-purple-300 transition-colors">
                    <h3 className="font-subheading font-semibold text-slate-900 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Social & Maps
                    </h3>
                    <div className="space-y-3 text-sm font-body">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">Social Media Integration</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.socialMediaIntegration, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">Google Maps Integration</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.googleMapsIntegration, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">Booking/Appointment System</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.bookingAppointmentSystem, currentPricing.currency)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4 bg-white hover:border-purple-300 transition-colors">
                    <h3 className="font-subheading font-semibold text-slate-900 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Advanced Features
                    </h3>
                    <div className="space-y-3 text-sm font-body">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">Multi-language Support</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.multiLanguageSupport, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">Search Functionality</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.searchFunctionality, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">Image Gallery</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.imageGallery, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">Video Integration</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.videoIntegration, currentPricing.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">Logo Design</span>
                        <span className="font-semibold text-purple-800">{formatPrice(currentPricing.addons.logoDesign, currentPricing.currency)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-slate-50 rounded-xl border border-purple-200">
                  <div className="text-center">
                    <h3 className="font-subheading font-semibold text-slate-900 mb-2">Why Add These Features?</h3>
                    <p className="text-sm text-slate-600 mb-4 font-body">
                      These features can significantly improve user engagement, lead generation, and overall website performance.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-purple-800 mb-1">Higher Conversions</div>
                        <div className="text-slate-600 font-body">Contact forms and live chat increase lead capture</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-purple-800 mb-1">Global Reach</div>
                        <div className="text-slate-600 font-body">Multi-language support expands your audience</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-purple-800 mb-1">Better UX</div>
                        <div className="text-slate-600 font-body">Advanced features improve user experience</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Hosting & Maintenance Plans Section */}
            <section id="hosting-section" className="bg-slate-50 rounded-xl shadow-lg overflow-hidden mb-20">
              <div className="px-6 py-4 border-b border-slate-200 bg-white">
                <h2 className="text-lg font-subheading font-semibold text-slate-900">Hosting & Maintenance Plans</h2>
                <p className="text-sm text-slate-600 mt-1 font-body">Choose your hosting plan with unlimited updates and support</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Static Website Plans */}
                  <div className="space-y-4">
                    <h3 className="font-subheading font-semibold text-slate-900 border-b border-slate-200 pb-2">Static Website</h3>
                    <div className="space-y-3">
                      <div className="text-center p-4 border border-slate-200 rounded-lg bg-white">
                        <h4 className="font-medium text-slate-900 mb-1 font-body">Monthly</h4>
                        <div className="text-xl font-heading font-bold text-slate-900">{formatPrice(currentPricing.static.monthly, currentPricing.currency)}</div>
                        <div className="text-xs text-slate-500 font-body">per month</div>
                      </div>
                      <div className="text-center p-4 border border-green-200 rounded-lg bg-green-50">
                        <h4 className="font-medium text-slate-900 mb-1 font-body">Yearly</h4>
                        <div className="text-xl font-heading font-bold text-green-700">
                          {formatPrice(Math.round(currentPricing.static.monthly * 10 * (1 - currentPricing.discounts.yearly / 100)), currentPricing.currency)}
                        </div>
                        <div className="text-xs text-slate-500 font-body">per year</div>
                        <div className="text-xs text-green-700 font-semibold mt-1">
                          Save {currentPricing.discounts.yearly}%
                        </div>
                      </div>
                      <div className="text-center p-4 border border-purple-200 rounded-lg bg-purple-50">
                        <h4 className="font-medium text-slate-900 mb-1 font-body">2 Year Plan</h4>
                        <div className="text-xl font-heading font-bold text-purple-800">
                          {formatPrice(Math.round(currentPricing.static.monthly * 18 * (1 - currentPricing.discounts.twoYear / 100)), currentPricing.currency)}
                        </div>
                        <div className="text-xs text-slate-500 font-body">per 2 years</div>
                        <div className="text-xs text-purple-800 font-semibold mt-1">
                          Save {currentPricing.discounts.twoYear}%
                        </div>
                      </div>
                      <div className="text-center p-4 border border-purple-300 rounded-lg bg-purple-100">
                        <h4 className="font-medium text-slate-900 mb-1 font-body">3 Year Plan</h4>
                        <div className="text-xl font-heading font-bold text-purple-900">
                          {formatPrice(Math.round(currentPricing.static.monthly * 25 * (1 - currentPricing.discounts.threeYear / 100)), currentPricing.currency)}
                        </div>
                        <div className="text-xs text-slate-500 font-body">per 3 years</div>
                        <div className="text-xs text-purple-900 font-semibold mt-1">
                          Save {currentPricing.discounts.threeYear}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Website Plans */}
                  <div className="space-y-4">
                    <h3 className="font-subheading font-semibold text-slate-900 border-b border-slate-200 pb-2">Dynamic Website</h3>
                    <div className="space-y-3">
                      <div className="text-center p-4 border border-slate-200 rounded-lg bg-white">
                        <h4 className="font-medium text-slate-900 mb-1 font-body">Monthly</h4>
                        <div className="text-xl font-heading font-bold text-slate-900">{formatPrice(currentPricing.dynamic.monthly, currentPricing.currency)}</div>
                        <div className="text-xs text-slate-500 font-body">per month</div>
                      </div>
                      <div className="text-center p-4 border border-green-200 rounded-lg bg-green-50">
                        <h4 className="font-medium text-slate-900 mb-1 font-body">Yearly</h4>
                        <div className="text-xl font-heading font-bold text-green-700">
                          {formatPrice(Math.round(currentPricing.dynamic.monthly * 10 * (1 - currentPricing.discounts.yearly / 100)), currentPricing.currency)}
                        </div>
                        <div className="text-xs text-slate-500 font-body">per year</div>
                        <div className="text-xs text-green-700 font-semibold mt-1">
                          Save {currentPricing.discounts.yearly}%
                        </div>
                      </div>
                      <div className="text-center p-4 border border-purple-200 rounded-lg bg-purple-50">
                        <h4 className="font-medium text-slate-900 mb-1 font-body">2 Year Plan</h4>
                        <div className="text-xl font-heading font-bold text-purple-800">
                          {formatPrice(Math.round(currentPricing.dynamic.monthly * 18 * (1 - currentPricing.discounts.twoYear / 100)), currentPricing.currency)}
                        </div>
                        <div className="text-xs text-slate-500 font-body">per 2 years</div>
                        <div className="text-xs text-purple-800 font-semibold mt-1">
                          Save {currentPricing.discounts.twoYear}%
                        </div>
                      </div>
                      <div className="text-center p-4 border border-purple-300 rounded-lg bg-purple-100">
                        <h4 className="font-medium text-slate-900 mb-1 font-body">3 Year Plan</h4>
                        <div className="text-xl font-heading font-bold text-purple-900">
                          {formatPrice(Math.round(currentPricing.dynamic.monthly * 25 * (1 - currentPricing.discounts.threeYear / 100)), currentPricing.currency)}
                        </div>
                        <div className="text-xs text-slate-500 font-body">per 3 years</div>
                        <div className="text-xs text-purple-900 font-semibold mt-1">
                          Save {currentPricing.discounts.threeYear}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* E-commerce Website Plans */}
                  <div className="space-y-4">
                    <h3 className="font-subheading font-semibold text-slate-900 border-b border-slate-200 pb-2">E-commerce Website</h3>
                    <div className="space-y-3">
                      <div className="text-center p-4 border border-slate-200 rounded-lg bg-white">
                        <h4 className="font-medium text-slate-900 mb-1 font-body">Monthly</h4>
                        <div className="text-xl font-heading font-bold text-slate-900">{formatPrice(currentPricing.ecommerce.monthly, currentPricing.currency)}</div>
                        <div className="text-xs text-slate-500 font-body">per month</div>
                      </div>
                      <div className="text-center p-4 border border-green-200 rounded-lg bg-green-50">
                        <h4 className="font-medium text-slate-900 mb-1 font-body">Yearly</h4>
                        <div className="text-xl font-heading font-bold text-green-700">
                          {formatPrice(Math.round(currentPricing.ecommerce.monthly * 10 * (1 - currentPricing.discounts.yearly / 100)), currentPricing.currency)}
                        </div>
                        <div className="text-xs text-slate-500 font-body">per year</div>
                        <div className="text-xs text-green-700 font-semibold mt-1">
                          Save {currentPricing.discounts.yearly}%
                        </div>
                      </div>
                      <div className="text-center p-4 border border-purple-200 rounded-lg bg-purple-50">
                        <h4 className="font-medium text-slate-900 mb-1 font-body">2 Year Plan</h4>
                        <div className="text-xl font-heading font-bold text-purple-800">
                          {formatPrice(Math.round(currentPricing.ecommerce.monthly * 18 * (1 - currentPricing.discounts.twoYear / 100)), currentPricing.currency)}
                        </div>
                        <div className="text-xs text-slate-500 font-body">per 2 years</div>
                        <div className="text-xs text-purple-800 font-semibold mt-1">
                          Save {currentPricing.discounts.twoYear}%
                        </div>
                      </div>
                      <div className="text-center p-4 border border-purple-300 rounded-lg bg-purple-100">
                        <h4 className="font-medium text-slate-900 mb-1 font-body">3 Year Plan</h4>
                        <div className="text-xl font-heading font-bold text-purple-900">
                          {formatPrice(Math.round(currentPricing.ecommerce.monthly * 25 * (1 - currentPricing.discounts.threeYear / 100)), currentPricing.currency)}
                        </div>
                        <div className="text-xs text-slate-500 font-body">per 3 years</div>
                        <div className="text-xs text-purple-900 font-semibold mt-1">
                          Save {currentPricing.discounts.threeYear}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div className="space-y-4">
                    <h3 className="font-subheading font-semibold text-slate-900 border-b border-slate-200 pb-2">What's Included</h3>
                    <div className="space-y-2 text-sm font-body">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-slate-700">Unlimited Updates</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-slate-700">24/7 Support</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-slate-700">SSL Certificate</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-slate-700">Daily Backups</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-slate-700">Performance Monitoring</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-slate-700">Security Updates</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-slate-700">Content Updates</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-slate-700">SEO Optimization</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Email Hosting Section */}
            <section id="email-section" className="bg-white rounded-xl shadow-lg overflow-hidden mb-20">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-subheading font-semibold text-slate-900">Email Hosting</h2>
                <p className="text-sm text-slate-600 mt-1 font-body">Professional email accounts for your domain</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border border-slate-200 rounded-lg bg-white">
                    <h3 className="font-subheading font-semibold text-slate-900 mb-2">Monthly</h3>
                    <div className="text-2xl font-heading font-bold text-slate-900">{formatPrice(currentPricing.addons.emailAccount, currentPricing.currency)}</div>
                    <div className="text-sm text-slate-500 font-body">per email account</div>
                  </div>
                  <div className="text-center p-4 border border-green-200 rounded-lg bg-green-50">
                    <h3 className="font-subheading font-semibold text-slate-900 mb-2">Yearly</h3>
                    <div className="text-2xl font-heading font-bold text-green-700">
                      {formatPrice(Math.round(currentPricing.addons.emailAccount * 10 * (1 - currentPricing.discounts.yearly / 100)), currentPricing.currency)}
                    </div>
                    <div className="text-sm text-slate-500 font-body">per email account</div>
                    <div className="text-xs text-green-700 font-semibold mt-1">
                      Save {currentPricing.discounts.yearly}%
                    </div>
                  </div>
                  <div className="text-center p-4 border border-purple-200 rounded-lg bg-purple-50">
                    <h3 className="font-subheading font-semibold text-slate-900 mb-2">2 Year Plan</h3>
                    <div className="text-2xl font-heading font-bold text-purple-800">
                      {formatPrice(Math.round(currentPricing.addons.emailAccount * 18 * (1 - currentPricing.discounts.twoYear / 100)), currentPricing.currency)}
                    </div>
                    <div className="text-sm text-slate-500 font-body">per email account</div>
                    <div className="text-xs text-purple-800 font-semibold mt-1">
                      Save {currentPricing.discounts.twoYear}%
                    </div>
                  </div>
                  <div className="text-center p-4 border border-purple-300 rounded-lg bg-purple-100">
                    <h3 className="font-subheading font-semibold text-slate-900 mb-2">3 Year Plan</h3>
                    <div className="text-2xl font-heading font-bold text-purple-900">
                      {formatPrice(Math.round(currentPricing.addons.emailAccount * 25 * (1 - currentPricing.discounts.threeYear / 100)), currentPricing.currency)}
                    </div>
                    <div className="text-sm text-slate-500 font-body">per email account</div>
                    <div className="text-xs text-purple-900 font-semibold mt-1">
                      Save {currentPricing.discounts.threeYear}%
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Risk Reversal & Final CTA */}
            <section className="bg-gradient-to-r from-purple-800 via-purple-900 to-slate-900 py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ready to Get Started?
                </h2>
                <p className="text-xl text-slate-200 mb-10 max-w-3xl mx-auto font-body">
                  Join 500+ businesses who trust Website14 with their online presence
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <div className="text-center">
                    <div className="font-heading text-3xl font-bold text-white mb-2">30 Days</div>
                    <div className="text-sm text-slate-200 font-body">Money Back Guarantee</div>
                  </div>
                  <div className="text-center">
                    <div className="font-heading text-3xl font-bold text-white mb-2">Free</div>
                    <div className="text-sm text-slate-200 font-body">Consultation</div>
                  </div>
                  <div className="text-center">
                    <div className="font-heading text-3xl font-bold text-white mb-2">Unlimited</div>
                    <div className="text-sm text-slate-200 font-body">Updates Included</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => handlePackageSelection('dynamicSetup')}
                    className="bg-white text-purple-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Get Your Free Quote
                  </button>
                  <Link href="/contact" prefetch={true}>
                    <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-800 transition-all duration-300">
                      Talk to Our Team
                    </button>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
} 