import Head from 'next/head';
import Link from 'next/link';
import { useLocation } from '../hooks/useLocation';
import { usePricing } from '../hooks/usePricing';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  // Use the location hook for future use
  const { location: userLocation, isLoading: locationLoading } = useLocation();

  // Use the pricing hook to pre-load pricing data
  const { pricingData, isLoading: pricingLoading } = usePricing(userLocation?.currency);
  return (
    <>
      <Head>
        <title>Website14 - Professional Web Development Services</title>
        <meta name="description" content="Get a professional, mobile-first website with unlimited updates for less than DIY platforms. Trusted by 500+ businesses." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
        <Header />

        <div className="max-w-6xl mx-auto px-5 flex-1 flex flex-col justify-center items-center">
          <div className="font-jetbrains text-5xl md:text-6xl font-bold text-black mb-12 text-center tracking-tight">
            Website14
          </div>

          <div className="w-full max-w-4xl mb-16">
            <h2 className="font-inter text-2xl md:text-3xl font-semibold text-gray-600 text-center mb-8">
              What can we help you build today?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/order" prefetch={true}>
                <button className="w-full bg-white border-2 border-gray-300 rounded-lg p-6 text-left font-inter text-lg font-medium text-gray-800 cursor-pointer transition-all duration-300 hover:border-gray-500 hover:bg-gray-50 hover:-translate-y-1 hover:shadow-lg active:translate-y-0">
                  I need a simple website
                </button>
              </Link>
              <Link href="/contact" prefetch={true}>
                <button className="w-full bg-white border-2 border-gray-300 rounded-lg p-6 text-left font-inter text-lg font-medium text-gray-800 cursor-pointer transition-all duration-300 hover:border-gray-500 hover:bg-gray-50 hover:-translate-y-1 hover:shadow-lg active:translate-y-0">
                  I need something more complex
                </button>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
