import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Footer() {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
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
        });

        return () => unsubscribe();
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

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-300 mt-auto border-t border-slate-800/30">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-800 via-purple-900 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                                <img src="/logo-icon.svg" alt="Website14 Logo" className="w-7 h-7" />
                            </div>
                            <div>
                                <div ref={logoRef} className="font-logo text-xl font-bold text-white uppercase" style={{letterSpacing: '0.15em', display: 'inline-block'}}>
                                    WEBSITE14
                                </div>
                                <div ref={taglineRef} className="text-slate-400 font-medium uppercase whitespace-nowrap" style={{fontVariant: 'small-caps', letterSpacing: '0.02em', fontSize: '0.65rem', width: taglineWidth, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis'}}>Professional IT Services</div>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Transforming businesses with professional web development services.
                            Trusted by 500+ companies worldwide.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-sm">
                                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-slate-400">info@website14.com</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm">
                                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-slate-400">24/7 Support Available</span>
                            </div>
                        </div>
                        
                        {/* Social Media Links */}
                        <div className="mt-6">
                            <h4 className="font-heading text-white font-semibold text-sm mb-3">Follow Us</h4>
                            <div className="flex items-center space-x-3">
                                <a href="https://twitter.com/website14" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-800 hover:to-purple-900 transition-colors group">
                                    <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="https://linkedin.com/company/website14" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-800 hover:to-purple-900 transition-colors group">
                                    <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                                <a href="https://facebook.com/website14" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-800 hover:to-purple-900 transition-colors group">
                                    <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a href="https://github.com/website14" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-800 hover:to-purple-900 transition-colors group">
                                    <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        
                        {/* Newsletter Signup */}
                        <div className="mt-6">
                            <h4 className="font-subheading text-white font-semibold text-sm mb-3">Newsletter</h4>
                            <p className="text-slate-400 text-xs mb-3">Get the latest updates and web development tips</p>
                            <form className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:border-transparent"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-purple-800 to-purple-900 text-white rounded-lg hover:from-purple-900 hover:to-slate-900 transition-colors text-sm font-medium whitespace-nowrap"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-heading text-white font-semibold text-lg mb-6">Services</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/services" prefetch={true} className="text-slate-400 hover:text-purple-500 transition-colors text-sm">
                                    Static Websites
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" prefetch={true} className="text-slate-400 hover:text-purple-500 transition-colors text-sm">
                                    Dynamic Websites
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" prefetch={true} className="text-slate-400 hover:text-purple-500 transition-colors text-sm">
                                    E-commerce Solutions
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" prefetch={true} className="text-slate-400 hover:text-purple-500 transition-colors text-sm">
                                    Website Maintenance
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" prefetch={true} className="text-slate-400 hover:text-purple-500 transition-colors text-sm">
                                    SEO Optimization
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" prefetch={true} className="text-slate-400 hover:text-purple-500 transition-colors text-sm">
                                    Hosting & Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-heading text-white font-semibold text-lg mb-6">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" prefetch={true} className="text-slate-400 hover:text-purple-500 transition-colors text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" prefetch={true} className="text-slate-400 hover:text-purple-500 transition-colors text-sm">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" prefetch={true} className="text-slate-400 hover:text-purple-500 transition-colors text-sm">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" prefetch={true} className="text-slate-400 hover:text-purple-500 transition-colors text-sm">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools/speed-test" prefetch={true} className="text-slate-400 hover:text-purple-500 transition-colors text-sm">
                                    Tools
                                </Link>
                            </li>
                            <li>
                                <Link href="/sitemap.xml" className="text-slate-400 hover:text-purple-500 transition-colors text-sm">
                                    Sitemap
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources & Support */}
                    <div>
                        <h3 className="font-heading text-white font-semibold text-lg mb-6">Resources & Support</h3>
                        <ul className="space-y-3">
                            {user ? (
                                <>
                                    <li>
                                        <Link href="/client" className="text-slate-400 hover:text-purple-500 transition-colors text-sm">
                                            Client Portal
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/builder" prefetch={true} className="text-slate-400 hover:text-purple-500 transition-colors text-sm">
                                            Project Builder
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link href={`/login?returnUrl=${encodeURIComponent(router.asPath)}`} className="text-slate-400 hover:text-purple-500 transition-colors text-sm">
                                            Sign In
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/signup" prefetch={true} className="text-slate-400 hover:text-purple-500 transition-colors text-sm">
                                            Create Account
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li>
                                <Link href="/quote" prefetch={true} className="text-slate-400 hover:text-purple-500 transition-colors text-sm">
                                    Get Free Quote
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" prefetch={true} className="text-slate-400 hover:text-purple-500 transition-colors text-sm">
                                    Support Center
                                </Link>
                            </li>
                            <li>
                                <span className="text-slate-400 text-sm">Documentation</span>
                            </li>
                            <li>
                                <span className="text-slate-400 text-sm">API Reference</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-sm text-slate-400">
                            © {currentYear} Website14. All rights reserved.
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-sm">
                            <Link href="/privacy" className="text-slate-400 hover:text-purple-500 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-slate-400 hover:text-purple-500 transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/cookie-policy" className="text-slate-400 hover:text-purple-500 transition-colors">
                                Cookie Policy
                            </Link>
                            <div className="flex items-center space-x-2">
                                <span className="text-slate-400">Certified</span>
                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
} 