import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ClientPortal() {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                router.push('/login');
                return;
            }

            try {
                // Get user data from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserData(data);

                    // If user is admin, redirect to admin portal
                    if (data.role === 'admin') {
                        router.push('/admin');
                        return;
                    }

                    // If user is admin, redirect to admin portal
                    if (data.role === 'admin') {
                        router.push('/admin');
                        return;
                    }
                }

                setUser(user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
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
        );
    }

    if (!user || !userData) {
        return null;
    }

    return (
        <>
            <Head>
                <title>Client Portal - Website14</title>
                <meta name="description" content="Manage your website projects" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </Head>

            <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
                <Header />

                <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userData.name}!</h1>
                        <p className="text-gray-600 mt-2">Manage your website projects and track progress</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Project Overview */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Active Projects</span>
                                    <span className="font-semibold">0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Completed</span>
                                    <span className="font-semibold">0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">In Progress</span>
                                    <span className="font-semibold">0</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                            <div className="text-gray-600 text-sm">
                                <p>No recent activity</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors">
                                    Start New Project
                                </button>
                                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors">
                                    Contact Support
                                </button>
                                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors">
                                    View Billing
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Coming Soon Message */}
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Client Portal Features Coming Soon</h3>
                        <p className="text-blue-700">
                            We're working on implementing the full client portal with project management,
                            communication tools, and billing features. Stay tuned for updates!
                        </p>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
} 