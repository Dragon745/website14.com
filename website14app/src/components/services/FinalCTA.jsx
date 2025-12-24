import Link from 'next/link';
import { finalCTAGuarantees } from '../../data/servicesData';

export default function FinalCTA({ onPackageSelection }) {
  return (
    <section className="relative py-32 overflow-hidden bg-slate-900">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-slate-900/40 z-0"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] -mt-40 -mr-40 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -mb-40 -ml-40 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight font-heading">
          Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Launch?</span>
        </h2>
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto font-body leading-relaxed">
          Join 500+ businesses who trusted us to build their digital future.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          {finalCTAGuarantees.map((guarantee, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="font-heading text-3xl font-bold text-white mb-2">{guarantee.value}</div>
              <div className="text-sm text-slate-400 font-medium uppercase tracking-wide font-body">{guarantee.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/client?section=projects&package=dynamicSetup" passHref legacyBehavior>
            <a
              onClick={(e) => {
                e.preventDefault();
                onPackageSelection('dynamicSetup');
              }}
              className="group relative px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden inline-block text-center cursor-pointer"
            >
              <span className="relative z-10">Get Your Free Quote</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
          </Link>

          <Link href="/contact" prefetch={true} passHref legacyBehavior>
            <a className="px-8 py-4 rounded-full font-bold text-lg text-white border border-white/20 hover:bg-white/10 transition-all duration-300 inline-block text-center cursor-pointer">
              Talk to Our Team
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
