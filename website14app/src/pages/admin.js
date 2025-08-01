import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Admin() {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                try {
                    // Get user data from Firestore
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUserData(data);

                        // Check if user is admin
                        if (data.role !== 'admin') {
                            router.push('/');
                            return;
                        }
                    } else {
                        // User doesn't exist in Firestore, redirect to home
                        router.push('/');
                        return;
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    router.push('/');
                    return;
                }
            } else {
                // No user logged in, redirect to login
                router.push('/login');
                return;
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (loading) {
        return (
            <>
                <Head>
                    <title>Admin Dashboard - Website14</title>
                    <meta name="description" content="Admin dashboard for Website14" />
                    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                </Head>

                <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
                    <Header />

                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
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
                <title>Admin Dashboard - Website14</title>
                <meta name="description" content="Admin dashboard for Website14" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </Head>

            <div className="bg-gray-50 text-gray-800 font-inter min-h-screen flex flex-col">
                <Header />

                <div className="flex-1 max-w-6xl mx-auto px-5 py-8">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="font-jetbrains text-3xl font-bold text-black">Admin Dashboard</h1>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-blue-900 mb-2">Welcome, {userData?.name || user?.email}!</h3>
                                <p className="text-blue-700">You're logged in as an administrator.</p>
                            </div>

                            <div className="bg-green-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-green-900 mb-2">Quick Stats</h3>
                                <p className="text-green-700">View website analytics and performance metrics.</p>
                            </div>

                            <div className="bg-purple-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-purple-900 mb-2">User Management</h3>
                                <p className="text-purple-700">Manage user accounts and permissions.</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-2xl font-bold text-black mb-4">Recent Activity</h2>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-600">No recent activity to display.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
} 