
import Link from 'next/link';
import { aboutCTAData } from '../../data/aboutData';

export default function AboutCTA() {
    return (
        <section className="py-24 bg-gradient-to-br from-slate-900 to-indigo-950 text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -mt-52 -mr-52 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -mb-52 -ml-52 pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading tracking-tight">
                    {aboutCTAData.title}
                </h2>
                <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-body leading-relaxed">
                    {aboutCTAData.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/client?section=projects" passHref legacyBehavior>
                        <a className="inline-block px-8 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg hover:bg-slate-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1">
                            {aboutCTAData.primaryBtn}
                        </a>
                    </Link>

                    <Link href="/services" passHref legacyBehavior>
                        <a className="inline-block px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                            {aboutCTAData.secondaryBtn}
                        </a>
                    </Link>
                </div>
            </div>
        </section>
    );
}
