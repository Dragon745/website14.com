import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Header() {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setUser(user);

            if (user) {
                try {
                    // Get user data from Firestore
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                setUserData(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Redirect to home page after successful logout
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="font-jetbrains text-xl font-bold text-black">Website14</Link>
                    </div>

                    <div className="flex items-center space-x-8">
                        <Link href="/services" prefetch={true} className="text-gray-600 hover:text-gray-900 transition-colors">Services</Link>
                        <Link href="/blog" prefetch={true} className="text-gray-600 hover:text-gray-900 transition-colors">Blog</Link>
                        <Link href="/about" prefetch={true} className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
                        <Link href="/faq" prefetch={true} className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</Link>
                        <Link href="/contact" prefetch={true} className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>

                        {!loading && (
                            <>
                                {user ? (
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href="/client"
                                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                                        >
                                            Client Portal
                                        </Link>
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowUserMenu(!showUserMenu)}
                                                onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
                                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                                            >
                                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="hidden md:block">{userData?.name || user.email}</span>
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>

                                            {showUserMenu && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href={`/login?returnUrl=${encodeURIComponent(router.asPath)}`}
                                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        Login
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
} 