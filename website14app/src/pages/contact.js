import Head from 'next/head';
import Link from 'next/link';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us - Website14</title>
        <meta name="description" content="Get in touch with Website14 for professional web development services. Free consultation and quotes available." />
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
        <div className="flex-1 flex flex-col justify-center items-center py-8">
          <div className="w-full max-w-2xl mx-auto px-5">
            {/* Chat Container */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h1 className="font-inter text-xl font-semibold text-gray-800">Contact Us</h1>
                  <p className="text-gray-600 text-sm mt-1">Let's get started with your inquiry</p>
                </div>
                <button
                  id="new-chat-btn"
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 font-inter text-sm font-medium"
                  style={{ display: 'none' }}
                >
                  New Chat
                </button>
              </div>

              {/* Chat Messages */}
              <div id="chat-messages" className="h-96 overflow-y-auto p-6 space-y-4">
                {/* Messages will be dynamically added here */}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    id="user-input"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent font-inter"
                    disabled
                  />
                  <button
                    id="send-btn"
                    className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled
                  >
                    Send
                  </button>
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