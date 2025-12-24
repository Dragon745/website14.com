import { featureComparison } from '../../data/servicesData';

export default function FeatureComparison({ currentPricing, formatPrice }) {
  const renderCellContent = (value, row) => {
    if (value === "-") {
      return <span className="text-slate-300 font-light">—</span>;
    }

    // Handle pricing values
    if (row.isPricing && value) {
      // If value matches a key in currentPricing.addons, use it
      if (currentPricing && currentPricing.addons && currentPricing.addons[value] !== undefined) {
        return formatPrice(currentPricing.addons[value], currentPricing.currency);
      }
      // Fallback if not found (or if logic differs)
      return value;
    }

    if (row.highlight && value) {
      return <span className="font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">{value}</span>;
    }

    return <span className="font-medium text-slate-700">{value}</span>;
  };

  return (
    <section className="py-24 bg-white px-4 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-heading">Complete Feature Comparison</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-body">Detailed breakdown of what's included in each plan</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {featureComparison.headers.map((header, index) => (
                    <th
                      key={index}
                      className={`px-6 py-5 text-left text-sm font-bold text-slate-900 uppercase tracking-wider whitespace-nowrap ${index === 0 ? 'bg-slate-50 sticky left-0 z-10 shadow-sm md:shadow-none' : ''}`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {featureComparison.rows.map((row, index) => (
                  <tr
                    key={index}
                    className={`group transition-colors duration-200 hover:bg-purple-50/50`}
                  >
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-slate-900 bg-white group-hover:bg-purple-50/50 sticky left-0 z-10 shadow-sm md:shadow-none transition-colors border-r border-slate-100 md:border-none">
                      {row.feature}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600">
                      {renderCellContent(row.static, row)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600">
                      {renderCellContent(row.dynamic, row)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600">
                      {renderCellContent(row.ecommerce, row)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
