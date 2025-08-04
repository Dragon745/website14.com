import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Global state to prevent multiple simultaneous database calls
let globalPricingState = {
    isFetching: false,
    allPricing: null,
    lastFetch: 0
};

const usePricing = (userCurrency) => {
    const [pricingData, setPricingData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Default pricing for immediate display
    const defaultPricing = {
        staticSetup: 59,
        staticMonthly: 5,
        dynamicSetup: 99,
        dynamicMonthly: 15,
        ecommerceSetup: 199,
        ecommerceMonthly: 29,
        domainSetup: 15,
        domainMonthly: 2,
        hostingSetup: 10,
        hostingMonthly: 5,
        sslSetup: 0,
        sslMonthly: 0,
        emailSetup: 5,
        emailMonthly: 1,
        seoSetup: 50,
        seoMonthly: 10,
        maintenanceSetup: 30,
        maintenanceMonthly: 15,
        annualDiscount: 10,
        twoYearDiscount: 15,
        threeYearDiscount: 20,
        currency: 'USD'
    };

    const cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours

    const loadPricingData = async (currencyToUse) => {

        try {
            // Check localStorage for cached pricing data
            const cachedPricing = localStorage.getItem('website14_pricing_data');
            const cachedTimestamp = localStorage.getItem('website14_pricing_timestamp');
            const now = Date.now();

            if (cachedPricing && cachedTimestamp) {
                const cacheAge = now - parseInt(cachedTimestamp);
                if (cacheAge < cacheExpiry) {
                    const parsedPricing = JSON.parse(cachedPricing);

                    // Find pricing for the specific currency
                    const currencyPricing = parsedPricing[currencyToUse];
                    if (currencyPricing) {
                        setPricingData(currencyPricing);
                        return;
                    } else {
                        const usdPricing = parsedPricing['USD'];
                        if (usdPricing) {
                            setPricingData(usdPricing);
                            return;
                        }
                    }
                }
            }

            // If we reach here, we need to fetch fresh data

            // Check if another instance is already fetching
            if (globalPricingState.isFetching) {
                return;
            }

            globalPricingState.isFetching = true;
            setIsLoading(true);

            const pricingCollection = collection(db, 'pricing');
            const pricingSnapshot = await getDocs(pricingCollection);

            const allPricing = {};
            pricingSnapshot.forEach((doc) => {
                const data = doc.data();
                allPricing[data.currency] = data;
            });

            // Cache the data
            localStorage.setItem('website14_pricing_data', JSON.stringify(allPricing));
            localStorage.setItem('website14_pricing_timestamp', now.toString());

            // Update global state
            globalPricingState.allPricing = allPricing;
            globalPricingState.lastFetch = now;
            globalPricingState.isFetching = false;

            // Set pricing for the requested currency
            const currencyPricing = allPricing[currencyToUse];
            if (currencyPricing) {
                setPricingData(currencyPricing);
            } else {
                const usdPricing = allPricing['USD'] || defaultPricing;
                setPricingData(usdPricing);
            }

            setIsLoading(false);

        } catch (error) {
            globalPricingState.isFetching = false;
            setError(error);

            // Try to use expired cache as fallback
            try {
                const cachedPricing = localStorage.getItem('website14_pricing_data');
                if (cachedPricing) {
                    const parsedPricing = JSON.parse(cachedPricing);
                    const currencyPricing = parsedPricing[currencyToUse] || parsedPricing['USD'];
                    if (currencyPricing) {
                        setPricingData(currencyPricing);
                        return;
                    }
                }
            } catch (parseError) {
                // Silent fallback
            }

            // Final fallback to default pricing
            setPricingData(defaultPricing);
        }
    };

    // Set default pricing immediately on mount
    useEffect(() => {
        if (!pricingData) {
            setPricingData(defaultPricing);
        }
    }, [pricingData]);

    // Main useEffect - only fetch if we have a valid currency (not USD fallback)
    useEffect(() => {
        // Only fetch if we have a real currency (not USD fallback from useLocation)
        if (userCurrency && userCurrency !== 'USD') {
            loadPricingData(userCurrency);
        }
    }, [userCurrency]);

    // Currency change useEffect - handle currency changes from cache
    useEffect(() => {
        if (!userCurrency) {
            return;
        }

        // Check if we have cached data and update pricing for the new currency
        const cachedPricing = localStorage.getItem('website14_pricing_data');
        const cachedTimestamp = localStorage.getItem('website14_pricing_timestamp');
        const now = Date.now();

        if (cachedPricing && cachedTimestamp) {
            const cacheAge = now - parseInt(cachedTimestamp);
            if (cacheAge < cacheExpiry) {
                try {
                    const parsedPricing = JSON.parse(cachedPricing);
                    const currencyPricing = parsedPricing[userCurrency];
                    if (currencyPricing) {
                        setPricingData(currencyPricing);
                        return;
                    }
                } catch (error) {
                    // Silent fallback
                }
            }
        }
    }, [userCurrency]);

    // Global reset function for debugging
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.resetPricingCache = () => {
                localStorage.removeItem('website14_pricing_data');
                localStorage.removeItem('website14_pricing_timestamp');
                globalPricingState = {
                    isFetching: false,
                    allPricing: null,
                    lastFetch: 0
                };
                setPricingData(defaultPricing);
                setError(null);
            };
        }
    }, []);

    return {
        pricingData,
        isLoading,
        error,
        resetPricingCache: typeof window !== 'undefined' ? window.resetPricingCache : null
    };
};

export { usePricing }; 