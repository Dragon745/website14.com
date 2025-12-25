
import { useState, useMemo } from 'react';
import { faqData } from '../../data/faqData';

export default function FAQList({ searchQuery }) {
    const [activeQuestion, setActiveQuestion] = useState(null);

    const toggleQuestion = (id) => {
        setActiveQuestion(activeQuestion === id ? null : id);
    };

    // Filter logic
    const filteredData = useMemo(() => {
        if (!searchQuery) return faqData;

        const lowerQuery = searchQuery.toLowerCase();

        return faqData.map(category => {
            // Check if category matches
            const categoryMatches = category.category.toLowerCase().includes(lowerQuery);

            // Filter items
            const matchingItems = category.items.filter(item =>
                item.question.toLowerCase().includes(lowerQuery) ||
                item.answer.toLowerCase().includes(lowerQuery)
            );

            // Return category if it matches or has matching items
            if (categoryMatches || matchingItems.length > 0) {
                return {
                    ...category,
                    items: categoryMatches ? category.items : matchingItems
                };
            }
            return null;
        }).filter(Boolean);
    }, [searchQuery]);

    if (filteredData.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No results found</h3>
                <p className="text-slate-600">Try adjusting your search terms or browse the categories below.</p>
            </div>
        )
    }

    return (
        <section className="py-16 md:py-24 bg-white min-h-[600px]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {filteredData.map((category, catIndex) => (
                    <div key={catIndex} className="mb-16 last:mb-0">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">{category.category}</h2>
                        {category.description && (
                            <p className="text-slate-500 mb-8 font-body">{category.description}</p>
                        )}

                        <div className="space-y-4">
                            {category.items.map((faq, index) => {
                                const uniqueId = `${catIndex}-${index}`;
                                const isOpen = activeQuestion === uniqueId;

                                return (
                                    <div
                                        key={index}
                                        className={`border rounded-2xl transition-all duration-300 ${isOpen ? 'border-purple-200 bg-purple-50/30' : 'border-slate-200 bg-white hover:border-purple-100'}`}
                                    >
                                        <button
                                            onClick={() => toggleQuestion(uniqueId)}
                                            className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 focus:outline-none"
                                        >
                                            <span className={`font-semibold text-lg transition-colors ${isOpen ? 'text-purple-800' : 'text-slate-900'}`}>
                                                {faq.question}
                                            </span>
                                            <span className={`flex-shrink-0 mt-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                                <svg className={`w-5 h-5 ${isOpen ? 'text-purple-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </span>
                                        </button>

                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                        >
                                            <div className="px-6 pb-6 text-slate-600 leading-relaxed font-body">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

            </div>
        </section>
    );
}
