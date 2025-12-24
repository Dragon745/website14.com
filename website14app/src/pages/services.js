import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useServicesLogic } from '../hooks/useServicesLogic';
import {
  HeroSection,
  ServicesGrid,
  WhyChooseSection,
  TechnologyStackSection,
  TestimonialsSection,
  FeatureComparison,
  AddonsSection,
  AdditionalFeaturesSection,
  HostingPlansSection,
  EmailHostingSection,
  FinalCTA
} from '../components/services';

export default function Services() {
  const {
    selectedCurrency,
    setSelectedCurrency,
    isLoading,
    currentPricing,
    handlePackageSelection,
    formatPrice,
    pricingData
  } = useServicesLogic();

  return (
    <>
      <SEO
        title="Professional Website Development Services - Website14"
        description="Get a professional, mobile-first website with unlimited updates for less than DIY platforms. Trusted by 500+ businesses. Start from $59 setup + $5/month."
        keywords="web development services, website design, custom websites, static websites, dynamic websites, e-commerce development, professional web design"
        url="https://website14.com/services"
        type="website"
      />

      <div className="bg-white text-slate-900 font-sans min-h-screen flex flex-col">
        <Header />

        {/* Floating Currency Selector */}
        <div className="fixed top-20 right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-medium">Currency</span>
              <select
                value={selectedCurrency || ''}
                onChange={(e) => setSelectedCurrency(e.target.value || null)}
                className="text-xs border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-800"
              >
                <option value="">Auto</option>
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="CAD">CAD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="SAR">SAR</option>
                <option value="AED">AED</option>
                <option value="QAR">QAR</option>
                <option value="KWD">KWD</option>
                <option value="BHD">BHD</option>
                <option value="OMR">OMR</option>
              </select>
              {selectedCurrency && (
                <button
                  onClick={() => setSelectedCurrency(null)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                  title="Reset to auto-detect"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <HeroSection
            isLoading={isLoading}
            pricingData={pricingData}
            onPackageSelection={handlePackageSelection}
          />

          <ServicesGrid
            currentPricing={currentPricing}
            formatPrice={formatPrice}
            onPackageSelection={handlePackageSelection}
          />

          <WhyChooseSection />



          <TestimonialsSection />

          <FeatureComparison
            currentPricing={currentPricing}
            formatPrice={formatPrice}
          />

          <AddonsSection
            currentPricing={currentPricing}
            formatPrice={formatPrice}
          />

          <AdditionalFeaturesSection
            currentPricing={currentPricing}
            formatPrice={formatPrice}
          />

          <HostingPlansSection
            currentPricing={currentPricing}
            formatPrice={formatPrice}
          />

          <EmailHostingSection
            currentPricing={currentPricing}
            formatPrice={formatPrice}
          />

          <FinalCTA onPackageSelection={handlePackageSelection} />
        </div>

        <TechnologyStackSection />
        <Footer />
      </div>
    </>
  );
}