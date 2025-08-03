import { useState, useEffect } from 'react';

const useLocation = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log(`[${new Date().toISOString()}] 🚀 useLocation: Hook initialized`);

    const cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
    const apiTimeout = 5000; // 5 seconds

    const setFallbackLocation = () => {
        const fallbackLocation = {
            country: 'United States',
            city: 'Unknown',
            currency: 'USD',
            ip: 'unknown'
        };
        setUserLocation(fallbackLocation);
        localStorage.setItem('website14_user_location', JSON.stringify(fallbackLocation));
        localStorage.setItem('website14_location_timestamp', Date.now().toString());
    };

    const loadLocation = async () => {
        console.log(`[${new Date().toISOString()}] 📍 useLocation: loadLocation started`);

        try {
            // Check localStorage for cached location
            const cachedLocation = localStorage.getItem('website14_user_location');
            const cachedTimestamp = localStorage.getItem('website14_location_timestamp');
            const now = Date.now();

            if (cachedLocation && cachedTimestamp) {
                const cacheAge = now - parseInt(cachedTimestamp);
                if (cacheAge < cacheExpiry) {
                    console.log(`[${new Date().toISOString()}] ✅ useLocation: Using cached location`);
                    const parsedLocation = JSON.parse(cachedLocation);
                    setUserLocation(parsedLocation);
                    return;
                }
            }

            // Check if API is disabled due to previous failures
            const apiDisabled = localStorage.getItem('website14_api_disabled');
            const disabledTimestamp = localStorage.getItem('website14_api_disabled_timestamp');
            const disableExpiry = 60 * 60 * 1000; // 1 hour

            console.log(`[${new Date().toISOString()}] 📍 useLocation: API status:`, {
                apiDisabled: !!apiDisabled,
                disabledTimestamp,
                disableExpiry
            });

            if (apiDisabled && disabledTimestamp) {
                const disableAge = now - parseInt(disabledTimestamp);
                if (disableAge < disableExpiry) {
                    console.log(`[${new Date().toISOString()}] ⚠️ useLocation: API disabled, using fallback`);
                    setFallbackLocation();
                    return;
                } else {
                    // Reset API disabled status
                    localStorage.removeItem('website14_api_disabled');
                    localStorage.removeItem('website14_api_disabled_timestamp');
                }
            }

            // Try to fetch location from API
            console.log(`[${new Date().toISOString()}] 🌐 useLocation: Starting API fetch`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), apiTimeout);

            try {
                const response = await fetch('https://ipapi.co/json/', {
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const locationData = await response.json();
                console.log(`[${new Date().toISOString()}] 📍 useLocation: API response:`, locationData);

                // Validate the response
                if (!locationData || !locationData.country || !locationData.currency) {
                    throw new Error('Invalid location data received');
                }

                const location = {
                    country: locationData.country_name || locationData.country,
                    city: locationData.city || 'Unknown',
                    currency: locationData.currency,
                    ip: locationData.ip
                };

                console.log(`[${new Date().toISOString()}] ✅ useLocation: Location set:`, location);
                setUserLocation(location);
                localStorage.setItem('website14_user_location', JSON.stringify(location));
                localStorage.setItem('website14_location_timestamp', now.toString());

                // Reset failure count on successful API call
                localStorage.removeItem('website14_api_failures');

            } catch (fetchError) {
                clearTimeout(timeoutId);

                if (fetchError.name === 'AbortError') {
                    console.log(`[${new Date().toISOString()}] ⏰ useLocation: API timeout reached`);
                } else {
                    console.log(`[${new Date().toISOString()}] ❌ useLocation: API error:`, fetchError.message);
                }

                // Track API failures
                const failureCount = parseInt(localStorage.getItem('website14_api_failures') || '0') + 1;
                console.log(`[${new Date().toISOString()}] 📍 useLocation: Failure count:`, failureCount);
                localStorage.setItem('website14_api_failures', failureCount.toString());

                if (failureCount >= 3) {
                    console.log(`[${new Date().toISOString()}] ⚠️ useLocation: Disabling API due to failures`);
                    localStorage.setItem('website14_api_disabled', 'true');
                    localStorage.setItem('website14_api_disabled_timestamp', now.toString());
                }

                // Try to use expired cache as fallback
                if (cachedLocation) {
                    try {
                        console.log(`[${new Date().toISOString()}] 🔄 useLocation: Using expired cache as fallback:`, cachedLocation);
                        const parsedLocation = JSON.parse(cachedLocation);
                        setUserLocation(parsedLocation);
                        return;
                    } catch (parseError) {
                        console.log(`[${new Date().toISOString()}] ❌ useLocation: Error parsing expired cache:`, parseError.message);
                    }
                }

                // Final fallback
                console.log(`[${new Date().toISOString()}] 🔄 useLocation: No cache available, using fallback`);
                setFallbackLocation();
            }

        } catch (error) {
            console.log(`[${new Date().toISOString()}] ❌ useLocation: Unexpected error:`, error.message);
            setError(error);
            setFallbackLocation();
        }

        console.log(`[${new Date().toISOString()}] 🏁 useLocation: loadLocation finished`);
    };

    const loadLocationAfterPaint = () => {
        console.log(`[${new Date().toISOString()}] 📍 useLocation: loadLocationAfterPaint called`);

        if (typeof window !== 'undefined' && window.requestIdleCallback) {
            console.log(`[${new Date().toISOString()}] 📍 useLocation: Using requestIdleCallback`);
            window.requestIdleCallback(() => loadLocation(), { timeout: 1000 });
        } else {
            console.log(`[${new Date().toISOString()}] 📍 useLocation: Using setTimeout fallback`);
            setTimeout(loadLocation, 100);
        }
    };

    useEffect(() => {
        console.log(`[${new Date().toISOString()}] 📍 useLocation: useEffect started`);
        loadLocationAfterPaint();
    }, []);

    // Global reset function for debugging
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.resetLocationCache = () => {
                console.log(`[${new Date().toISOString()}] 🔄 Location cache reset`);
                localStorage.removeItem('website14_user_location');
                localStorage.removeItem('website14_location_timestamp');
                localStorage.removeItem('website14_api_failures');
                localStorage.removeItem('website14_api_disabled');
                localStorage.removeItem('website14_api_disabled_timestamp');
                setUserLocation(null);
                setError(null);
                loadLocationAfterPaint();
            };
        }
    }, []);

    return {
        location: userLocation,
        isLoading,
        error
    };
};

export { useLocation }; 