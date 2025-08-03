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
        console.log(`[${new Date().toISOString()}] 💰 usePricing: loadPricingData started with currencyToUse:`, currencyToUse);

        try {
            // Check localStorage for cached pricing data
            const cachedPricing = localStorage.getItem('website14_pricing_data');
            const cachedTimestamp = localStorage.getItem('website14_pricing_timestamp');
            const now = Date.now();

            if (cachedPricing && cachedTimestamp) {
                const cacheAge = now - parseInt(cachedTimestamp);
                if (cacheAge < cacheExpiry) {
                    console.log(`[${new Date().toISOString()}] ✅ usePricing: Using cached pricing data`);
                    const parsedPricing = JSON.parse(cachedPricing);

                    // Find pricing for the specific currency
                    const currencyPricing = parsedPricing[currencyToUse];
                    if (currencyPricing) {
                        console.log(`[${new Date().toISOString()}] ✅ usePricing: Found pricing for ${currencyToUse}`);
                        setPricingData(currencyPricing);
                        return;
                    } else {
                        console.log(`[${new Date().toISOString()}] ⚠️ usePricing: No pricing for ${currencyToUse}, falling back to USD`);
                        const usdPricing = parsedPricing['USD'];
                        if (usdPricing) {
                            setPricingData(usdPricing);
                            return;
                        }
                    }
                }
            }

            // If we reach here, we need to fetch fresh data
            console.log(`[${new Date().toISOString()}] 🔄 usePricing: No valid cache, using default pricing`);

            // Check if another instance is already fetching
            if (globalPricingState.isFetching) {
                console.log(`[${new Date().toISOString()}] ⏳ usePricing: Another instance is already fetching, waiting`);
                return;
            }

            console.log(`[${new Date().toISOString()}] 🔄 usePricing: Starting fresh data fetch`);
            globalPricingState.isFetching = true;
            console.log(`[${new Date().toISOString()}] 🔄 usePricing: Setting loading state`);
            setIsLoading(true);

            console.log(`[${new Date().toISOString()}] 🌐 usePricing: Connecting to Firestore`);
            const pricingCollection = collection(db, 'pricing');
            const pricingSnapshot = await getDocs(pricingCollection);
            console.log(`[${new Date().toISOString()}] ✅ usePricing: Firestore fetch completed`);

            const allPricing = {};
            pricingSnapshot.forEach((doc) => {
                const data = doc.data();
                allPricing[data.currency] = data;
            });

            console.log(`[${new Date().toISOString()}] 📦 usePricing: Fetched currencies:`, Object.keys(allPricing));

            // Cache the data
            localStorage.setItem('website14_pricing_data', JSON.stringify(allPricing));
            localStorage.setItem('website14_pricing_timestamp', now.toString());
            console.log(`[${new Date().toISOString()}] 💾 usePricing: Data cached to localStorage`);

            // Update global state
            globalPricingState.allPricing = allPricing;
            globalPricingState.lastFetch = now;
            globalPricingState.isFetching = false;

            // Set pricing for the requested currency
            const currencyPricing = allPricing[currencyToUse];
            if (currencyPricing) {
                console.log(`[${new Date().toISOString()}] ✅ usePricing: Updated pricing for ${currencyToUse}`);
                setPricingData(currencyPricing);
            } else {
                console.log(`[${new Date().toISOString()}] ⚠️ usePricing: No pricing for ${currencyToUse}, using USD`);
                const usdPricing = allPricing['USD'] || defaultPricing;
                setPricingData(usdPricing);
            }

            console.log(`[${new Date().toISOString()}] 🏁 usePricing: Finishing fetch process`);
            setIsLoading(false);

        } catch (error) {
            console.log(`[${new Date().toISOString()}] ❌ usePricing: Error loading fresh pricing data:`, error.message);
            globalPricingState.isFetching = false;
            setError(error);

            // Try to use expired cache as fallback
            try {
                console.log(`[${new Date().toISOString()}] 🔄 usePricing: Trying expired cache as fallback`);
                const cachedPricing = localStorage.getItem('website14_pricing_data');
                if (cachedPricing) {
                    const parsedPricing = JSON.parse(cachedPricing);
                    const currencyPricing = parsedPricing[currencyToUse] || parsedPricing['USD'];
                    if (currencyPricing) {
                        console.log(`[${new Date().toISOString()}] ✅ usePricing: Using expired cached pricing as fallback`);
                        setPricingData(currencyPricing);
                        return;
                    }
                }
            } catch (parseError) {
                console.log(`[${new Date().toISOString()}] ❌ usePricing: Error parsing expired cached pricing:`, parseError.message);
            }

            // Final fallback to default pricing
            setPricingData(defaultPricing);
        }
    };

    // Set default pricing immediately on mount
    useEffect(() => {
        if (!pricingData) {
            console.log(`[${new Date().toISOString()}] 💰 usePricing: Setting default pricing immediately`);
            setPricingData(defaultPricing);
        }
    }, [pricingData]);

    // Main useEffect - only fetch if we have a valid currency (not USD fallback)
    useEffect(() => {
        console.log(`[${new Date().toISOString()}] 💰 usePricing: Main useEffect started with userCurrency:`, userCurrency);

        // Only fetch if we have a real currency (not USD fallback from useLocation)
        if (userCurrency && userCurrency !== 'USD') {
            loadPricingData(userCurrency);
        }
    }, [userCurrency]);

    // Currency change useEffect - handle currency changes from cache
    useEffect(() => {
        console.log(`[${new Date().toISOString()}] 💰 usePricing: Currency change useEffect triggered with userCurrency:`, userCurrency);

        if (!userCurrency) {
            console.log(`[${new Date().toISOString()}] 💰 usePricing: No currency yet, skipping`);
            return;
        }

        // Check if we have cached data and update pricing for the new currency
        const cachedPricing = localStorage.getItem('website14_pricing_data');
        const cachedTimestamp = localStorage.getItem('website14_pricing_timestamp');
        const now = Date.now();

        console.log(`[${new Date().toISOString()}] 💰 usePricing: Currency change cache check:`, {
            hasCachedPricing: !!cachedPricing,
            hasCachedTimestamp: !!cachedTimestamp,
            isExpired: cachedTimestamp ? (now - parseInt(cachedTimestamp)) >= cacheExpiry : true
        });

        if (cachedPricing && cachedTimestamp) {
            const cacheAge = now - parseInt(cachedTimestamp);
            if (cacheAge < cacheExpiry) {
                try {
                    const parsedPricing = JSON.parse(cachedPricing);
                    const currencyPricing = parsedPricing[userCurrency];
                    if (currencyPricing) {
                        console.log(`[${new Date().toISOString()}] 🔄 usePricing: Currency changed to ${userCurrency}, updating from cache`);
                        setPricingData(currencyPricing);
                        return;
                    }
                } catch (error) {
                    console.log(`[${new Date().toISOString()}] ❌ usePricing: Error parsing cached pricing for currency change:`, error.message);
                }
            }
        }

        console.log(`[${new Date().toISOString()}] 💰 usePricing: No valid cache for currency change`);
    }, [userCurrency]);

    // Global reset function for debugging
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.resetPricingCache = () => {
                console.log(`[${new Date().toISOString()}] 🔄 Pricing cache reset`);
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