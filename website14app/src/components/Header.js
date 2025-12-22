import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Header() {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showToolsMenu, setShowToolsMenu] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [taglineWidth, setTaglineWidth] = useState('auto');
    const logoRef = useRef(null);
    const taglineRef = useRef(null);
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

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const matchWidths = () => {
            if (logoRef.current && taglineRef.current) {
                // Wait for next frame to ensure fonts are rendered
                requestAnimationFrame(() => {
                    const logoWidth = logoRef.current.offsetWidth;
                    if (logoWidth > 0) {
                        setTaglineWidth(`${logoWidth}px`);
                    }
                });
            }
        };

        // Match widths on mount, after a short delay for font loading, and on window resize
        const timer = setTimeout(matchWidths, 50);
        window.addEventListener('resize', matchWidths);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', matchWidths);
        };
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
        <>
            {/* Top Bar */}
            <div className="bg-slate-900 text-white text-sm py-2 hidden md:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>info@website14.com</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>24/7 Support Available</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-400">Trusted by 500+ businesses worldwide</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className={`bg-white ${isScrolled ? 'shadow-md' : 'shadow-sm'} border-b border-slate-200 sticky top-0 z-50 transition-shadow duration-300`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-3 group">
                                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-800 via-purple-900 to-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden">
                                    {/* Animated background gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-700 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    {/* Web/Code Icon */}
                                    <img src="/logo-icon.svg" alt="Website14 Logo" className="relative w-7 h-7" />
                                </div>
                                <div>
                                    <div ref={logoRef} className="font-logo text-2xl font-bold text-slate-900 group-hover:text-purple-800 transition-colors uppercase" style={{ letterSpacing: '0.075em', display: 'inline-block' }}>
                                        WEBSITE14
                                    </div>
                                    <div ref={taglineRef} className="text-slate-500 font-medium uppercase whitespace-nowrap" style={{ fontVariant: 'small-caps', letterSpacing: '0.02em', fontSize: '0.65rem', width: taglineWidth, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>Professional IT Services</div>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            <Link href="/services" prefetch={true} className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-purple-800 hover:bg-slate-50 rounded-lg transition-colors">
                                Services
                            </Link>
                            <Link href="/about" prefetch={true} className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-purple-800 hover:bg-slate-50 rounded-lg transition-colors">
                                About
                            </Link>
                            <Link href="/faq" prefetch={true} className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-purple-800 hover:bg-slate-50 rounded-lg transition-colors">
                                FAQ
                            </Link>
                            <Link href="/blog" prefetch={true} className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-purple-800 hover:bg-slate-50 rounded-lg transition-colors">
                                Blog
                            </Link>
                            <div className="relative">
                                <button
                                    onClick={() => setShowToolsMenu(!showToolsMenu)}
                                    onBlur={() => setTimeout(() => setShowToolsMenu(false), 200)}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-purple-800 hover:bg-slate-50 rounded-lg transition-colors flex items-center space-x-1"
                                >
                                    <span>Tools</span>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {showToolsMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                        <Link
                                            href="/tools/speed-test"
                                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-purple-800 transition-colors"
                                        >
                                            <div className="font-medium">Speed Test</div>
                                            <div className="text-xs text-gray-500">Test your website performance</div>
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <Link href="/contact" prefetch={true} className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-purple-800 hover:bg-slate-50 rounded-lg transition-colors">
                                Contact
                            </Link>
                        </nav>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-4">
                            {!loading && (
                                <>
                                    {user ? (
                                        <div className="flex items-center space-x-4">
                                            <Link
                                                href="/client"
                                                className="hidden md:block bg-gradient-to-r from-purple-800 to-purple-900 text-white px-5 py-2.5 rounded-lg hover:from-purple-900 hover:to-slate-900 transition-colors font-medium text-sm shadow-md hover:shadow-lg"
                                            >
                                                Client Portal
                                            </Link>
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                                    onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
                                                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="w-9 h-9 bg-gradient-to-br from-purple-800 to-purple-900 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                                        {userData?.name ? userData.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="hidden xl:block text-sm font-medium text-gray-700 max-w-[120px] truncate">{userData?.name || user.email}</span>
                                                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>

                                                {showUserMenu && (
                                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                                        <div className="px-4 py-3 border-b border-gray-200">
                                                            <div className="text-sm font-semibold text-gray-900">{userData?.name || 'User'}</div>
                                                            <div className="text-xs text-gray-500 truncate">{user.email}</div>
                                                        </div>
                                                        <button
                                                            onClick={handleLogout}
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                        >
                                                            Sign Out
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Link
                                                href={`/login?returnUrl=${encodeURIComponent(router.asPath)}`}
                                                className="hidden md:block text-sm font-medium text-slate-700 hover:text-purple-800 transition-colors"
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                href={`/login?returnUrl=${encodeURIComponent(router.asPath)}`}
                                                className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-5 py-2.5 rounded-lg hover:from-purple-900 hover:to-slate-900 transition-colors font-medium text-sm shadow-md hover:shadow-lg"
                                            >
                                                Get Started
                                            </Link>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
} 