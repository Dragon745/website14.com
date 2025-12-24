import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { useLocation } from './useLocation';
import { usePricing } from './usePricing';
import { defaultPricing } from '../data/servicesData';
import { currencySymbols } from '../constants/currencySymbols';

export function useServicesLogic() {
  const router = useRouter();

  // State for manual currency selection
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  // Use the location hook
  const { location: userLocation, isLoading: locationLoading, error: locationError } = useLocation();

  // Use the pricing hook with selected currency or detected currency
  const effectiveCurrency = selectedCurrency || userLocation?.currency;
  const { pricingData, isLoading: pricingLoading, error: pricingError } = usePricing(effectiveCurrency);

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

  // Debug logging for pricing
  useEffect(() => {
    console.log('Services page - Pricing state:', {
      pricingData,
      pricingLoading,
      pricingError: pricingError?.message,
      userLocation
    });
  }, [pricingData, pricingLoading, pricingError, userLocation]);

  // Debug logging
  useEffect(() => {
    if (pricingData) {
      console.log('Pricing data updated:', pricingData);
      console.log('Current pricing calculated:', currentPricing);
    }
  }, [pricingData, currentPricing]);

  return {
    // State
    selectedCurrency,
    setSelectedCurrency,
    isLoading,
    currentPricing,

    // Functions
    handlePackageSelection,
    formatPrice,

    // Data for components
    effectiveCurrency,
    userLocation,
    pricingData,
    pricingError
  };
}
