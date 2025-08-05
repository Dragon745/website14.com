import Link from 'next/link';
import TicketDetail from './TicketDetail';

export default function Support({
    showNewTicket,
    setShowNewTicket,
    newTicket,
    setNewTicket,
    submitting,
    handleSubmitTicket,
    tickets,
    formatDate,
    getPriorityColor,
    getStatusColor,
    getCategoryName,
    selectedTicket,
    setSelectedTicket,
    user
}) {
    // If a ticket is selected, show the ticket detail view
    if (selectedTicket) {
        return (
            <TicketDetail
                ticket={selectedTicket}
                onBack={() => setSelectedTicket(null)}
                formatDate={formatDate}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
                getCategoryName={getCategoryName}
                user={user}
            />
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-jetbrains text-4xl font-bold text-black mb-2">
                            Support Tickets
                        </h1>
                        <p className="text-gray-600">
                            Get help with your website project or billing questions
                        </p>
                    </div>
                    <button
                        onClick={() => setShowNewTicket(true)}
                        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        New Ticket
                    </button>
                </div>
            </div>

            {/* New Ticket Form */}
            {showNewTicket && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-black">Create New Ticket</h2>
                        <button
                            onClick={() => setShowNewTicket(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmitTicket} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subject *
                            </label>
                            <input
                                type="text"
                                required
                                value={newTicket.subject}
                                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                placeholder="Brief description of your issue"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={newTicket.category}
                                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                >
                                    <option value="general">General Support</option>
                                    <option value="technical">Technical Issue</option>
                                    <option value="billing">Billing Question</option>
                                    <option value="feature">Feature Request</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority
                                </label>
                                <select
                                    value={newTicket.priority}
                                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Message *
                            </label>
                            <textarea
                                required
                                rows={6}
                                value={newTicket.message}
                                onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                placeholder="Please describe your issue in detail..."
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowNewTicket(false)}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {submitting ? 'Creating...' : 'Create Ticket'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tickets List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-black mb-6">Your Support Tickets</h2>
                {tickets.length > 0 ? (
                    <div className="space-y-4">
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="border border-gray-200 rounded-lg p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="font-semibold text-black">
                                                {ticket.subject}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Category: {getCategoryName(ticket.category)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Created: {formatDate(ticket.createdAt)}
                                        </p>
                                        {ticket.message && (
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                {ticket.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex space-x-2 mt-4 md:mt-0">
                                        <button
                                            onClick={() => setSelectedTicket(ticket)}
                                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-black mb-2">No tickets yet</h3>
                        <p className="text-gray-600 mb-6">Create your first support ticket to get help</p>
                        <button
                            onClick={() => setShowNewTicket(true)}
                            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Create First Ticket
                        </button>
                    </div>
                )}
            </div>


        </div>
    );
} 