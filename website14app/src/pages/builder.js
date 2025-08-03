import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectBuilderForm from '../components/ProjectBuilderForm';

export default function Builder() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <>
        <Head>
          <title>Project Builder - Website14</title>
          <meta name="description" content="Build your perfect website with our interactive project builder" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>

        <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
          <Header />

          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading project builder...</p>
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
        <title>Project Builder - Website14</title>
        <meta name="description" content="Build your perfect website with our interactive project builder" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
        <Header />

        <ProjectBuilderForm />

        <Footer />
      </div>
    </>
  );
} 