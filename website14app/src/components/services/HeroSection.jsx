import Link from 'next/link';
import AnimatedCounter from '../AnimatedCounter';
import { trustIndicators } from '../../data/servicesData';

export default function HeroSection({
  isLoading,
  pricingData,
  onPackageSelection
}) {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <div className="inline-flex items-center bg-slate-50 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-slate-200">
              <span className="w-2 h-2 bg-purple-800 rounded-full mr-2 animate-pulse"></span>
              Trusted by 500+ Businesses Worldwide
            </div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              Professional Websites
              <span className="text-purple-800 block">That Convert</span>
            </h1>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed font-body">
              Get a custom-built, mobile-first website with unlimited updates for less than DIY platforms.
              <span className="font-semibold text-slate-900"> No templates. No compromises.</span>
            </p>
            {isLoading && pricingData && (
              <div className="mb-4 text-sm text-purple-800">
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating prices from database...
                </span>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-6">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Free Consultation</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">30-Day Guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Unlimited Updates</span>
              </div>
            </div>
            <Link href="/client?section=projects&package=dynamicSetup" passHref legacyBehavior>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  onPackageSelection('dynamicSetup');
                }}
                className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-900 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block text-center cursor-pointer"
              >
                Get Your Free Quote Now
              </a>
            </Link>
          </div>

          {/* Right Column - Trust Indicators Card */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <h3 className="font-subheading text-lg font-semibold text-slate-900 mb-6 text-center">Why Businesses Trust Us</h3>
            <div className="grid grid-cols-2 gap-6">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="text-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  {indicator.static ? (
                    <div className="font-heading text-3xl lg:text-4xl font-bold text-purple-800 mb-2">{indicator.static}</div>
                  ) : (
                    <AnimatedCounter
                      target={indicator.value}
                      suffix={indicator.suffix}
                      duration={indicator.duration}
                      className="font-heading text-3xl lg:text-4xl font-bold text-purple-800 mb-2"
                    />
                  )}
                  <div className="text-sm text-slate-600 font-medium">{indicator.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
