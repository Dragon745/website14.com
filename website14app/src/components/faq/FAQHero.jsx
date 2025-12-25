
import { faqHeroData } from '../../data/faqData';
import { useState, useEffect } from 'react';

export default function FAQHero({ searchQuery, setSearchQuery }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 20,
                y: (e.clientY / window.innerHeight) * 20,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-slate-900 border-b border-slate-800 flex items-center min-h-[40vh] lg:min-h-[50vh]">
            {/* Animated Cosmic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen"
                    style={{ transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)` }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow animation-delay-2000 mix-blend-screen"
                    style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }} />
                <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px] animate-blob mix-blend-screen" />

                {/* Star-like dots pattern */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Content */}
                    <div className="text-center lg:text-left">
                        {/* Glowing Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-purple-300 text-sm font-medium mb-8 animate-fade-in-up md:mx-0 mx-auto">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                            Knowledge Base & Support
                        </div>

                        <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight animate-fade-in-up animation-delay-100">
                            {faqHeroData.title.split(' ').map((word, i) => (
                                <span key={i} className="inline-block relative mr-3 last:mr-0">
                                    {word}{' '}
                                    {i === 1 && (
                                        <svg className="absolute -bottom-2 left-0 w-full h-3 text-purple-500 opacity-50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                        </svg>
                                    )}
                                </span>
                            ))}
                        </h1>

                        <p className="text-xl text-slate-300 mb-8 max-w-lg mx-auto lg:mx-0 font-body leading-relaxed animate-fade-in-up animation-delay-200">
                            {faqHeroData.subtitle}
                        </p>
                    </div>

                    {/* Right Column: Ultra-Modern Search Card */}
                    <div className="relative group animate-fade-in-up animation-delay-300 w-full max-w-lg mx-auto lg:ml-auto">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
                        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                            <h3 className="text-white font-heading text-2xl mb-6">How can we help?</h3>

                            <div className="relative mb-6">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-6 w-6 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-12 pr-4 py-4 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10 transition-all duration-300"
                                    placeholder={faqHeroData.placeholder}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 text-sm">
                                <span className="text-slate-400">Popular:</span>
                                {['Pricing', 'Hosting', 'E-commerce'].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSearchQuery(tag)}
                                        className="text-purple-300 hover:text-white hover:underline transition-colors"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
