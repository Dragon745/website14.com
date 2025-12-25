
import React from 'react';

export default function BlogHero({ searchTerm, setSearchTerm, selectedTag, setSelectedTag, allTags }) {
    return (
        <section className="relative overflow-hidden bg-slate-900 pt-20 pb-20 lg:pt-32 lg:pb-32">
            {/* Background with abstract gradients */}
            <div className="absolute inset-0 bg-slate-900">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-blue-900/20 blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container relative mx-auto px-4 text-center z-10">
                <span className="inline-block py-1 px-3 rounded-full bg-purple-900/30 border border-purple-500/30 backdrop-blur-md text-purple-300 text-xs font-semibold tracking-wide uppercase mb-6">
                    Our Latest Thoughts
                </span>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-slate-300 mb-6 font-heading tracking-tight">
                    Insights & Updates
                </h1>

                <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                    Expert articles, industry news, and web development tips from the Website14 team.
                </p>

                {/* Search and Filter */}
                <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 backdrop-blur-sm p-2 rounded-2xl flex flex-col md:flex-row gap-2">
                    <div className="relative flex-1">
                        <svg className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent text-white placeholder-slate-400 pl-11 pr-4 py-3 border-none focus:ring-0 rounded-xl hover:bg-white/5 transition-colors"
                        />
                    </div>
                    <div className="md:w-48 relative border-t md:border-t-0 md:border-l border-white/10">
                        <select
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                            className="w-full bg-transparent text-slate-300 py-3 pl-4 pr-10 border-none focus:ring-0 cursor-pointer hover:bg-white/5 rounded-xl transition-colors appearance-none"
                            style={{ backgroundImage: 'none' }}
                        >
                            <option value="" className="bg-slate-800 text-slate-300">All Topics</option>
                            {allTags.map(tag => (
                                <option key={tag} value={tag} className="bg-slate-800 text-slate-300">{tag}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
