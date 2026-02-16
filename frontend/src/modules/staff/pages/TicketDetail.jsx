import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, CheckCircle, Clock, MoreVertical, Lock, User, AlertCircle, MessageSquare } from 'lucide-react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { useStaffStore } from '../../../store/staffStore';

const TicketDetail = () => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const { user } = useStaffAuth();

    const tickets = useStaffStore(state => state.tickets);
    const fetchTickets = useStaffStore(state => state.fetchTickets);
    const respondToTicketAction = useStaffStore(state => state.respondToTicketAction);
    const updateTicketAction = useStaffStore(state => state.updateTicketAction);

    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [resolutionNote, setResolutionNote] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            if (tickets.length === 0) {
                setLoading(true);
                await fetchTickets();
                setLoading(false);
            }
            const found = tickets.find(t => t.id === ticketId || t._id === ticketId);
            if (found) {
                setTicket(found);

                // Map Model details/response to message format
                const msgs = [];
                // Original request
                msgs.push({
                    id: 'orig',
                    sender: found.raisedBy ? (found.raisedBy.firstName ? `${found.raisedBy.firstName} (${found.raisedByType || 'Student'})` : `${found.raisedBy.name} (${found.raisedByType || 'Parent'})`) : (found.studentId ? `${found.studentId.firstName} (Student)` : 'Requester'),
                    type: 'customer',
                    message: found.details,
                    time: new Date(found.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });

                // Staff response if exists
                if (found.response) {
                    msgs.push({
                        id: 'resp',
                        sender: found.respondedBy ? `${found.respondedBy.firstName || found.respondedBy.name || 'Staff'} (${found.onModel || found.respondedBy.role || 'Staff'})` : 'Official Support',
                        type: 'staff',
                        message: found.response,
                        time: found.respondedAt ? new Date(found.respondedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'
                    });
                }
                setMessages(msgs);
            }
            setLoading(false);
        };
        load();
    }, [ticketId, tickets, fetchTickets]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (messages.length > 0) scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !ticket) return;

        try {
            await respondToTicketAction(ticket._id || ticket.id, newMessage, 'Resolved');
            setNewMessage('');
            await fetchTickets(); // Refresh
        } catch (err) {
            alert("Failed to send response");
        }
    };

    const confirmResolve = async () => {
        if (!resolutionNote.trim() || !ticket) return;
        try {
            await respondToTicketAction(ticket._id || ticket.id, resolutionNote, 'Closed');
            setShowResolveModal(false);
            setResolutionNote('');
            await fetchTickets();
        } catch (err) {
            alert("Failed to resolve ticket");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-red-50 text-red-600 border-red-100';
            case 'In-Progress': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Closed': return 'bg-gray-50 text-gray-600 border-gray-100';
            default: return 'bg-gray-50 text-gray-500';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'Urgent': return <AlertCircle size={10} className="text-red-600" />;
            case 'High': return <AlertCircle size={10} className="text-red-500" />;
            case 'Normal': return <Clock size={10} className="text-amber-500" />;
            case 'Low': return <CheckCircle size={10} className="text-blue-500" />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-500 font-medium">Loading ticket details...</p>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="max-w-3xl mx-auto p-10 text-center">
                <p className="text-red-600 font-bold text-lg">Ticket not found</p>
                <button
                    onClick={() => navigate('/staff/support')}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
                >
                    ← Back to Helpdesk
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50/50">
            {/* Top Navigation */}
            <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-40 sticky top-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/staff/support')} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-black text-gray-900 tracking-tight">{ticket.topic}</h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(ticket.status)}`}>
                                {ticket.status}
                            </span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-bold flex items-center gap-2 mt-0.5">
                            REF: {ticketId.toUpperCase().slice(-10)}
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            {new Date(ticket.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-gray-100 shadow-sm">
                        {getPriorityIcon(ticket.priority)}
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{ticket.priority} Priority</span>
                    </div>
                    {ticket.status !== 'Closed' && ticket.status !== 'Resolved' && (
                        <button
                            onClick={() => setShowResolveModal(true)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-95"
                        >
                            Complete Ticket
                        </button>
                    )}
                </div>
            </header>

            <main className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1600px] mx-auto w-full">
                {/* Formal Content Column */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">

                    {/* 1. Original Request Card */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="px-8 py-5 bg-indigo-50/30 border-b border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-indigo-600">
                                <MessageSquare size={16} />
                                <h2 className="text-xs font-black uppercase tracking-widest leading-none">Initial {ticket.raisedByType || 'Student'} Request</h2>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{new Date(ticket.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <div className="p-8">
                            <div className="flex gap-4 mb-6">
                                <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 shrink-0">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900 leading-none">
                                        {ticket.raisedBy ? (ticket.raisedBy.firstName ? `${ticket.raisedBy.firstName} ${ticket.raisedBy.lastName || ''}` : ticket.raisedBy.name) : (ticket.studentId ? `${ticket.studentId.firstName} ${ticket.studentId.lastName}` : 'Anonymous')}
                                        <span className="ml-2 px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded">{ticket.raisedByType || 'Student'}</span>
                                    </p>
                                    <p className="text-[11px] font-bold text-gray-400 mt-1">
                                        {ticket.raisedByType === 'Parent' && ticket.studentId ? `Parent of ${ticket.studentId.firstName}` : 'Sender Identity Verified'}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 italic">
                                <p className="text-sm text-gray-700 leading-relaxed font-medium">"{ticket.details}"</p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Staff Responses / Thread Section */}
                    {ticket.response && (
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                            <div className="px-8 py-5 bg-emerald-50/30 border-b border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-emerald-600">
                                    <CheckCircle size={16} />
                                    <h2 className="text-xs font-black uppercase tracking-widest">Official Staff Response</h2>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    {ticket.respondedAt ? new Date(ticket.respondedAt).toLocaleTimeString() : '-'}
                                </span>
                            </div>
                            <div className="p-8">
                                <div className="flex gap-4 mb-6">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-100">
                                        <Lock size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900">
                                            {ticket.respondedBy ? (ticket.respondedBy.firstName ? `${ticket.respondedBy.firstName} ${ticket.respondedBy.lastName || ''}` : ticket.respondedBy.name) : 'Authorized Personnel'}
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="text-[10px] font-black text-emerald-600 uppercase">{ticket.onModel || 'Staff'} Response</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span className="text-[10px] font-bold text-gray-400">Verified Personnel</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-inner">
                                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{ticket.response}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. Action / Reply Area */}
                    {ticket.status !== 'Closed' && ticket.status !== 'Resolved' && (
                        <div className="bg-white rounded-[2rem] border-2 border-dashed border-indigo-100 p-1 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                            <form onSubmit={handleSend} className="bg-white rounded-[1.8rem] p-6">
                                <div className="flex items-center gap-2 mb-4 px-2">
                                    <Send size={14} className="text-indigo-600" />
                                    <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Submit New Official Response</h3>
                                </div>
                                <textarea
                                    rows={5}
                                    placeholder="Provide a detailed, professional response to the student's request..."
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 text-sm outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all resize-none shadow-inner"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                />
                                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                                    <p className="text-[10px] text-gray-400 font-bold max-w-[70%]">
                                        Note: This response will be visible to the student immediately. Ensure language is professional and accurate.
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:shadow-none"
                                    >
                                        Post Response
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Completion Message */}
                    {(ticket.status === 'Closed' || ticket.status === 'Resolved') && !ticket.response && (
                        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 border border-emerald-100">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Case Marked as {ticket.status}</h3>
                            <p className="text-sm text-gray-500 max-w-sm">
                                This support ticket has been officially concluded. No further responses are required unless the student re-opens the query.
                            </p>
                        </div>
                    )}
                </div>

                {/* Sidebar - Simplified */}
                <aside className="hidden lg:block w-[22rem] p-8 border-l border-gray-100 bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.02)] overflow-y-auto">
                    <div className="space-y-8 sticky top-0">
                        {/* Student Profile Overview */}
                        <section>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Subject Information</h3>
                            <div className="p-6 bg-[#F9FAFF] rounded-[2rem] border border-indigo-50 relative group">
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl shadow-sm border border-indigo-50 flex items-center justify-center text-indigo-600">
                                    <User size={20} />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[9px] font-black text-indigo-400 uppercase">Student Name</p>
                                        <p className="text-sm font-black text-gray-900 mt-1">
                                            {ticket.studentId ? `${ticket.studentId.firstName} ${ticket.studentId.lastName}` : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase">Admission ID</p>
                                            <p className="text-xs font-bold text-gray-700 mt-1">{ticket.studentId?.admissionNo || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase">Grade / Section</p>
                                            <p className="text-xs font-bold text-gray-700 mt-1">
                                                {ticket.studentId?.classId?.name || '-'}{ticket.studentId?.sectionId?.name || ''}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/staff/students/${ticket.studentId?._id}`)}
                                        className="w-full bg-white hover:bg-gray-900 hover:text-white border border-gray-100 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                                    >
                                        Official Profile
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-5">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Classification</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center group">
                                    <span className="text-[11px] text-gray-400 font-bold uppercase">Topic Category</span>
                                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{ticket.category}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">Wait Duration</span>
                                    <span className="text-xs font-black text-gray-700 italic">
                                        {Math.floor((new Date() - new Date(ticket.createdAt)) / (1000 * 60 * 60))} Hours
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">Escalation Status</span>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${ticket.priority === 'Urgent' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
                                        {ticket.priority === 'Urgent' ? 'Active' : 'Routine'}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <section className="bg-gray-900 p-6 rounded-[2rem] text-white shadow-xl shadow-gray-200">
                            <div className="flex items-center gap-2 mb-3 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                                <CheckCircle size={14} /> Security Audit
                            </div>
                            <p className="text-[10px] text-gray-400 leading-relaxed font-bold">
                                All responses are logged and tied to your staff account ID. Unprofessional behavior may lead to disciplinary action.
                            </p>
                        </section>
                    </div>
                </aside>
            </main>

            {/* Resolve Modal */}
            {showResolveModal && (
                <div className="fixed inset-0 bg-gray-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl shadow-indigo-200/50 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 text-center">
                            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto mb-8 border border-emerald-100 rotate-3">
                                <CheckCircle size={36} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Complete Ticket</h3>
                            <p className="text-sm text-gray-500 mb-8 font-medium">Please provide a concise resolution summary before officially closing this inquiry.</p>

                            <textarea
                                value={resolutionNote}
                                onChange={(e) => setResolutionNote(e.target.value)}
                                placeholder="Final resolution notes..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] p-5 text-sm focus:ring-4 focus:ring-emerald-50 focus:bg-white outline-none h-32 resize-none transition-all shadow-inner"
                            ></textarea>
                        </div>

                        <div className="bg-gray-50/50 p-8 flex gap-4">
                            <button onClick={() => setShowResolveModal(false)} className="flex-1 px-6 py-4 text-[11px] font-black uppercase text-gray-400 hover:text-gray-600 transition-all">
                                Cancel
                            </button>
                            <button
                                onClick={confirmResolve}
                                disabled={!resolutionNote.trim()}
                                className="flex-1 px-6 py-4 text-[11px] font-black uppercase bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-600 disabled:opacity-50 transition-all active:scale-95"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketDetail;
