import { whyChooseReasons, inShortPoints } from '../../data/servicesData';

// Icon map
const iconMap = {
  security: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  refresh: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  bolt: "M13 10V3L4 14h7v7l9-11h-7z",
  "check-circle": "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  users: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
};

export default function WhyChooseSection() {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-heading">
            More Than Just A <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600">Website</span>.
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed font-body">
            We're a dedicated technical partner that handles the complexities so you can focus on growth.
          </p>
        </div>

        {/* Hero Quote - Redesigned */}
        <div className="relative mb-24 max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-blue-200 blur-3xl opacity-30 transform -rotate-1 rounded-3xl"></div>
          <div className="relative bg-white p-10 md:p-14 rounded-3xl shadow-xl border border-white/50">
            <div className="absolute top-0 left-0 transform -translate-x-4 -translate-y-4">
              <svg className="w-12 h-12 text-purple-200" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.896 14.321 16.067 14.929 15.513C15.538 14.959 16.326 14.682 17.294 14.682C18.261 14.682 19.056 14.959 19.679 15.513C20.301 16.067 20.613 16.896 20.613 18L20.613 21L14.017 21ZM17.294 8.78301C15.345 8.78301 13.911 9.42301 12.991 10.704C12.071 11.984 11.611 13.738 11.611 15.964L11.611 21L6 21L6 15.964C6 11.531 7.159 8.16901 9.47701 5.87701C11.796 3.58601 14.402 3 17.294 3L17.294 8.78301Z" /></svg>
            </div>
            <blockquote className="text-xl md:text-2xl font-medium text-slate-800 text-center leading-relaxed font-body">
              "Why struggle with DIY tools when you can get a professionally-built, lightning-fast mobile-first website with unlimited updates for less?"
            </blockquote>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseReasons.map((reason, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 font-body">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                <svg className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconMap[reason.icon]} />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-subheading">{reason.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm font-body">{reason.description}</p>
            </div>
          ))}

          <div className="bg-slate-900 rounded-2xl p-8 shadow-xl text-white flex flex-col justify-center relative overflow-hidden group font-body">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-subheading">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                In Short
              </h3>
              <ul className="space-y-4">
                {inShortPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-200">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
