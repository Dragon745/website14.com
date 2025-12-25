
import { valuesData } from '../../data/aboutData';

const iconMap = {
    speed: "M13 10V3L4 14h7v7l9-11h-7z", // Bolt
    quality: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", // Check Circle
    partnership: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" // Heart
};

const colorMap = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    green: "bg-green-50 text-green-600 group-hover:bg-green-100",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-100"
};

export default function OurValues() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-heading">Our Core Values</h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto font-body">The principles that guide every pixel we push and every line of code we write.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {valuesData.map((value, index) => (
                        <div key={index} className="group p-8 rounded-2xl border border-slate-100 bg-white hover:border-purple-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${colorMap[value.color]}`}>
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconMap[value.icon]} />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading">{value.title}</h3>
                            <p className="text-slate-600 leading-relaxed font-body">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
