export default function EmailHostingSection({ currentPricing, formatPrice }) {
  const calculateYearlyPrice = (monthly, months, discount) => {
    return Math.round(monthly * months * (1 - discount / 100));
  };

  return (
    <section id="email-section" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative text-white">
          {/* Decorative BG */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -ml-16 -mb-16"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">Professional Email Hosting</h2>
              <p className="text-slate-300 text-lg mb-8 max-w-lg font-body">Build trust with a custom domain email address. Secure, spam-free, and professional.</p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm font-medium bg-white/10 px-4 py-2 rounded-full border border-white/10">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Spam Protection
                </div>
                <div className="flex items-center gap-2 text-sm font-medium bg-white/10 px-4 py-2 rounded-full border border-white/10">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  50GB Storage
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Monthly */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-6 rounded-2xl text-center hover:bg-white/20 transition-colors">
                <div className="text-slate-300 text-sm mb-1 font-medium">Monthly</div>
                <div className="text-2xl font-bold mb-1">{formatPrice(currentPricing.addons.emailAccount, currentPricing.currency)}</div>
                <div className="text-xs text-slate-400">per account</div>
              </div>

              {/* Yearly */}
              <div className="bg-white text-slate-900 p-6 rounded-2xl text-center shadow-lg transform scale-105">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
                <div className="text-slate-600 text-sm mb-1 font-medium">Yearly</div>
                <div className="text-2xl font-bold mb-1">{formatPrice(calculateYearlyPrice(currentPricing.addons.emailAccount, 10, currentPricing.discounts.yearly), currentPricing.currency)}</div>
                <div className="text-xs text-slate-500">per account</div>
              </div>

              {/* 2 Year */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/5 p-6 rounded-2xl text-center hover:bg-white/10 transition-colors">
                <div className="text-slate-400 text-sm mb-1 font-medium">2 Years</div>
                <div className="text-xl font-bold mb-1">{formatPrice(calculateYearlyPrice(currentPricing.addons.emailAccount, 18, currentPricing.discounts.twoYear), currentPricing.currency)}</div>
                <div className="text-xs text-slate-500 rounded bg-green-500/20 text-green-300 inline-block px-2 py-0.5 mt-1">Save {currentPricing.discounts.twoYear}%</div>
              </div>

              {/* 3 Year */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/5 p-6 rounded-2xl text-center hover:bg-white/10 transition-colors">
                <div className="text-slate-400 text-sm mb-1 font-medium">3 Years</div>
                <div className="text-xl font-bold mb-1">{formatPrice(calculateYearlyPrice(currentPricing.addons.emailAccount, 25, currentPricing.discounts.threeYear), currentPricing.currency)}</div>
                <div className="text-xs text-slate-500 rounded bg-green-500/20 text-green-300 inline-block px-2 py-0.5 mt-1">Save {currentPricing.discounts.threeYear}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
