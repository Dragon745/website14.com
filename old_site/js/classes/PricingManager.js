import { db } from '../modules/firebase-config.js';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export class PricingManager {
    constructor() {
        this.userLocation = null;
        this.userCurrency = 'USD';
        this.pricingData = {};
        this.supportedCurrencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'];

        this.init();
    }

    async init() {
        try {
            await this.detectUserLocation();
            await this.loadPricingData();
            this.updatePricingDisplay();
        } catch (error) {
            console.error('Error initializing pricing manager:', error);
            // Fallback to USD pricing
            this.userCurrency = 'USD';
            await this.loadPricingData();
            this.updatePricingDisplay();
        }
    }

    async detectUserLocation() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();

            this.userLocation = {
                country: data.country_code,
                currency: data.currency,
                city: data.city,
                region: data.region,
                countryName: data.country_name
            };

            // Set currency based on location
            if (this.supportedCurrencies.includes(data.currency)) {
                this.userCurrency = data.currency;
            } else {
                this.userCurrency = 'USD'; // Default fallback
            }

        } catch (error) {
            console.error('Error detecting location:', error);
            this.userLocation = { country: 'US', currency: 'USD', countryName: 'United States' };
            this.userCurrency = 'USD';
        }
    }

    async loadPricingData() {
        try {
            // Try to get pricing for user's currency
            const pricingDoc = await getDoc(doc(db, 'pricing', this.userCurrency));

            if (pricingDoc.exists()) {
                this.pricingData = pricingDoc.data();
            } else {
                // Fallback to USD pricing
                const usdPricingDoc = await getDoc(doc(db, 'pricing', 'USD'));
                if (usdPricingDoc.exists()) {
                    this.pricingData = usdPricingDoc.data();
                    this.userCurrency = 'USD';
                } else {
                    // Use default pricing if no data exists
                    this.pricingData = this.getDefaultPricing();
                }
            }
        } catch (error) {
            console.error('Error loading pricing data:', error);
            this.pricingData = this.getDefaultPricing();
        }
    }

    getDefaultPricing() {
        return {
            currency: 'USD',
            services: {
                'static-website': {
                    basic: 59,
                    standard: 59,
                    premium: 59
                },
                'dynamic-website': {
                    basic: 120,
                    standard: 120,
                    premium: 120
                },
                'ecommerce-website': {
                    basic: 180,
                    standard: 180,
                    premium: 180
                }
            },
            monthly: {
                'static-website': 5,
                'dynamic-website': 7.2,
                'ecommerce-website': 11
            },
            addons: {
                'extra-static-page': 3,
                'extra-dynamic-page': 4,
                'extra-ecommerce-page': 5,
                'extra-product': 0.2,
                'extra-payment-gateway': 5
            },
            email: {
                monthly: 2.4,
                yearly: 24,
                '2year': 43,
                '3year': 60
            },
            longTerm: {
                'static-website': {
                    yearly: 40,
                    '2year': 75,
                    '3year': 105
                },
                'dynamic-website': {
                    yearly: 60,
                    '2year': 115,
                    '3year': 160
                },
                'ecommerce-website': {
                    yearly: 90,
                    '2year': 170,
                    '3year': 240
                }
            },
            features: {
                'static-website': {
                    pages: 5,
                    extraPage: 3,
                    products: 0,
                    extraProduct: 0,
                    paymentGateways: 0,
                    extraPaymentGateway: 0
                },
                'dynamic-website': {
                    pages: 7,
                    extraPage: 4,
                    products: 1,
                    extraProduct: 0.2,
                    paymentGateways: 1,
                    extraPaymentGateway: 5
                },
                'ecommerce-website': {
                    pages: 10,
                    extraPage: 5,
                    products: 30,
                    extraProduct: 0.2,
                    paymentGateways: 2,
                    extraPaymentGateway: 5
                }
            },
            lastUpdated: new Date(),
            isActive: true
        };
    }

    updatePricingDisplay() {
        const currencySymbol = this.getCurrencySymbol(this.userCurrency);

        // Update main service pricing
        this.updateServicePricing('static-website', currencySymbol);
        this.updateServicePricing('dynamic-website', currencySymbol);
        this.updateServicePricing('ecommerce-website', currencySymbol);

        // Update add-ons section
        this.updateAddonsDisplay(currencySymbol);

        // Update email hosting section
        this.updateEmailPricing(currencySymbol);

        // Show currency indicator
        this.showCurrencyIndicator();
    }

    updateServicePricing(serviceType, currencySymbol) {
        const serviceElement = this.getServiceElement(serviceType);
        if (!serviceElement) {
            return;
        }

        const pricing = this.pricingData.services?.[serviceType];
        const monthlyPricing = this.pricingData.monthly?.[serviceType];

        if (pricing && monthlyPricing) {
            // Update main price
            const priceElement = serviceElement.querySelector('.text-3xl');
            if (priceElement) {
                priceElement.textContent = `${currencySymbol}${pricing.standard}`;
            }

            // Update monthly price
            const monthlyElement = serviceElement.querySelector('.text-sm.text-gray-500');
            if (monthlyElement) {
                monthlyElement.textContent = `One-time setup + ${currencySymbol}${monthlyPricing}/month`;
            }
        }
    }

    updateAddonsDisplay(currencySymbol) {
        const addons = this.pricingData.addons || {};

        // Update add-ons pricing in the addons section
        const addonsSection = document.getElementById('addons-section');
        if (addonsSection) {
            const addonElements = addonsSection.querySelectorAll('[data-addon]');
            addonElements.forEach(element => {
                const addonType = element.dataset.addon;
                const price = addons[addonType] || 0;
                element.textContent = `${currencySymbol}${price}`;
            });
        }

        // Update add-ons pricing in the Feature Comparison table
        const featureComparisonTable = document.querySelector('table.min-w-full');
        if (featureComparisonTable) {
            const addonElements = featureComparisonTable.querySelectorAll('[data-addon]');
            addonElements.forEach(element => {
                const addonType = element.dataset.addon;
                const price = addons[addonType] || 0;
                const oldText = element.textContent;
                element.textContent = `${currencySymbol}${price}`;
            });
        } else {
            console.warn('Feature comparison table not found');
        }
    }

    updateEmailPricing(currencySymbol) {
        const emailSection = document.getElementById('email-section');
        if (!emailSection) return;

        const emailPricing = this.pricingData.email || {};

        // Update email pricing
        const emailElements = emailSection.querySelectorAll('[data-email-plan]');
        emailElements.forEach(element => {
            const planType = element.dataset.emailPlan;
            const price = emailPricing[planType] || 0;
            element.textContent = `${currencySymbol}${price}`;
        });
    }

    getServiceElement(serviceType) {
        const serviceMap = {
            'static-website': 'Static Website',
            'dynamic-website': 'Dynamic Website',
            'ecommerce-website': 'E-commerce Website'
        };

        const serviceName = serviceMap[serviceType];
        if (!serviceName) return null;

        // Find the service card by looking for the service name in the h3 element
        // Use a more specific selector that matches the actual CSS classes
        const serviceCards = document.querySelectorAll('.bg-white.border-2[class*="border-gray"]');
        for (const card of serviceCards) {
            const h3Element = card.querySelector('h3');
            if (h3Element && h3Element.textContent.includes(serviceName)) {
                return card;
            }
        }

        return null;
    }

    getCurrencySymbol(currency) {
        const symbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'INR': '₹',
            'CAD': 'C$',
            'AUD': 'A$'
        };
        return symbols[currency] || '$';
    }

    showCurrencyIndicator() {
        // Create or update currency indicator
        let indicator = document.getElementById('currency-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'currency-indicator';
            indicator.className = 'fixed top-4 right-4 bg-black text-white px-3 py-2 rounded-lg text-sm font-medium z-50';
            document.body.appendChild(indicator);
        }

        const currencyName = this.getCurrencyName(this.userCurrency);
        indicator.textContent = `Prices in ${currencyName}`;

        // Add location info if available
        if (this.userLocation && this.userLocation.country !== 'US') {
            indicator.title = `Detected location: ${this.userLocation.city}, ${this.userLocation.countryName}`;
        }
    }

    getCurrencyName(currency) {
        const names = {
            'USD': 'USD',
            'EUR': 'EUR',
            'GBP': 'GBP',
            'INR': 'INR',
            'CAD': 'CAD',
            'AUD': 'AUD'
        };
        return names[currency] || 'USD';
    }

    // Admin methods for updating pricing
    async updatePricing(currency, service, tier, price) {
        try {
            const pricingRef = doc(db, 'pricing', currency);
            await updateDoc(pricingRef, {
                [`services.${service}.${tier}`]: price,
                lastUpdated: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating pricing:', error);
            throw error;
        }
    }

    async createPricingDocument(currency, pricingData) {
        try {
            const pricingRef = doc(db, 'pricing', currency);
            await setDoc(pricingRef, {
                currency: currency,
                services: pricingData.services,
                monthly: pricingData.monthly,
                addons: pricingData.addons,
                email: pricingData.email,
                longTerm: pricingData.longTerm,
                features: pricingData.features,
                lastUpdated: serverTimestamp(),
                isActive: true
            });
        } catch (error) {
            console.error('Error creating pricing document:', error);
            throw error;
        }
    }

    async getAllPricing() {
        try {
            const querySnapshot = await getDocs(collection(db, 'pricing'));
            const pricingData = {};
            querySnapshot.forEach((doc) => {
                pricingData[doc.id] = doc.data();
            });
            return pricingData;
        } catch (error) {
            console.error('Error getting all pricing:', error);
            throw error;
        }
    }

    // Get current user location and currency
    getUserLocation() {
        return this.userLocation;
    }

    getUserCurrency() {
        return this.userCurrency;
    }

    // Get current pricing data
    getPricingData() {
        return this.pricingData;
    }

    // Get add-ons pricing
    getAddonsPricing() {
        return this.pricingData.addons || {};
    }

    // Get email pricing
    getEmailPricing() {
        return this.pricingData.email || {};
    }

    // Get long-term pricing
    getLongTermPricing() {
        return this.pricingData.longTerm || {};
    }

    // Get features for a service
    getServiceFeatures(serviceType) {
        return this.pricingData.features?.[serviceType] || {};
    }
} 