import Link from 'next/link';
import { servicePackages } from '../../data/servicesData';

export default function ServicesGrid({
  currentPricing,
  formatPrice,
  onPackageSelection
}) {
  const getPricingValue = (priceKey, type) => {
    const [category, field] = priceKey.split('.');
    return currentPricing[category][field];
  };

  return (
    <section id="services-grid" className="relative py-24 px-4 overflow-hidden">
      {/* Background blobs for premium feel */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight font-heading">
            Transparent, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Simple Pricing</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-body">
            Everything you need to launch and grow your business online. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {Object.entries(servicePackages).map(([key, packageData]) => {
            const isPopular = packageData.isPopular;
            // Calculations
            const setupPrice = formatPrice(getPricingValue(packageData.setupPrice, 'setup'), currentPricing.currency);
            const monthlyPrice = formatPrice(getPricingValue(packageData.monthlyPrice, 'monthly'), currentPricing.currency);

            return (
              <div
                key={key}
                className={`relative group rounded-3xl p-8 transition-all duration-300 ${isPopular
                  ? 'bg-white shadow-2xl scale-105 ring-4 ring-purple-500/20 z-10'
                  : 'bg-white/50 backdrop-blur-sm border border-slate-200 hover:bg-white hover:shadow-xl hover:-translate-y-2'
                  }`}
              >
                {isPopular && (
                  <div className="absolute -top-5 left-0 right-0 flex justify-center">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className={`text-2xl font-bold mb-2 font-subheading ${isPopular ? 'text-slate-900' : 'text-slate-800'}`}>
                    {packageData.title}
                  </h3>
                  <p className="text-slate-500 text-sm h-10 mb-6 font-body">
                    {packageData.subtitle}
                  </p>

                  <div className="flex items-baseline mb-2 font-heading">
                    <span className="text-4xl font-bold text-slate-900">{setupPrice}</span>
                    <span className="text-slate-500 ml-2 font-medium">setup</span>
                  </div>
                  <div className="text-slate-600 font-medium flex items-center gap-2 mb-6 font-body">
                    <span className="bg-slate-100 px-3 py-1 rounded-full text-sm">
                      + <span className="font-bold text-slate-900">{monthlyPrice}</span> /mo
                    </span>
                  </div>

                  <Link href={`/client?section=projects&package=${packageData.packageType}`} passHref legacyBehavior>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        onPackageSelection(packageData.packageType);
                      }}
                      className={`w-full py-4 rounded-xl font-bold transition-all duration-300 font-body inline-block text-center cursor-pointer ${isPopular
                        ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-purple-500/25'
                        : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      {packageData.buttonText}
                    </a>
                  </Link>
                </div>

                <div className="space-y-4 font-body">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    What's Included
                  </div>
                  {packageData.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 text-slate-700">
                      <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isPopular ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500 group-hover:bg-green-100 group-hover:text-green-600 transition-colors'}`}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
