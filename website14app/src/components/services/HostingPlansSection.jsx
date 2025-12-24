import { useState } from 'react';
import { hostingIncludedFeatures } from '../../data/servicesData';

export default function HostingPlansSection({ currentPricing, formatPrice }) {
  const [activeTab, setActiveTab] = useState('static');

  const planTypes = [
    { id: 'static', label: 'Static Website' },
    { id: 'dynamic', label: 'Dynamic Website' },
    { id: 'ecommerce', label: 'E-commerce' }
  ];

  const calculateYearlyPrice = (monthly, months, discount) => {
    return Math.round(monthly * months * (1 - discount / 100));
  };

  const getPricingCard = (title, months, discount, colorTheme) => {
    let priceValue;
    let periodLabel;

    if (months === 1) {
      priceValue = currentPricing[activeTab].monthly;
      periodLabel = "per month";
    } else if (months === 12) {
      priceValue = calculateYearlyPrice(currentPricing[activeTab].monthly, 10, currentPricing.discounts.yearly);
      periodLabel = "per year";
    } else if (months === 24) {
      priceValue = calculateYearlyPrice(currentPricing[activeTab].monthly, 18, currentPricing.discounts.twoYear);
      periodLabel = "every 2 years";
    } else {
      priceValue = calculateYearlyPrice(currentPricing[activeTab].monthly, 25, currentPricing.discounts.threeYear);
      periodLabel = "every 3 years";
    }

    return (
      <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${colorTheme} hover:-translate-y-1 hover:shadow-lg bg-white flex flex-col items-center justify-center text-center cursor-pointer group`}>
        <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
        <div className="text-3xl font-bold text-slate-900 mb-1">
          {formatPrice(priceValue, currentPricing.currency)}
        </div>
        <div className="text-sm text-slate-500 font-medium mb-3">{periodLabel}</div>
        {discount && (
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
            Save {discount}%
          </span>
        )}
      </div>
    );
  };

  return (
    <section id="hosting-section" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 font-heading">Worry-Free Hosting</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-body">Secure, fast, and managed hosting options for your peace of mind.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1.5 rounded-full shadow-md border border-slate-100 inline-flex">
            {planTypes.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setActiveTab(plan.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === plan.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {plan.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Features (Left Panel) */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 lg:col-span-1">
            <h3 className="text-xl font-bold text-slate-900 mb-6 font-heading">Everything Included</h3>
            <div className="space-y-4">
              {hostingIncludedFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Options (Right Panel) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {getPricingCard('Monthly', 1, null, 'border-slate-100')}
            {getPricingCard('Yearly', 12, currentPricing.discounts.yearly, 'border-green-100 hover:border-green-300 ring-1 ring-green-50')}
            {getPricingCard('2 Year Plan', 24, currentPricing.discounts.twoYear, 'border-purple-100 hover:border-purple-300')}
            {getPricingCard('3 Year Plan', 36, currentPricing.discounts.threeYear, 'border-indigo-100 hover:border-indigo-300 bg-gradient-to-br from-indigo-50/50 to-white')}
          </div>
        </div>

      </div>
    </section>
  );
}
