
import { processData } from '../../data/aboutData';

export default function ProcessSection() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-heading">How We Work</h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto font-body">Simple, transparent, and effective.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {processData.map((process, index) => (
                        <div key={index} className="relative group">
                            {/* Connector Line (Desktop) */}
                            {index < processData.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-slate-200 -z-10 group-hover:bg-purple-200 transition-colors duration-500"></div>
                            )}

                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative z-10">
                                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-bold mb-6 group-hover:bg-purple-600 transition-colors duration-300 shadow-md">
                                    {process.step}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading">{process.title}</h3>
                                <p className="text-slate-600 font-body text-sm leading-relaxed">{process.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
