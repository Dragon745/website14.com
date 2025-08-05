import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Footer() {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
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
        <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
            <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="font-jetbrains text-xl font-bold text-black">Website14</div>

                <ul className="flex gap-8 text-sm">
                    <li>
                        <Link href="/services" prefetch={true} className="text-gray-500 hover:text-black transition-colors duration-300 font-inter">
                            Services
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" prefetch={true} className="text-gray-500 hover:text-black transition-colors duration-300 font-inter">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link href="/faq" prefetch={true} className="text-gray-500 hover:text-black transition-colors duration-300 font-inter">
                            FAQ
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact" prefetch={true} className="text-gray-500 hover:text-black transition-colors duration-300 font-inter">
                            Contact
                        </Link>
                    </li>
                    <li>
                        <Link href="/sitemap.xml" className="text-gray-500 hover:text-black transition-colors duration-300 font-inter">
                            Sitemap
                        </Link>
                    </li>
                    {user ? (
                        <>
                            <li>
                                <Link href="/client" className="text-gray-500 hover:text-black transition-colors duration-300 font-inter font-medium">
                                    Client Portal
                                </Link>
                            </li>
                            <li className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
                                    className="flex items-center space-x-2 text-gray-500 hover:text-black transition-colors duration-300 font-inter"
                                >
                                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="hidden md:block">{userData?.name || user.email}</span>
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute bottom-full mb-2 right-0 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link href={`/login?returnUrl=${encodeURIComponent(router.asPath)}`} className="text-gray-500 hover:text-black transition-colors duration-300 font-inter">
                                Login
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </footer>
    );
} 