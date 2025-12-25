
import Link from 'next/link';
import { faqCTAData } from '../../data/faqData';

export default function FAQCTA() {
    return (
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -mt-52 -mr-52 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] -mb-52 -ml-52 pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 font-heading">
                    {faqCTAData.title}
                </h2>
                <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-body">
                    {faqCTAData.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/contact" passHref legacyBehavior>
                        <a className="inline-block px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-white/20 transform hover:-translate-y-1">
                            {faqCTAData.contactBtn}
                        </a>
                    </Link>
                    <Link href="/client?section=projects" passHref legacyBehavior>
                        <a className="inline-block px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300">
                            {faqCTAData.quoteBtn}
                        </a>
                    </Link>
                </div>
            </div>
        </section>
    );
}
