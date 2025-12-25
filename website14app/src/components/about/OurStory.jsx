
import { ourStoryData } from '../../data/aboutData';

export default function OurStory() {
    const colorMap = {
        purple: 'text-purple-600',
        blue: 'text-blue-600',
        green: 'text-green-600',
        orange: 'text-orange-600',
    };

    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Content Side */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 font-heading">
                            {ourStoryData.title}
                        </h2>
                        <div className="space-y-6 text-lg text-slate-600 font-body leading-relaxed">
                            {ourStoryData.paragraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </div>

                    {/* Stats Side */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                        <div className="grid grid-cols-2 gap-8">
                            {ourStoryData.stats.map((stat, index) => (
                                <div key={index} className="text-center p-4 rounded-xl hover:bg-slate-50 transition-colors duration-300">
                                    <div className={`text-4xl md:text-5xl font-bold mb-2 font-heading ${colorMap[stat.color] || 'text-slate-900'}`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest font-body">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
