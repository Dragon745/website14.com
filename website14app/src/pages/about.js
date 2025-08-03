import Head from 'next/head';
import Link from 'next/link';
import { useLocation } from '../hooks/useLocation';
import { usePricing } from '../hooks/usePricing';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  // Pre-load location and pricing data
  const { location: userLocation } = useLocation();
  const { pricingData } = usePricing(userLocation?.currency);
  return (
    <>
      <Head>
        <title>About Us - Website14</title>
        <meta name="description" content="Learn about Website14 - a web development company focused on creating professional, mobile-first websites with unlimited updates and ongoing support." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
        <Header />

        {/* Main Content */}
        <div className="flex-1">
          {/* Hero Section */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-5 py-16">
              <div className="text-center">
                <h1 className="font-jetbrains text-4xl md:text-6xl font-bold text-black mb-6">
                  About Website14
                </h1>
                <p className="font-inter text-xl text-gray-600 max-w-3xl mx-auto">
                  We're not just another web design company — we're your tech partners, committed to building websites that actually work for your business.
                </p>
              </div>
            </div>
          </div>

          {/* Our Story Section */}
          <div className="max-w-6xl mx-auto px-5 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-jetbrains text-3xl font-bold text-black mb-6">Our Story</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Website14 was born from a simple frustration: why should businesses struggle with expensive, complicated web development when they could get professional results at affordable prices?
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  We started with one mission: to make professional web development accessible to every business, regardless of size or budget. No more $10,000+ websites that take months to build. No more agencies that disappear after launch.
                </p>
                <p className="text-lg text-gray-700">
                  Today, we've helped 500+ businesses get online with websites that actually convert visitors into customers. Our approach is simple: build fast, mobile-first websites with unlimited updates and ongoing support.
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg p-8">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-black mb-2">500+</div>
                    <div className="text-sm text-gray-600">Happy Clients</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-black mb-2">98%</div>
                    <div className="text-sm text-gray-600">Satisfaction Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-black mb-2">24/7</div>
                    <div className="text-sm text-gray-600">Support Available</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-black mb-2">30 Days</div>
                    <div className="text-sm text-gray-600">Money Back Guarantee</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Values Section */}
          <div className="bg-white py-16">
            <div className="max-w-6xl mx-auto px-5">
              <div className="text-center mb-12">
                <h2 className="font-jetbrains text-3xl font-bold text-black mb-4">Our Values</h2>
                <p className="text-lg text-gray-600">The principles that guide everything we do</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-3">Speed & Efficiency</h3>
                  <p className="text-gray-600">
                    We believe in getting results fast. Your website should be live and working for your business within days, not months.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-3">Quality & Reliability</h3>
                  <p className="text-gray-600">
                    Every website we build is mobile-first, SEO-optimized, and designed to convert visitors into customers.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-3">Ongoing Partnership</h3>
                  <p className="text-gray-600">
                    We don't just build your website and disappear. We're here for unlimited updates and ongoing support.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Process Section */}
          <div className="max-w-6xl mx-auto px-5 py-16">
            <div className="text-center mb-12">
              <h2 className="font-jetbrains text-3xl font-bold text-black mb-4">How We Work</h2>
              <p className="text-lg text-gray-600">Simple, transparent, and effective</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">1</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Free Consultation</h3>
                <p className="text-gray-600 text-sm">
                  We discuss your needs, goals, and budget to create the perfect solution for your business.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">2</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Quick Setup</h3>
                <p className="text-gray-600 text-sm">
                  We build your website fast, typically within 1-2 weeks, with regular updates on progress.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">3</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Launch & Optimize</h3>
                <p className="text-gray-600 text-sm">
                  Your website goes live with SEO optimization, mobile responsiveness, and conversion optimization.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">4</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Ongoing Support</h3>
                <p className="text-gray-600 text-sm">
                  Unlimited updates, maintenance, and support to keep your website growing with your business.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-white py-16">
            <div className="max-w-6xl mx-auto px-5">
              <div className="text-center mb-12">
                <h2 className="font-jetbrains text-3xl font-bold text-black mb-4">Meet Our Team</h2>
                <p className="text-lg text-gray-600">The people behind Website14</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">Syed Qutubuddin</h3>
                  <p className="text-gray-600 text-sm mb-3">Founder & Lead Developer</p>
                  <p className="text-gray-600 text-sm">
                    Passionate about making web development accessible to every business. Specializes in modern, fast, and conversion-focused websites.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">Development Team</h3>
                  <p className="text-gray-600 text-sm mb-3">Full-Stack Developers</p>
                  <p className="text-gray-600 text-sm">
                    Our skilled team of developers who turn your vision into reality with clean, efficient, and scalable code.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">Support Team</h3>
                  <p className="text-gray-600 text-sm mb-3">Customer Success</p>
                  <p className="text-gray-600 text-sm">
                    Dedicated support team available 24/7 to help with updates, maintenance, and any questions you might have.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
            <div className="max-w-6xl mx-auto px-5 text-center">
              <h2 className="font-jetbrains text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join 500+ businesses who trust Website14 with their online presence
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <button className="bg-white text-blue-600 py-4 px-8 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 text-lg">
                    Get Your Free Quote
                  </button>
                </Link>
                <Link href="/services">
                  <button className="border-2 border-white text-white py-4 px-8 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-all duration-300 text-lg">
                    View Our Services
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
} 