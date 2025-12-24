import { additionalFeatures, whyAddFeaturesBenefits } from '../../data/servicesData';

export default function AdditionalFeaturesSection({ currentPricing, formatPrice }) {
  const colorMap = {
    purple: 'bg-purple-500',
    green: 'bg-green-500' // Using hex or tailwind class is fine
  };

  return (
    <section id="additional-features-section" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Benefits (Sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl overflow-hidden relative">
              {/* Decorative bg */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

              <h2 className="text-3xl font-bold mb-6 font-heading relative z-10">Supercharge Your Site</h2>
              <p className="text-slate-300 mb-8 relative z-10 font-body">
                Unlock the full potential of your online presence with these powerful integration modules.
              </p>

              <div className="space-y-6 relative z-10">
                {whyAddFeaturesBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-white mb-1">{benefit.title}</div>
                      <div className="text-sm text-slate-400">{benefit.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Features Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {additionalFeatures.map((category, index) => (
                <div key={index} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-purple-200 transition-colors group">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center font-subheading">
                    <span className={`w-2 h-2 ${colorMap[category.color]} rounded-full mr-3 ring-4 ring-white shadow-sm`}></span>
                    {category.title}
                  </h3>
                  <div className="space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100 group-hover:border-purple-100 transition-colors">
                        <span className="text-slate-700 font-medium text-sm">{item.name}</span>
                        <span className="font-bold text-slate-900 text-sm bg-slate-100 px-3 py-1 rounded-lg">
                          {formatPrice(currentPricing.addons[item.key], currentPricing.currency)}
                        </span>
                      </div>
                    ))}
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
