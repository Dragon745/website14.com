
import React from 'react';

export default function NewsletterCTA() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="p-8 md:p-12 lg:p-16 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 mb-8">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>

                        <h2 className="text-3xl font-bold text-slate-900 mb-4 font-heading">
                            Stay Ahead of the Curve
                        </h2>

                        <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
                            Get the latest web development tips, design trends, and company updates delivered straight to your inbox.
                        </p>

                        <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
                                required
                            />
                            <button
                                type="submit"
                                className="px-8 py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform active:scale-95 whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                        </form>

                        <p className="mt-4 text-xs text-slate-400">
                            We respect your privacy. No spam, ever.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
