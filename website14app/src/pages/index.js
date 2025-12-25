import Link from 'next/link';
import { useLocation } from '../hooks/useLocation';
import { usePricing } from '../hooks/usePricing';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { organizationSchema } from '../data/seoData';

export default function Home() {
  // Use the location hook for future use
  const { location: userLocation, isLoading: locationLoading } = useLocation();

  // Use the pricing hook to pre-load pricing data
  const { pricingData, isLoading: pricingLoading } = usePricing(userLocation?.currency);

  // Structured data for homepage - Multiple schemas for comprehensive SEO
  const structuredData = [
    // Organization Schema
    // Organization Schema
    organizationSchema,
    // WebSite Schema with SearchAction
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Website14",
      "url": "https://website14.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://website14.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    // Service Schema - Static Websites
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Static Website Development",
      "provider": {
        "@type": "Organization",
        "name": "Website14"
      },
      "description": "Professional static websites perfect for portfolios, landing pages, and simple business sites. Fast, secure, and optimized for performance with 5 pages included, mobile-first design, and SEO optimization.",
      "areaServed": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Static Website Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "5 Pages Included"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Mobile-First Design"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "SEO Optimization"
            }
          }
        ]
      }
    },
    // Service Schema - Dynamic Websites
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Dynamic Website Development",
      "provider": {
        "@type": "Organization",
        "name": "Website14"
      },
      "description": "Ideal for blogs, service businesses, and content-heavy sites with CMS capabilities and payment integration. Includes 7 pages + CMS, payment gateway, and admin dashboard.",
      "areaServed": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Dynamic Website Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "7 Pages + CMS"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Payment Gateway Integration"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Admin Dashboard"
            }
          }
        ]
      }
    },
    // Service Schema - E-commerce Solutions
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "E-commerce Development",
      "provider": {
        "@type": "Organization",
        "name": "Website14"
      },
      "description": "Complete online stores with inventory management, payment processing, and order tracking capabilities. Includes 30 products, multiple payment gateways, and inventory management.",
      "areaServed": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "E-commerce Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "30 Products Included"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Multiple Payment Gateways"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Inventory Management"
            }
          }
        ]
      }
    }
  ];

  return (
    <>
      <SEO
        title="Website14 - Professional Web Development Services"
        description="Get a professional, mobile-first website with unlimited updates for less than DIY platforms. Trusted by 500+ businesses worldwide."
        keywords="web development, website design, professional websites, custom websites, web development services, mobile-first design, website maintenance"
        url="https://website14.com"
        type="website"
        structuredData={structuredData}
      />

      <div className="bg-white text-slate-900 font-sans min-h-screen flex flex-col">
        <Header />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-50 via-white to-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center bg-slate-50 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-slate-200">
                  <span className="w-2 h-2 bg-purple-800 rounded-full mr-2 animate-pulse"></span>
                  Trusted by 500+ Businesses Worldwide
                </div>
                <h1 className="font-heading text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                  Professional Web Development
                  <span className="text-purple-800 block">Solutions for Your Business</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed font-body">
                  Transform your online presence with custom-built, mobile-first websites.
                  Get unlimited updates, 24/7 support, and enterprise-grade solutions at affordable prices.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link href="/services" prefetch={true}>
                    <button className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-900 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Explore Our Services
                    </button>
                  </Link>
                  <Link href="/contact" prefetch={true}>
                    <button className="bg-white text-slate-900 border-2 border-slate-300 px-8 py-4 rounded-lg font-semibold text-lg hover:border-purple-800 hover:text-purple-800 transition-all duration-300">
                      Schedule Consultation
                    </button>
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">30-Day Money-Back Guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Unlimited Updates Included</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 lg:p-12 shadow-2xl">
                  <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded mt-4"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-md text-center">
                      <div className="font-heading text-2xl font-bold text-purple-800">500+</div>
                      <div className="text-xs text-slate-600 mt-1">Clients</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-md text-center">
                      <div className="font-heading text-2xl font-bold text-purple-800">98%</div>
                      <div className="text-xs text-slate-600 mt-1">Satisfaction</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-md text-center">
                      <div className="font-heading text-2xl font-bold text-purple-800">24/7</div>
                      <div className="text-xs text-slate-600 mt-1">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="bg-white border-b border-slate-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="font-heading text-3xl font-bold text-slate-900 mb-2">500+</div>
                <div className="text-sm text-slate-600 font-medium">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="font-heading text-3xl font-bold text-slate-900 mb-2">98%</div>
                <div className="text-sm text-slate-600 font-medium">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="font-heading text-3xl font-bold text-slate-900 mb-2">24/7</div>
                <div className="text-sm text-slate-600 font-medium">Support Available</div>
              </div>
              <div className="text-center">
                <div className="font-heading text-3xl font-bold text-slate-900 mb-2">30 Days</div>
                <div className="text-sm text-gray-600 font-medium">Money Back Guarantee</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="bg-slate-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">Comprehensive Web Development Services</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto font-body">
                From simple websites to complex e-commerce platforms, we deliver solutions that drive results
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 hover:border-purple-200">
                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-subheading text-2xl font-semibold text-slate-900 mb-4">Static Websites</h3>
                <p className="text-slate-600 mb-6 leading-relaxed font-body">
                  Perfect for portfolios, landing pages, and simple business sites. Fast, secure, and optimized for performance.
                </p>
                <ul className="space-y-2 mb-6">
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
                    SEO Optimized
                  </li>
                </ul>
                <Link href="/services" prefetch={true}>
                  <button className="w-full bg-gradient-to-r from-purple-800 to-purple-900 text-white py-3 rounded-lg font-semibold hover:from-purple-900 hover:to-slate-900 transition-colors">
                    Learn More
                  </button>
                </Link>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-purple-800/30 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                </div>
                <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="font-subheading text-2xl font-semibold text-slate-900 mb-4">Dynamic Websites</h3>
                <p className="text-slate-600 mb-6 leading-relaxed font-body">
                  Ideal for blogs, service businesses, and content-heavy sites with CMS capabilities and payment integration.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-slate-700">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    7 Pages + CMS
                  </li>
                  <li className="flex items-center text-sm text-slate-700">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Payment Gateway
                  </li>
                  <li className="flex items-center text-sm text-slate-700">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Admin Dashboard
                  </li>
                </ul>
                <Link href="/services" prefetch={true}>
                  <button className="w-full bg-gradient-to-r from-purple-800 to-purple-900 text-white py-3 rounded-lg font-semibold hover:from-purple-900 hover:to-slate-900 transition-colors">
                    Learn More
                  </button>
                </Link>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 hover:border-slate-300">
                <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="font-subheading text-2xl font-semibold text-slate-900 mb-4">E-commerce Solutions</h3>
                <p className="text-slate-600 mb-6 leading-relaxed font-body">
                  Complete online stores with inventory management, payment processing, and order tracking capabilities.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-slate-700">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    30 Products Included
                  </li>
                  <li className="flex items-center text-sm text-slate-700">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Multiple Payment Gateways
                  </li>
                  <li className="flex items-center text-sm text-slate-700">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Inventory Management
                  </li>
                </ul>
                <Link href="/services" prefetch={true}>
                  <button className="w-full bg-gradient-to-r from-purple-800 to-purple-900 text-white py-3 rounded-lg font-semibold hover:from-purple-900 hover:to-slate-900 transition-colors">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">Why Choose Website14?</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto font-body">
                Enterprise-grade solutions with the flexibility and support your business needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-subheading text-xl font-semibold text-slate-900 mb-3">Lightning Fast</h3>
                <p className="text-slate-600 font-body">
                  Optimized for speed and performance with industry-leading Core Web Vitals scores
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-subheading text-xl font-semibold text-slate-900 mb-3">Secure & Reliable</h3>
                <p className="text-slate-600 font-body">
                  SSL certificates, daily backups, and proactive security monitoring included
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-subheading text-xl font-semibold text-slate-900 mb-3">Mobile-First</h3>
                <p className="text-slate-600 font-body">
                  Responsive designs that look perfect on all devices, from mobile to desktop
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-subheading text-xl font-semibold text-slate-900 mb-3">24/7 Support</h3>
                <p className="text-slate-600 font-body">
                  Round-the-clock assistance from our dedicated support team
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-800 via-purple-900 to-slate-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Online Presence?
            </h2>
            <p className="text-xl text-slate-200 mb-10 max-w-3xl mx-auto font-body">
              Join 500+ businesses who trust Website14 for their web development needs.
              Get started with a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services" prefetch={true}>
                <button className="bg-white text-purple-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                  View Our Services
                </button>
              </Link>
              <Link href="/contact" prefetch={true}>
                <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-800 transition-all duration-300">
                  Schedule Consultation
                </button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
