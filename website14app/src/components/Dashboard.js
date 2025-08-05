import Link from 'next/link';

export default function Dashboard({
    userData,
    user,
    projects,
    invoices,
    tickets,
    formatDate,
    formatCurrency,
    getPackageName,
    getPriorityColor,
    getStatusColor,
    getCategoryName,
    setActiveSection
}) {
    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-jetbrains text-4xl font-bold text-black mb-2">
                    Welcome back, {userData?.name || user.email}!
                </h1>
                <p className="text-gray-600">
                    Manage your website projects and view your quotes
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <button
                    onClick={() => setActiveSection('projects')}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-black">New Project</h3>
                            <p className="text-sm text-gray-600">Start a new website project</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => setActiveSection('support')}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-black">Support Tickets</h3>
                            <p className="text-sm text-gray-600">Create and manage tickets</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => setActiveSection('projects')}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-black">Project Management</h3>
                            <p className="text-sm text-gray-600">Track project progress</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => setActiveSection('billing')}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-black">Billing</h3>
                            <p className="text-sm text-gray-600">View invoices and payments</p>
                        </div>
                    </div>
                </button>
            </div>

            {/* Recent Projects */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">Your Projects</h2>
                {projects.length > 0 ? (
                    <div className="space-y-4">
                        {projects.slice(0, 5).map((project) => (
                            <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-black">
                                            {project.businessName || 'Unnamed Project'}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Created: {formatDate(project.createdAt)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Package: {getPackageName(project.package)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Domain: {project.domain || 'Not specified'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {project.status || 'pending'}
                                        </span>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {formatCurrency(project.setupFee || 0, project.currency || 'USD')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {projects.length > 5 && (
                            <div className="text-center pt-4">
                                <button
                                    onClick={() => setActiveSection('projects')}
                                    className="text-black hover:text-gray-700 font-medium"
                                >
                                    View All Projects ({projects.length})
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">No projects yet</p>
                        <button
                            onClick={() => setActiveSection('projects')}
                            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Create Your First Project
                        </button>
                    </div>
                )}
            </div>

            {/* Recent Support Tickets */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">Recent Support Tickets</h2>
                {tickets.length > 0 ? (
                    <div className="space-y-4">
                        {tickets.slice(0, 5).map((ticket) => (
                            <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-black">
                                            {ticket.subject}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Created: {formatDate(ticket.createdAt)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Category: {getCategoryName(ticket.category)}
                                        </p>
                                        {ticket.message && (
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                {ticket.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="flex flex-col items-end space-y-2">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {tickets.length > 5 && (
                            <div className="text-center pt-4">
                                <button
                                    onClick={() => setActiveSection('support')}
                                    className="text-black hover:text-gray-700 font-medium"
                                >
                                    View All Tickets ({tickets.length})
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">No support tickets yet</p>
                        <button
                            onClick={() => setActiveSection('support')}
                            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Create First Ticket
                        </button>
                    </div>
                )}
            </div>

            {/* Pending Invoices */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-black mb-4">Pending Invoices</h2>
                {invoices.filter(invoice => invoice.status === 'pending').length > 0 ? (
                    <div className="space-y-4">
                        {invoices
                            .filter(invoice => invoice.status === 'pending')
                            .slice(0, 5)
                            .map((invoice) => (
                                <div key={invoice.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-black">
                                                {invoice.businessName || 'Unknown Business'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Invoice #{invoice.invoiceNumber || 'N/A'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Due: {formatDate(invoice.dueDate)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Package: {invoice.packageType || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Pending
                                            </span>
                                            <p className="text-sm text-gray-600 mt-2">
                                                {formatCurrency(invoice.setupFee || 0, invoice.currency || 'USD')}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Setup Fee
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        {invoices.filter(invoice => invoice.status === 'pending').length > 5 && (
                            <div className="text-center pt-4">
                                <button
                                    onClick={() => setActiveSection('billing')}
                                    className="text-black hover:text-gray-700 font-medium"
                                >
                                    View All Invoices
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">No pending invoices</p>
                        <button
                            onClick={() => setActiveSection('billing')}
                            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            View All Invoices
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
} 