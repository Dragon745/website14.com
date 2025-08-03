import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../lib/firebase';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function SimpleClientPortal() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        console.log('SimpleClientPortal: useEffect started');
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log('SimpleClientPortal: Auth state changed', user ? 'User logged in' : 'No user');
            if (user) {
                setUser(user);
            } else {
                console.log('SimpleClientPortal: No user, redirecting to login');
                router.push('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <>
                <Head>
                    <title>Simple Client Portal - Website14</title>
                </Head>
                <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
                    <Header />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading...</p>
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
                <title>Simple Client Portal - Website14</title>
            </Head>
            <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
                <Header />

                <div className="flex-1 py-8">
                    <div className="max-w-6xl mx-auto px-5">
                        <div className="mb-8">
                            <h1 className="font-jetbrains text-4xl font-bold text-black mb-2">
                                Simple Client Portal
                            </h1>
                            <p className="text-gray-600">
                                This is a test page to verify the client portal is working
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold text-black mb-4">User Information</h2>
                            <div className="space-y-2">
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>User ID:</strong> {user.uid}</p>
                                <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
                            </div>
                        </div>

                        <div className="mt-8 bg-blue-50 rounded-lg p-6">
                            <h3 className="font-semibold text-black mb-2">Navigation Test</h3>
                            <div className="space-y-2">
                                <Link href="/client" className="block text-blue-600 hover:underline">
                                    Go to Full Client Portal
                                </Link>
                                <Link href="/client/billing" className="block text-blue-600 hover:underline">
                                    Go to Billing
                                </Link>
                                <Link href="/client/tickets" className="block text-blue-600 hover:underline">
                                    Go to Tickets
                                </Link>
                                <Link href="/client/project" className="block text-blue-600 hover:underline">
                                    Go to Project Management
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