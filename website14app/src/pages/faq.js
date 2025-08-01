import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function FAQ() {
  return (
    <>
      <Head>
        <title>FAQ - Website14</title>
        <meta name="description" content="Frequently asked questions about Website14 web development services, pricing, and support." />
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
                  Frequently Asked Questions
                </h1>
                <p className="font-inter text-xl text-gray-600 max-w-3xl mx-auto">
                  Everything you need to know about our web development services, pricing, and support.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto px-5 py-16">
            <div className="space-y-8">
              {/* General Questions */}
              <div>
                <h2 className="font-jetbrains text-2xl font-bold text-black mb-6">General Questions</h2>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">What makes Website14 different from other web development companies?</h3>
                    <p className="text-gray-700">
                      We focus on speed, affordability, and ongoing support. Unlike traditional agencies that charge $10,000+ and take months, we deliver professional websites in 1-2 weeks starting at $59 setup + $5/month. Plus, we offer unlimited updates and 24/7 support.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">How long does it take to build a website?</h3>
                    <p className="text-gray-700">
                      Most websites are completed within 1-2 weeks from the initial consultation. Static websites can be ready in as little as 3-5 days, while dynamic and e-commerce sites typically take 1-2 weeks depending on complexity.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">Do you offer a money-back guarantee?</h3>
                    <p className="text-gray-700">
                      Yes! We offer a 30-day money-back guarantee. If you're not completely satisfied with your website within 30 days of launch, we'll refund your setup fee and help you find a better solution.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Questions */}
              <div>
                <h2 className="font-jetbrains text-2xl font-bold text-black mb-6">Pricing & Payment</h2>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">What's included in your pricing?</h3>
                    <p className="text-gray-700">
                      Our pricing includes: custom design, mobile-first development, SEO optimization, SSL certificate, hosting setup, unlimited updates, 24/7 support, and ongoing maintenance. No hidden fees or surprises.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">Can I pay monthly instead of yearly?</h3>
                    <p className="text-gray-700">
                      Yes! We offer flexible monthly payments. You can choose to pay monthly, yearly, or even 2-3 year plans for better discounts. All plans include the same features and support.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">Do you offer discounts for multiple services?</h3>
                    <p className="text-gray-700">
                      Absolutely! We offer package discounts when you combine multiple services like website + email hosting + logo design. Contact us for custom quotes on bundled services.
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Questions */}
              <div>
                <h2 className="font-jetbrains text-2xl font-bold text-black mb-6">Technical & Support</h2>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">What does &quot;unlimited updates" mean?</h3>
                    <p className="text-gray-700">
                      Unlimited updates means we'll make content changes, add new pages, update information, and perform minor design tweaks at no additional cost. Major redesigns or new features may incur additional charges.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">Do you provide hosting and domain services?</h3>
                    <p className="text-gray-700">
                      Yes! Hosting is included in your monthly fee. We can help you transfer existing domains or purchase new ones. We also offer professional email hosting at $2.40/month per account.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">How do I get support when I need help?</h3>
                    <p className="text-gray-700">
                      We offer 24/7 support through multiple channels: email, live chat, and phone. Our average response time is under 2 hours, and most issues are resolved within 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* E-commerce Questions */}
              <div>
                <h2 className="font-jetbrains text-2xl font-bold text-black mb-6">E-commerce & Online Stores</h2>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">Can you build an online store?</h3>
                    <p className="text-gray-700">
                      Absolutely! Our e-commerce package includes product management, payment gateway integration, order processing, inventory tracking, and shipping calculations. Starting at $180 setup + $11/month.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">Which payment gateways do you support?</h3>
                    <p className="text-gray-700">
                      We support all major payment gateways including PayPal, Stripe, Square, and regional payment methods. We can integrate multiple payment options for better customer experience.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">How many products can I sell?</h3>
                    <p className="text-gray-700">
                      Our e-commerce package includes up to 30 products. Additional products cost $0.20 each. For larger catalogs, we offer custom solutions starting at 100+ products.
                    </p>
                  </div>
                </div>
              </div>

              {/* Process Questions */}
              <div>
                <h2 className="font-jetbrains text-2xl font-bold text-black mb-6">Our Process</h2>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">How do I get started?</h3>
                    <p className="text-gray-700">
                      Getting started is easy! Simply fill out our project builder form, schedule a free consultation, or contact us directly. We'll discuss your needs and provide a custom quote within 24 hours.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">What information do you need from me?</h3>
                    <p className="text-gray-700">
                      We'll need: your business information, design preferences, content (text and images), and any specific features you want. Don't worry if you don't have everything ready - we can help you create content.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">Can I see progress updates?</h3>
                    <p className="text-gray-700">
                      Yes! We provide regular updates throughout the development process. You'll have access to a client portal where you can see progress, provide feedback, and request changes in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-black text-white py-16">
            <div className="max-w-6xl mx-auto px-5 text-center">
              <h2 className="font-jetbrains text-3xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Can't find what you're looking for? Our team is here to help. Get in touch for personalized answers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <button className="bg-white text-black py-3 px-8 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 text-lg">
                    Contact Us
                  </button>
                </Link>
                <Link href="/builder">
                  <button className="border-2 border-white text-white py-3 px-8 rounded-lg font-medium hover:bg-white hover:text-black transition-all duration-300 text-lg">
                    Get Free Quote
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