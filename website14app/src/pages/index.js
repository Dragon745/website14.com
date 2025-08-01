import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Website14 - Professional Web Development Services</title>
        <meta name="description" content="Get a professional, mobile-first website with unlimited updates for less than DIY platforms. Trusted by 500+ businesses." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
        <div className="max-w-6xl mx-auto px-5 flex-1 flex flex-col justify-center items-center">
          <div className="font-jetbrains text-5xl md:text-6xl font-bold text-black mb-12 text-center tracking-tight">
            Website14
          </div>

          <div className="w-full max-w-4xl mb-16">
            <h2 className="font-inter text-2xl md:text-3xl font-semibold text-gray-600 text-center mb-8">
              What can we help you build today?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/builder">
                <button className="w-full bg-white border-2 border-gray-300 rounded-lg p-6 text-left font-inter text-lg font-medium text-gray-800 cursor-pointer transition-all duration-300 hover:border-gray-500 hover:bg-gray-50 hover:-translate-y-1 hover:shadow-lg active:translate-y-0">
                  I need a simple website
                </button>
              </Link>
              <Link href="/builder">
                <button className="w-full bg-white border-2 border-gray-300 rounded-lg p-6 text-left font-inter text-lg font-medium text-gray-800 cursor-pointer transition-all duration-300 hover:border-gray-500 hover:bg-gray-50 hover:-translate-y-1 hover:shadow-lg active:translate-y-0">
                  I need something more complex
                </button>
              </Link>
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
      </div>
    </>
  );
}
