import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { useLocation } from '../hooks/useLocation';
import { usePricing } from '../hooks/usePricing';
import ContactChat from '../components/ContactChat';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contact() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Pre-load location and pricing data
  const { location: userLocation } = useLocation();
  const { pricingData } = usePricing(userLocation?.currency);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <>
        <Head>
          <title>Contact Us - Website14</title>
          <meta name="description" content="Get in touch with Website14 for professional web development services. Free consultation and quotes available." />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>

        <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
          <Header />

          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-gray-600">Checking authentication...</p>
            </div>
          </div>

          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Contact Us - Website14</title>
        <meta name="description" content="Get in touch with Website14 for professional web development services. Free consultation and quotes available." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
        <Header />

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center items-center py-8">
          <div className="w-full max-w-2xl mx-auto px-5">
            {user ? (
              <ContactChat />
            ) : (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
                <div className="mb-6">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
                  <p className="text-gray-600 mb-6">
                    To contact our team, please log in to your account. This helps us provide better service and track your inquiries.
                  </p>
                </div>

                <div className="space-y-4">
                  <Link
                    href={`/login?returnUrl=${encodeURIComponent(router.asPath)}`}
                    className="inline-block w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium"
                  >
                    Sign In to Continue
                  </Link>

                  <div className="text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link
                      href={`/signup?returnUrl=${encodeURIComponent(router.asPath)}`}
                      className="text-black hover:text-gray-800 font-medium"
                    >
                      Sign up here
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
} 