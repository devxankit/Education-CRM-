
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Plus, MessageCircle, Clock, CheckCircle, ChevronRight, FileText } from 'lucide-react';

import { useParentStore } from '../../../store/parentStore';

const ParentSupportPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state || {}; // { childId, issueType } passed from other pages
    const { childId } = state;

    const tickets = useParentStore(state => state.tickets);
    const fetchTickets = useParentStore(state => state.fetchTickets);
    const isLoading = useParentStore(state => state.isLoading);
    const selectedChildId = useParentStore(state => state.selectedChildId);

    const activeChildId = childId || selectedChildId;

    const [activeTab, setActiveTab] = useState('My Tickets');

    useEffect(() => {
        if (activeChildId) {
            fetchTickets(activeChildId);
        }
    }, [activeChildId, fetchTickets]);

    const handleCreateTicket = () => {
        // Navigate to new ticket form, passing any pre-filled context
        navigate('/parent/support/new', { state: { ...state, childId: activeChildId } });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 font-medium">Checking your support tickets...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24">
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ChevronLeft size={22} className="text-gray-600" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Help Center</h1>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">

                {/* Search / FAQ Placeholder */}
                <div className="bg-indigo-600 rounded-2xl p-6 text-white text-center shadow-lg shadow-indigo-200">
                    <h2 className="text-xl font-bold mb-2">How can we help?</h2>
                    <p className="text-sm opacity-90 mb-4">Search for answers or raise a ticket.</p>
                    <button
                        onClick={handleCreateTicket}
                        className="bg-white text-indigo-700 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                        Raise New Ticket
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    {['My Tickets', 'FAQs'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Ticket List */}
                {activeTab === 'My Tickets' && (
                    <div className="space-y-3">
                        {tickets.length > 0 ? (
                            tickets.map(ticket => (
                                <div
                                    key={ticket.id}
                                    className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:border-indigo-100 transition-all cursor-pointer"
                                    onClick={() => navigate(`/parent/support/${ticket.id}`)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase tracking-wide">
                                            {ticket.category}
                                        </span>
                                        <span className={`flex items-center gap-1 text-[10px] font-bold uppercase ${ticket.status === 'Open' ? 'text-orange-600' : 'text-green-600'
                                            }`}>
                                            {ticket.status === 'Open' ? <Clock size={12} /> : <CheckCircle size={12} />}
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-1">{ticket.topic}</h3>
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                                        <span className="text-xs font-mono text-gray-400">#{ticket.id}</span>
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <span className="font-medium">{new Date(ticket.date).toLocaleDateString()}</span>
                                            <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 opacity-60">
                                <MessageCircle size={32} className="mx-auto mb-2 text-gray-400" />
                                <p className="text-sm font-bold text-gray-500">No tickets found.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* FAQ Placeholder */}
                {activeTab === 'FAQs' && (
                    <div className="space-y-2">
                        {['How to pay fees online?', 'Change contact details?', 'Apply for leave?'].map((q, i) => (
                            <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl flex justify-between items-center text-sm font-bold text-gray-700">
                                {q}
                                <ChevronRight size={16} className="text-gray-300" />
                            </div>
                        ))}
                    </div>
                )}

            </main>
        </div>
    );
};

export default ParentSupportPage;
