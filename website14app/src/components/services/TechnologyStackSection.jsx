import { useState } from 'react';
import { technologyStack } from '../../data/servicesData';

export default function TechnologyStackSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-heading">
            Our Technical <span className="text-purple-700">Expertise</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-body">
            We leverage best-in-class technologies to build scalable, secure, and high-performance solutions.
          </p>
        </div>

        {/* Compact Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {technologyStack.categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${activeTab === index
                ? 'bg-slate-900 text-white border-slate-900 shadow-lg transform scale-105'
                : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300 hover:text-purple-700'
                }`}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 min-h-[300px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {technologyStack.categories[activeTab].skills.map((skill, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300 group"
              >
                <div className="w-10 h-10 flex items-center justify-center mb-3 filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                  <img
                    src={skill.logo}
                    alt={`${skill.name} logo`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 text-center">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Summary */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-100 pt-10">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">7+</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-medium">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">200+</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-medium">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">50+</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-medium">Experts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">24/7</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-medium">Support</div>
          </div>
        </div>

      </div>
    </section>
  );
}
