export default function Billing({
    selectedCurrency,
    setSelectedCurrency,
    userLocation,
    effectiveCurrency,
    getCurrentPricing,
    formatPrice,
    setActiveSection,
    invoices,
    formatDate,
    formatCurrency
}) {
    // Debug logging
    console.log('Billing component: invoices prop received:', invoices);
    console.log('Billing component: invoices length:', invoices?.length);
    console.log('Billing component: invoices type:', typeof invoices);
    console.log('Billing component: invoices is array:', Array.isArray(invoices));

    return (
        <div className="animate-fadeIn">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-jetbrains text-4xl font-bold text-black mb-2">
                            Billing & Payments
                        </h1>
                        <p className="text-gray-600">
                            View your invoices and manage payments
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Currency:</span>
                            <select
                                value={selectedCurrency || ''}
                                onChange={(e) => setSelectedCurrency(e.target.value || null)}
                                className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-black"
                            >
                                <option value="">Auto ({userLocation?.currency || 'USD'})</option>
                                <option value="USD">USD ($)</option>
                                <option value="INR">INR (₹)</option>
                                <option value="CAD">CAD (C$)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="SAR">SAR</option>
                                <option value="AED">AED</option>
                                <option value="QAR">QAR</option>
                                <option value="KWD">KWD</option>
                                <option value="BHD">BHD</option>
                                <option value="OMR">OMR</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-black mb-6">Your Invoices</h2>
                {invoices && invoices.length > 0 ? (
                    <div className="space-y-4">
                        {invoices.map((invoice, index) => (
                            <div
                                key={invoice.id || index}
                                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-black">{invoice.businessName || 'Unknown Business'}</h3>
                                        <p className="text-sm text-gray-600">Invoice #{invoice.invoiceNumber || 'N/A'}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                                            invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {(invoice.status || 'pending').charAt(0).toUpperCase() + (invoice.status || 'pending').slice(1)}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Domain</p>
                                        <p className="font-medium text-black">{invoice.domain || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Package</p>
                                        <p className="font-medium text-black">{invoice.packageType || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Created</p>
                                        <p className="font-medium text-black">{formatDate(invoice.createdAt) || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-600">Setup Fee</p>
                                            <p className="text-lg font-bold text-black">
                                                {formatCurrency(invoice.setupFee || 0, invoice.currency || 'USD')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Monthly Fee</p>
                                            <p className="text-lg font-bold text-black">
                                                {formatCurrency(invoice.monthlyFee || 0, invoice.currency || 'USD')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Due Date</p>
                                            <p className="text-sm font-medium text-black">
                                                {formatDate(invoice.dueDate) || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-black mb-2">No invoices yet</h3>
                        <p className="text-gray-600 mb-6">Create a new project to generate your first invoice.</p>
                        <div className="space-y-3">
                            <button
                                onClick={() => setActiveSection('projects')}
                                className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Create New Project
                            </button>
                            <div className="text-xs text-gray-500">
                                Debug: Check browser console for invoice data logs
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Pricing Information */}
            <div className="bg-gray-50 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-black mb-4">Current Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold text-black mb-2">Static Website</h4>
                        <p className="text-2xl font-bold text-black mb-1">
                            {formatPrice(getCurrentPricing().static.setup, effectiveCurrency || 'USD')}
                        </p>
                        <p className="text-sm text-gray-600">Setup + {formatPrice(getCurrentPricing().static.monthly, effectiveCurrency || 'USD')}/month</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold text-black mb-2">Dynamic Website</h4>
                        <p className="text-2xl font-bold text-black mb-1">
                            {formatPrice(getCurrentPricing().dynamic.setup, effectiveCurrency || 'USD')}
                        </p>
                        <p className="text-sm text-gray-600">Setup + {formatPrice(getCurrentPricing().dynamic.monthly, effectiveCurrency || 'USD')}/month</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold text-black mb-2">E-commerce</h4>
                        <p className="text-2xl font-bold text-black mb-1">
                            {formatPrice(getCurrentPricing().ecommerce.setup, effectiveCurrency || 'USD')}
                        </p>
                        <p className="text-sm text-gray-600">Setup + {formatPrice(getCurrentPricing().ecommerce.monthly, effectiveCurrency || 'USD')}/month</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 