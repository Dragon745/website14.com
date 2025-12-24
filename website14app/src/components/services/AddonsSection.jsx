import { addonsCategories } from '../../data/servicesData';

const iconMap = {
  'document': "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  'shopping-cart': "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
  'cog': "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
};

export default function AddonsSection({ currentPricing, formatPrice }) {
  return (
    <section id="addons-section" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 font-heading">Customize Your Experience</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-body">Scale your website with powerful add-ons as your needs grow</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {addonsCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group"
            >
              <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-purple-600 transition-colors duration-300">
                  <svg className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconMap[category.icon]} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-subheading">{category.title}</h3>
              </div>

              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 rounded-lg px-2 -mx-2 transition-colors">
                    <span className="text-slate-600 font-medium font-body">{item.name}</span>
                    <span className="font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full text-sm">
                      {formatPrice(currentPricing.addons[item.key], currentPricing.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
