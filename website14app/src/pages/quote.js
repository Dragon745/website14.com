import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Quote() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quoteData, setQuoteData] = useState(null);
    const [pricingData, setPricingData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Get builder results from localStorage
        const builderResults = localStorage.getItem('builderResults');
        if (!builderResults) {
            router.push('/builder');
            return;
        }

        const results = JSON.parse(builderResults);
        setQuoteData(results);

        // Fetch pricing data based on user's currency
        fetchPricingData(results.leadData?.currency || 'USD');
    }, [router]);

    // Save lead data to Firestore when user is logged in
    useEffect(() => {
        const saveLeadToFirestore = async () => {
            if (!user || !quoteData) return;

            const builderResults = localStorage.getItem('builderResults');
            if (!builderResults) return;

            const results = JSON.parse(builderResults);

            // Check if lead was already saved (has userId)
            if (results.leadData?.userId) return;

            try {
                const { db } = await import('../lib/firebase');
                const { collection, addDoc } = await import('firebase/firestore');

                // Update lead data with user ID
                const updatedLeadData = {
                    ...results.leadData,
                    userId: user.uid,
                    updatedAt: new Date()
                };

                await addDoc(collection(db, 'leads'), updatedLeadData);
                console.log('Lead saved to Firestore successfully');

                // Update localStorage with user ID
                const updatedResults = {
                    ...results,
                    leadData: updatedLeadData
                };
                localStorage.setItem('builderResults', JSON.stringify(updatedResults));
                setQuoteData(updatedResults);
            } catch (error) {
                console.error('Error saving lead to Firestore:', error);
            }
        };

        saveLeadToFirestore();
    }, [user, quoteData]);

    const fetchPricingData = async (currency) => {
        try {
            // For now, use hardcoded pricing data
            // In production, this would fetch from Firestore
            const pricing = {
                USD: {
                    static: { setup: 59, monthly: 5 },
                    dynamic: { setup: 120, monthly: 7.2 },
                    ecommerce: { setup: 180, monthly: 11 },
                    addons: {
                        extraPage: 3,
                        extraProduct: 0.2,
                        extraPaymentGateway: 5,
                        emailAccount: 2.4
                    }
                },
                INR: {
                    static: { setup: 4900, monthly: 415 },
                    dynamic: { setup: 10000, monthly: 600 },
                    ecommerce: { setup: 15000, monthly: 915 },
                    addons: {
                        extraPage: 250,
                        extraProduct: 17,
                        extraPaymentGateway: 415,
                        emailAccount: 200
                    }
                }
            };

            setPricingData(pricing[currency] || pricing.USD);
        } catch (error) {
            console.error('Error fetching pricing data:', error);
            // Fallback to USD pricing
            setPricingData({
                static: { setup: 59, monthly: 5 },
                dynamic: { setup: 120, monthly: 7.2 },
                ecommerce: { setup: 180, monthly: 11 },
                addons: {
                    extraPage: 3,
                    extraProduct: 0.2,
                    extraPaymentGateway: 5,
                    emailAccount: 2.4
                }
            });
        }
    };

    const calculateQuote = () => {
        if (!quoteData || !pricingData) return null;

        const { formData, recommendedPackage } = quoteData;
        const packageData = pricingData[recommendedPackage];

        let setupFee = packageData.setup;
        let monthlyFee = packageData.monthly;
        const addons = [];

        // Calculate extra pages
        const totalPages = (formData.pages?.length || 0) + (formData.customPages ? formData.customPages.split('\n').filter(p => p.trim()).length : 0);
        const includedPages = recommendedPackage === 'static' ? 5 : recommendedPackage === 'dynamic' ? 7 : 10;

        if (totalPages > includedPages) {
            const extraPages = totalPages - includedPages;
            const extraPageCost = extraPages * pricingData.addons.extraPage;
            setupFee += extraPageCost;
            addons.push({
                name: `${extraPages} Extra Pages`,
                cost: extraPageCost
            });
        }

        // Calculate extra products for e-commerce
        if (recommendedPackage === 'ecommerce' && formData.productCount) {
            const productCount = parseInt(formData.productCount);
            if (productCount > 30) {
                const extraProducts = productCount - 30;
                const extraProductCost = extraProducts * pricingData.addons.extraProduct;
                setupFee += extraProductCost;
                addons.push({
                    name: `${extraProducts} Extra Products`,
                    cost: extraProductCost
                });
            }
        }

        // Calculate extra payment gateways
        if (formData.paymentMethods && formData.paymentMethods.length > 2) {
            const extraGateways = formData.paymentMethods.length - 2;
            const extraGatewayCost = extraGateways * pricingData.addons.extraPaymentGateway;
            monthlyFee += extraGatewayCost;
            addons.push({
                name: `${extraGateways} Extra Payment Gateways`,
                cost: extraGatewayCost,
                recurring: true
            });
        }

        return {
            package: recommendedPackage,
            setupFee,
            monthlyFee,
            addons,
            totalSetup: setupFee,
            totalMonthly: monthlyFee
        };
    };

    const formatCurrency = (amount, currency = 'USD') => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
        return formatter.format(amount);
    };

    const getPackageName = (packageType) => {
        switch (packageType) {
            case 'static': return 'Static Website Package';
            case 'dynamic': return 'Dynamic Website Package';
            case 'ecommerce': return 'E-commerce Website Package';
            default: return 'Custom Package';
        }
    };

    const getPackageDescription = (packageType) => {
        switch (packageType) {
            case 'static':
                return 'Perfect for simple information sites and small businesses. Includes 5 pages, contact forms, mobile responsive design, and SEO basics.';
            case 'dynamic':
                return 'Ideal for content-heavy sites and blogs. Includes content management system, blog functionality, user accounts, and advanced features.';
            case 'ecommerce':
                return 'Complete online store solution. Includes product catalog, payment gateways, inventory management, and full e-commerce functionality.';
            default:
                return 'Custom solution tailored to your specific needs.';
        }
    };

    if (loading) {
        return (
            <>
                <Head>
                    <title>Your Quote - Website14</title>
                    <meta name="description" content="Your personalized website quote based on your requirements." />
                    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                </Head>

                <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
                    <Header />

                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                            <p className="mt-4 text-gray-600">Generating your quote...</p>
                        </div>
                    </div>

                    <Footer />
                </div>
            </>
        );
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    if (!quoteData || !pricingData) {
        return (
            <>
                <Head>
                    <title>Quote Not Found - Website14</title>
                    <meta name="description" content="Quote not found. Please complete the project builder first." />
                    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                </Head>

                <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
                    <Header />

                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quote Not Found</h2>
                            <p className="text-gray-600 mb-6">Please complete the project builder first to get your personalized quote.</p>
                            <Link
                                href="/builder"
                                className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Start Project Builder
                            </Link>
                        </div>
                    </div>

                    <Footer />
                </div>
            </>
        );
    }

    const quote = calculateQuote();
    const currency = quoteData.leadData?.currency || 'USD';

    return (
        <>
            <Head>
                <title>Your Quote - Website14</title>
                <meta name="description" content="Your personalized website quote based on your requirements." />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </Head>

            <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
                <Header />

                <div className="flex-1 py-8">
                    <div className="w-full max-w-4xl mx-auto px-5">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="font-jetbrains text-4xl font-bold text-black mb-4">
                                Your Personalized Quote
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Based on your requirements, here's what we recommend for your website
                            </p>
                        </div>

                        {/* Quote Card */}
                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Package Details */}
                                <div>
                                    <h2 className="text-2xl font-bold text-black mb-4">
                                        {getPackageName(quote.package)}
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        {getPackageDescription(quote.package)}
                                    </p>

                                    {/* Requirements Summary */}
                                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                        <h3 className="font-semibold text-black mb-3">Your Requirements:</h3>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li>• Business Type: {quoteData.formData.businessType}</li>
                                            <li>• Pages: {quoteData.formData.pages?.length || 0} selected</li>
                                            {quoteData.formData.primaryPurpose?.includes('E-commerce') && (
                                                <li>• Products: {quoteData.formData.productCount} products</li>
                                            )}
                                            <li>• Timeline: {quoteData.formData.timeline}</li>
                                            <li>• Budget: {quoteData.formData.budget}</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div>
                                    <div className="bg-black text-white rounded-lg p-6">
                                        <h3 className="text-xl font-bold mb-4">Pricing Breakdown</h3>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex justify-between">
                                                <span>Setup Fee:</span>
                                                <span>{formatCurrency(quote.setupFee, currency)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Monthly Hosting:</span>
                                                <span>{formatCurrency(quote.monthlyFee, currency)}</span>
                                            </div>

                                            {quote.addons.length > 0 && (
                                                <>
                                                    <div className="border-t border-gray-600 pt-2 mt-2">
                                                        <span className="text-sm text-gray-300">Add-ons:</span>
                                                    </div>
                                                    {quote.addons.map((addon, index) => (
                                                        <div key={index} className="flex justify-between text-sm">
                                                            <span>{addon.name}:</span>
                                                            <span>{formatCurrency(addon.cost, currency)}{addon.recurring ? '/month' : ''}</span>
                                                        </div>
                                                    ))}
                                                </>
                                            )}
                                        </div>

                                        <div className="border-t border-gray-600 pt-4">
                                            <div className="flex justify-between font-bold text-lg">
                                                <span>Total Setup:</span>
                                                <span>{formatCurrency(quote.totalSetup, currency)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-300">
                                                <span>Monthly:</span>
                                                <span>{formatCurrency(quote.totalMonthly, currency)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features Included */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                            <h3 className="text-2xl font-bold text-black mb-6">What's Included</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-black mb-3">Core Features:</h4>
                                    <ul className="space-y-2 text-gray-600">
                                        <li>• Mobile-responsive design</li>
                                        <li>• SEO optimization</li>
                                        <li>• SSL certificate</li>
                                        <li>• Contact forms</li>
                                        <li>• Google Analytics integration</li>
                                        <li>• Unlimited content updates</li>
                                        <li>• 30-day money-back guarantee</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-black mb-3">Package-Specific Features:</h4>
                                    <ul className="space-y-2 text-gray-600">
                                        {quote.package === 'static' && (
                                            <>
                                                <li>• 5 pages included</li>
                                                <li>• Basic contact forms</li>
                                                <li>• Simple content management</li>
                                            </>
                                        )}
                                        {quote.package === 'dynamic' && (
                                            <>
                                                <li>• 7 pages included</li>
                                                <li>• Content management system</li>
                                                <li>• Blog functionality</li>
                                                <li>• User accounts</li>
                                            </>
                                        )}
                                        {quote.package === 'ecommerce' && (
                                            <>
                                                <li>• 10 pages included</li>
                                                <li>• Product catalog</li>
                                                <li>• Payment gateways</li>
                                                <li>• Inventory management</li>
                                                <li>• Order tracking</li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="inline-block bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium text-center"
                            >
                                Get Started Now
                            </Link>
                            <Link
                                href="/builder"
                                className="inline-block border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
                            >
                                Modify Requirements
                            </Link>
                        </div>

                        {/* Guarantee */}
                        <div className="text-center mt-8 p-6 bg-green-50 rounded-lg">
                            <h3 className="font-semibold text-green-800 mb-2">30-Day Money-Back Guarantee</h3>
                            <p className="text-green-700 text-sm">
                                Not satisfied? Get a full refund within 30 days. No questions asked.
                            </p>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
} 