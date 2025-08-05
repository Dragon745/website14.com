import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function TicketDetail({
    ticket,
    onBack,
    formatDate,
    getPriorityColor,
    getStatusColor,
    getCategoryName,
    user
}) {
    const [responses, setResponses] = useState([]);
    const [newResponse, setNewResponse] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (ticket) {
            fetchTicketResponses();
        }
    }, [ticket]);

    const fetchTicketResponses = async () => {
        if (!ticket?.id) return;

        try {
            const q = query(
                collection(db, 'ticketResponses'),
                where('ticketId', '==', ticket.id),
                orderBy('createdAt', 'asc')
            );
            const querySnapshot = await getDocs(q);
            const responsesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setResponses(responsesData);
        } catch (error) {
            console.error('Error fetching ticket responses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitResponse = async (e) => {
        e.preventDefault();
        if (!newResponse.trim() || !ticket?.id) return;

        setSubmitting(true);
        try {
            const responseData = {
                ticketId: ticket.id,
                userId: user.uid,
                userEmail: user.email,
                message: newResponse.trim(),
                isAdmin: false,
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'ticketResponses'), responseData);
            setNewResponse('');
            await fetchTicketResponses(); // Refresh responses
        } catch (error) {
            console.error('Error submitting response:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!ticket) {
        return (
            <div className="animate-fadeIn">
                <div className="text-center py-12">
                    <p className="text-gray-600">Ticket not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <button
                            onClick={onBack}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Back to Tickets</span>
                        </button>
                        <h1 className="font-jetbrains text-4xl font-bold text-black mb-2">
                            {ticket.subject}
                        </h1>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Created: {formatDate(ticket.createdAt)}</span>
                            <span>Category: {getCategoryName(ticket.category)}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                {ticket.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ticket Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-bold text-black mb-4">Ticket Details</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-black mb-2">Subject</h3>
                        <p className="text-gray-700">{ticket.subject}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-black mb-2">Message</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 whitespace-pre-wrap">{ticket.message}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Responses */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-bold text-black mb-4">Responses</h2>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                        <p className="text-gray-600 mt-2">Loading responses...</p>
                    </div>
                ) : responses.length > 0 ? (
                    <div className="space-y-6">
                        {responses.map((response) => (
                            <div key={response.id} className={`border-l-4 p-4 ${response.isAdmin ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${response.isAdmin ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {response.isAdmin ? 'Support Team' : 'You'}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {formatDate(response.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-gray-700 whitespace-pre-wrap">
                                    {response.message}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600">No responses yet</p>
                    </div>
                )}
            </div>

            {/* Add Response */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-black mb-4">Add Response</h2>
                <form onSubmit={handleSubmitResponse} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Response
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={newResponse}
                            onChange={(e) => setNewResponse(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Type your response here..."
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting || !newResponse.trim()}
                            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Sending...' : 'Send Response'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 