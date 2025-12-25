import { aboutHeroData } from '../../data/aboutData';

export default function AboutHero() {
    return (
        <section className="bg-gradient-to-br from-slate-50 via-white to-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Content */}
                    <div>
                        <div className="inline-flex items-center bg-slate-50 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-slate-200">
                            <span className="w-2 h-2 bg-purple-800 rounded-full mr-2 animate-pulse"></span>
                            Established Process & Proven Results
                        </div>

                        <h1 className="font-heading text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                            {aboutHeroData.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600">{aboutHeroData.highlight}</span>
                        </h1>

                        <p className="text-lg text-slate-600 mb-6 leading-relaxed font-body">
                            {aboutHeroData.subtitle}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="font-medium">500+ Happy Clients</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="font-medium">Global Trust</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Mission Card (No Photos) */}
                    <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500 pointer-events-none" />

                        <h3 className="font-subheading text-2xl font-bold text-slate-900 mb-6">Our Mission</h3>
                        <p className="text-slate-600 font-body leading-relaxed mb-6">
                            To democratize professional web development. We believe every business, no matter the size, deserves a world-class digital presence without the agency price tag.
                        </p>

                        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                            <div>
                                <div className="text-3xl font-bold text-purple-800 mb-1 font-heading">100%</div>
                                <div className="text-sm text-slate-500 font-medium">In-House Code</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-indigo-600 mb-1 font-heading">0</div>
                                <div className="text-sm text-slate-500 font-medium">Outsourcing</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
