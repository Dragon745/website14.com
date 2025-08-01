import Head from 'next/head';
import Link from 'next/link';

export default function Services() {
  return (
    <>
      <Head>
        <title>Professional Website Development Services - Website14</title>
        <meta name="description" content="Get a professional, mobile-first website with unlimited updates for less than DIY platforms. Trusted by 500+ businesses. Start from $59 setup + $5/month." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      
      <body className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-900">Website14</Link>
              </div>
              <div className="flex items-center space-x-8">
                <Link href="/services" className="text-gray-600 hover:text-gray-900 transition-colors">Services</Link>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
                <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</Link>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1">
          {/* Hero Section with Social Proof */}
          <div className="max-w-6xl mx-auto px-5 py-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Trusted by 500+ businesses worldwide
              </div>
              <h1 className="font-jetbrains text-4xl md:text-6xl font-bold text-black mb-6">
                Professional Websites
                <span className="text-blue-600">That Convert</span>
              </h1>
              <p className="font-inter text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Get a custom-built, mobile-first website with unlimited updates for less than DIY platforms. 
                <span className="font-semibold text-black">No templates. No compromises.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Free consultation
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  30-day money-back guarantee
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Unlimited updates included
                </div>
              </div>
              <Link href="/builder">
                <button className="bg-black text-white py-4 px-8 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 text-lg">
                  Get Your Free Quote Now
                </button>
              </Link>
            </div>

            {/* Social Proof Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-black">500+</div>
                  <div className="text-sm text-gray-600">Happy Clients</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-black">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-black">24/7</div>
                  <div className="text-sm text-gray-600">Support Available</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-black">30 Days</div>
                  <div className="text-sm text-gray-600">Money Back</div>
                </div>
              </div>
            </div>

            {/* Services Grid with Enhanced CTAs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Static Website */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-gray-400 transition-all duration-300 relative">
                <div className="mb-6">
                  <h3 className="font-jetbrains text-2xl font-bold text-black mb-2">
                    Static Website
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Perfect for portfolios, landing pages, and simple business sites
                  </p>
                  <div className="text-3xl font-bold text-black mb-2">$59</div>
                  <div className="text-sm text-gray-500 mb-6">
                    One-time setup + $5/month
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium mb-4">
                    Most Popular for Small Businesses
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    5 Pages Included
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    Mobile-first Design
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    SEO + Speed Optimization
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    Unlimited Updates
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    SSL Certificate
                  </li>
                </ul>

                <Link href="/builder?type=static">
                  <button className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300 mb-3">
                    Start Your Website
                  </button>
                </Link>
                <p className="text-xs text-gray-500 text-center">Free consultation included</p>
              </div>

              {/* Dynamic Website */}
              <div className="bg-white border-2 border-gray-300 rounded-lg p-8 hover:border-gray-500 transition-all duration-300 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                </div>
                <div className="mb-6">
                  <h3 className="font-jetbrains text-2xl font-bold text-black mb-2">
                    Dynamic Website
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Ideal for blogs, service businesses, and content-heavy sites
                  </p>
                  <div className="text-3xl font-bold text-black mb-2">$120</div>
                  <div className="text-sm text-gray-500 mb-6">
                    One-time setup + $7.2/month
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium mb-4">
                    Best Value for Growing Businesses
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    7 Pages Included
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    1 Product Listing
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    CMS Admin Panel
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    1 Payment Gateway
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    Mobile-first Design
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    SEO + Speed Optimization
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    Unlimited Updates
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    SSL Certificate
                  </li>
                </ul>

                <Link href="/builder?type=dynamic">
                  <button className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300 mb-3">
                    Start Your Website
                  </button>
                </Link>
                <p className="text-xs text-gray-500 text-center">Free consultation included</p>
              </div>

              {/* E-commerce Website */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-gray-400 transition-all duration-300 relative">
                <div className="mb-6">
                  <h3 className="font-jetbrains text-2xl font-bold text-black mb-2">
                    E-commerce Website
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Complete online stores with payment processing
                  </p>
                  <div className="text-3xl font-bold text-black mb-2">$180</div>
                  <div className="text-sm text-gray-500 mb-6">
                    One-time setup + $11/month
                  </div>
                  <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium mb-4">
                    Complete Online Store Solution
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    10 Pages Included
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    30 Products Listing
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    Full Dashboard
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    2 Payment Gateways
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    Inventory Management
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    Mobile-first Design
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    SEO + Speed Optimization
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    Unlimited Updates
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    SSL Certificate
                  </li>
                </ul>

                <Link href="/builder?type=ecommerce">
                  <button className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300 mb-3">
                    Start Your Store
                  </button>
                </Link>
                <p className="text-xs text-gray-500 text-center">Free consultation included</p>
              </div>
            </div>

            {/* Why Choose Website14 Section */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-16">
              <div className="px-6 py-8">
                <div className="text-center mb-8">
                  <h2 className="font-jetbrains text-3xl font-bold text-black mb-4">
                    💡 Why Choose Website14?
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    We're not just another web design company — we're your tech partners.
                  </p>
                </div>

                <div className="max-w-4xl mx-auto">
                  <div className="mb-8">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      We started Website14 with one simple idea:
                    </p>
                    <div className="bg-gray-50 border-l-4 border-black p-6 my-6">
                      <p className="text-lg font-medium text-gray-900 italic">
                        "Why should people struggle with DIY tools like Wix or Shopify when they can get a professionally-built, lightning-fast, mobile-first website — with unlimited updates and ongoing support — for a price even cheaper than DIY platforms?"
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">1</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Professional Websites for the Price of DIY Tools</h3>
                          <p className="text-gray-600 text-sm">
                            You pay a small monthly fee — and get a full-blown custom-built website that looks better, loads faster, and ranks higher on Google. No templates. No compromises.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">2</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Unlimited Updates, Forever</h3>
                          <p className="text-gray-600 text-sm">
                            Tired of agencies that ghost you after delivery? With us, you get unlimited content updates and edits — as long as you're hosted with us. We treat your website like a living, growing asset.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">3</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Mobile-First, Speed-Optimized, SEO-Ready</h3>
                          <p className="text-gray-600 text-sm">
                            Every site we build is optimized for mobile phones (first!), blazing speed, Google rankings, and security (SSL + proactive monitoring).
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">4</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">No Hidden Charges</h3>
                          <p className="text-gray-600 text-sm">
                            Our pricing is simple, clear, and flexible. You pay for what you use, and can upgrade anytime. Want more pages? More products? More emails? We'll grow with you.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">5</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Real Human Support, Always</h3>
                          <p className="text-gray-600 text-sm">
                            You're not dealing with bots or a faceless company. We're a real team — driven, skilled, and just one message away. We'll guide you, advise you, and handle everything technical so you can focus on your business.
                          </p>
                        </div>
                      </div>

                      <div className="bg-black text-white p-6 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3">💬 In Short:</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <span className="text-green-400 mr-2">✓</span>
                            You focus on your brand
                          </li>
                          <li className="flex items-center">
                            <span className="text-green-400 mr-2">✓</span>
                            We'll handle the tech, design, updates, speed, security, and everything in between
                          </li>
                          <li className="flex items-center">
                            <span className="text-green-400 mr-2">✓</span>
                            Affordably, professionally, and passionately
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-16">
              <div className="px-6 py-8">
                <div className="text-center mb-8">
                  <h2 className="font-jetbrains text-3xl font-bold text-black mb-4">
                    What Our Clients Say
                  </h2>
                  <p className="text-lg text-gray-600">
                    Don't just take our word for it
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="text-yellow-400 text-xl">★★★★★</div>
                      <span className="ml-2 text-sm text-gray-600">5.0</span>
                    </div>
                    <p className="text-gray-700 mb-4">
                      "Website14 built our e-commerce site in just 2 weeks. The site loads super fast and we're already seeing sales. Their unlimited updates policy is a game-changer!"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                      <div>
                        <div className="font-semibold text-gray-900">Sarah Johnson</div>
                        <div className="text-sm text-gray-600">Boutique Owner</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="text-yellow-400 text-xl">★★★★★</div>
                      <span className="ml-2 text-sm text-gray-600">5.0</span>
                    </div>
                    <p className="text-gray-700 mb-4">
                      "Finally, a web company that doesn't disappear after launch! They've been updating our site for 6 months and always respond within hours."
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                      <div>
                        <div className="font-semibold text-gray-900">Mike Chen</div>
                        <div className="text-sm text-gray-600">Restaurant Owner</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="text-yellow-400 text-xl">★★★★★</div>
                      <span className="ml-2 text-sm text-gray-600">5.0</span>
                    </div>
                    <p className="text-gray-700 mb-4">
                      "I was paying $300/month for a basic Shopify store. Website14 built me a custom site for $59 setup + $5/month. It looks 10x better and converts better too!"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                      <div>
                        <div className="font-semibold text-gray-900">Lisa Rodriguez</div>
                        <div className="text-sm text-gray-600">Online Store Owner</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Comparison Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-16">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Feature Comparison</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Static Website</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dynamic Website</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-commerce Website</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pages Included</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Extra Page</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$3</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$4</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$5</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Products</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Extra Product</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$0.2</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Payment Gateways</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Extra Payment Gateway</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$5</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add-ons Section */}
            <div id="addons-section" className="bg-white rounded-lg shadow overflow-hidden mb-16">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Add-ons & Extras</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Extra Pages</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Static Website Page</span>
                        <span>$3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dynamic Website Page</span>
                        <span>$4</span>
                      </div>
                      <div className="flex justify-between">
                        <span>E-commerce Page</span>
                        <span>$5</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">E-commerce Features</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Extra Product</span>
                        <span>$0.2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Extra Payment Gateway</span>
                        <span>$5</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Design Services</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Logo Design</span>
                        <span>$12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Hosting Section */}
            <div id="email-section" className="bg-white rounded-lg shadow overflow-hidden mb-16">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Email Hosting</h2>
                <p className="text-sm text-gray-600 mt-1">Professional email accounts for your domain</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Monthly</h3>
                    <div className="text-2xl font-bold text-black">$2.4</div>
                    <div className="text-sm text-gray-500">per email account</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Yearly</h3>
                    <div className="text-2xl font-bold text-black">$24</div>
                    <div className="text-sm text-gray-500">per email account</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">2 Year Plan</h3>
                    <div className="text-2xl font-bold text-black">$43</div>
                    <div className="text-sm text-gray-500">per email account</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">3 Year Plan</h3>
                    <div className="text-2xl font-bold text-black">$60</div>
                    <div className="text-sm text-gray-500">per email account</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Reversal & Final CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-16">
              <div className="text-center">
                <h2 className="font-jetbrains text-3xl font-bold mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-xl mb-6 opacity-90">
                  Join 500+ businesses who trust Website14 with their online presence
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">30 Days</div>
                    <div className="text-sm opacity-90">Money Back Guarantee</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">Free</div>
                    <div className="text-sm opacity-90">Consultation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">Unlimited</div>
                    <div className="text-sm opacity-90">Updates Included</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/builder">
                    <button className="bg-white text-blue-600 py-4 px-8 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 text-lg">
                      Get Your Free Quote
                    </button>
                  </Link>
                  <Link href="/contact">
                    <button className="border-2 border-white text-white py-4 px-8 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-all duration-300 text-lg">
                      Talk to Our Team
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
          <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-jetbrains text-xl font-bold text-black">Website14</div>
            <ul className="flex gap-8 text-sm">
              <li>
                <Link href="/services" className="text-gray-500 hover:text-black transition-colors duration-300 font-inter">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-500 hover:text-black transition-colors duration-300 font-inter">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-500 hover:text-black transition-colors duration-300 font-inter">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-black transition-colors duration-300 font-inter">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </footer>
      </body>
    </>
  );
} 