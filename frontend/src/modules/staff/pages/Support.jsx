
import React, { useState } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { MessageSquare, Clock, CheckCircle, AlertCircle, Search, Filter, Send, Paperclip, ChevronLeft, MoreVertical, Lock } from 'lucide-react';

// --- MOCK DATA ---
const MOCK_TICKETS = [
    {
        id: 'T-1001', student: 'Aarav Gupta', class: '10-A', subject: 'Fee Receipt Not Received',
        status: 'Open', priority: 'High', slaDue: '2 hours',
        messages: [
            { id: 1, sender: 'Parent', text: 'I paid the fee yesterday but received no receipt. Please check.', time: '10:00 AM' },
        ]
    },
    {
        id: 'T-1002', student: 'Zara Khan', class: '8-B', subject: 'Bus Late Arrival',
        status: 'In Progress', priority: 'Medium', slaDue: '24 hours',
        messages: [
            { id: 1, sender: 'Parent', text: 'Bus 102 continues to arrive 15 mins late.', time: 'Yesterday' },
            { id: 2, sender: 'Staff', text: 'We are checking with the transport manager.', time: 'Today 9:00 AM' },
        ]
    },
    {
        id: 'T-1003', student: 'Rohan Verma', class: '12-C', subject: 'Document Verification',
        status: 'Closed', priority: 'Low', slaDue: '-',
        messages: [
            { id: 1, sender: 'Staff', text: 'Your documents are verified.', time: '2 days ago' },
        ]
    }
];

const Support = () => {
    const { user } = useStaffAuth();
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [filter, setFilter] = useState('Open'); // Open | Closed | All

    const filteredTickets = MOCK_TICKETS.filter(t => {
        if (filter === 'All') return true;
        if (filter === 'Closed') return t.status === 'Closed';
        return t.status !== 'Closed';
    });

    return (
        <div className="max-w-7xl mx-auto md:pb-6 min-h-screen relative bg-gray-50 flex flex-col md:block">

            {/* --- LIST VIEW --- */}
            <div className={`${selectedTicket ? 'hidden md:block' : 'block'}`}>
                <div className="bg-white sticky top-0 md:static z-10 px-4 pt-4 pb-2 border-b md:border-none md:bg-transparent">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Support Desk</h1>
                            <p className="text-sm text-gray-500">Manage parent queries & tickets</p>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 mb-4 flex">
                        {['Open', 'Closed', 'All'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${filter === f ? 'bg-indigo-600 text-white shadow' : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-4 md:px-0 grid grid-cols-1 gap-3 pb-20 md:pb-0">
                    {filteredTickets.map(ticket => (
                        <TicketCard
                            key={ticket.id}
                            ticket={ticket}
                            onClick={() => setSelectedTicket(ticket)}
                        />
                    ))}
                    {filteredTickets.length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                            <MessageSquare className="mx-auto mb-2 opacity-30" size={48} />
                            No tickets found.
                        </div>
                    )}
                </div>
            </div>

            {/* --- DETAIL VIEW (Overlay on Mobile, Side on Desktop - Simplified to replace list on mobile for now) --- */}
            {selectedTicket && (
                <div className="fixed inset-0 z-30 bg-white md:bg-transparent md:static md:inset-auto flex flex-col md:h-[calc(100vh-100px)]">
                    <TicketDetail
                        ticket={selectedTicket}
                        onBack={() => setSelectedTicket(null)}
                    />
                </div>
            )}
        </div>
    );
};

// --- SUB COMPONENTS ---

const TicketCard = ({ ticket, onClick }) => {
    const isHighPriority = ticket.priority === 'High';
    const slaWarning = ticket.slaDue.includes('hours') && parseInt(ticket.slaDue) < 4;

    return (
        <div onClick={onClick} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm active:scale-[0.99] transition-transform cursor-pointer">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{ticket.id} • {ticket.class}</span>
                    <h3 className="font-bold text-gray-900 leading-tight mt-0.5">{ticket.subject}</h3>
                </div>
                {ticket.status !== 'Closed' && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isHighPriority ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {ticket.priority}
                    </span>
                )}
            </div>

            <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                <span className="font-semibold text-gray-700">{ticket.student}:</span> {ticket.messages[ticket.messages.length - 1].text}
            </p>

            <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-xs font-bold ${ticket.status === 'Open' ? 'text-green-600' : 'text-gray-500'}`}>
                        {ticket.status === 'Open' ? <Clock size={12} /> : <CheckCircle size={12} />}
                        {ticket.status}
                    </span>
                </div>
                {ticket.status !== 'Closed' && (
                    <span className={`text-[10px] font-bold flex items-center gap-1 ${slaWarning ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                        SLA: {ticket.slaDue}
                    </span>
                )}
            </div>
        </div>
    );
};

const TicketDetail = ({ ticket, onBack }) => {
    const [replyText, setReplyText] = useState('');
    const [isInternal, setIsInternal] = useState(false);

    return (
        <div className="flex flex-col h-full bg-gray-50 md:rounded-xl md:border md:border-gray-200 md:shadow-lg md:overflow-hidden">
            {/* Header */}
            <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-3 shadow-sm z-10">
                <button onClick={onBack} className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 leading-tight line-clamp-1">{ticket.subject}</h2>
                    <p className="text-xs text-gray-500">{ticket.id} • {ticket.student}</p>
                </div>
                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                    <MoreVertical size={20} />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {ticket.messages.map((msg) => {
                    const isStaff = msg.sender === 'Staff';
                    return (
                        <div key={msg.id} className={`flex ${isStaff ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${isStaff
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                }`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <p className={`text-[10px] mt-1 text-right ${isStaff ? 'text-indigo-200' : 'text-gray-400'}`}>{msg.time}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Action Bar */}
            {ticket.status !== 'Closed' ? (
                <div className="bg-white p-3 border-t border-gray-200">
                    {/* Internal Note Toggle */}
                    <div className="flex items-center gap-2 mb-2 px-1">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-500 cursor-pointer select-none">
                            <div
                                onClick={() => setIsInternal(!isInternal)}
                                className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isInternal ? 'bg-amber-400' : 'bg-gray-300'}`}
                            >
                                <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${isInternal ? 'translate-x-4' : ''}`}></div>
                            </div>
                            {isInternal ? <span className="text-amber-600 flex items-center gap-1"><Lock size={10} /> Internal Note</span> : 'Public Reply'}
                        </label>
                    </div>

                    {/* Input */}
                    <div className={`flex items-end gap-2 p-2 rounded-xl border transition-colors ${isInternal ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
                            <Paperclip size={20} />
                        </button>
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={isInternal ? "Add internal note (visible to staff only)..." : "Type reply to parent..."}
                            className="flex-1 bg-transparent border-none outline-none text-sm max-h-24 resize-none py-2"
                            rows={1}
                        />
                        <button
                            className={`p-2 rounded-xl shadow-sm transition-all ${replyText.trim()
                                    ? (isInternal ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white')
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-100 p-4 text-center border-t border-gray-200">
                    <p className="text-sm font-bold text-gray-500 flex items-center justify-center gap-2">
                        <CheckCircle size={16} /> This ticket is closed.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Support;