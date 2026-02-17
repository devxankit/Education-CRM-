
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '@/app/api';
import { ChevronLeft, Info, HelpCircle, Mail, MapPin, Phone, Plus, Tag } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTeacherStore } from '../../../store/teacherStore';

const TeacherHelpPage = () => {
    const navigate = useNavigate();
    const token = useTeacherStore((s) => s.token);
    const profile = useTeacherStore((s) => s.profile);
    const fetchProfile = useTeacherStore((s) => s.fetchProfile);
    const myTickets = useTeacherStore((s) => s.myTickets) || [];
    const fetchMyTickets = useTeacherStore((s) => s.fetchMyTickets);
    const createMyTicket = useTeacherStore((s) => s.createMyTicket);
    const isFetchingMyTickets = useTeacherStore((s) => s.isFetchingMyTickets);
    const [viewMode, setViewMode] = useState('faq'); // 'faq' | 'tickets'
    const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
    const [faqData, setFaqData] = useState([]);
    const [faqLoading, setFaqLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [ticketForm, setTicketForm] = useState({ category: 'General', topic: '', details: '' });

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        fetchMyTickets();
    }, [fetchMyTickets]);

    useEffect(() => {
        if (!token) {
            setFaqLoading(false);
            return;
        }
        axios
            .get(`${API_URL}/faq/public`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                if (res.data?.success && Array.isArray(res.data.data)) {
                    setFaqData(res.data.data.map((f) => ({ question: f.question, answer: f.answer })));
                }
            })
            .catch(() => setFaqData([]))
            .finally(() => setFaqLoading(false));
    }, [token]);

    const FAQItem = ({ question, answer }) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:border-indigo-100 transition-all"
            >
                <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium transition-colors ${isOpen ? 'text-indigo-700 font-bold' : 'text-gray-700'}`}>
                        {question}
                    </span>
                    <ChevronLeft size={16} className={`transition-transform duration-300 text-gray-400 ${isOpen ? '-rotate-90 text-indigo-500' : 'rotate-180'}`} />
                </div>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <p className="pt-3 text-xs text-gray-500 leading-relaxed border-t border-gray-50 mt-3">
                                {answer}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    const handleRaiseTicket = async (e) => {
        e.preventDefault();
        if (!ticketForm.topic?.trim() || !ticketForm.details?.trim()) return;
        setSubmitLoading(true);
        try {
            const result = await createMyTicket({
                category: ticketForm.category,
                topic: ticketForm.topic.trim(),
                details: ticketForm.details.trim(),
            });
            if (result.success) {
                setTicketForm({ category: 'General', topic: '', details: '' });
                setIsRaiseModalOpen(false);
                setViewMode('tickets');
            } else {
                alert(result.message || 'Failed to create ticket');
            }
        } catch {
            alert('Failed to create ticket');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Help & Support</h1>
                </div>
            </div>

            <main className="max-w-md mx-auto px-4 pt-6">

                {/* View Switcher Tabs */}
                <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm mb-6">
                    <button
                        onClick={() => setViewMode('faq')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${viewMode === 'faq' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        FAQ & Help
                    </button>
                    <button
                        onClick={() => setViewMode('tickets')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${viewMode === 'tickets' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        My Tickets
                        <span className={`text-[10px] px-1.5 rounded-full ${viewMode === 'tickets' ? 'bg-white text-gray-900' : 'bg-red-100 text-red-600'}`}>
                            {myTickets.filter(t => t.status === 'Open').length}
                        </span>
                    </button>
                </div>

                {viewMode === 'faq' ? (
                    <>
                        <section className="mb-8">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Contact Administration</h2>
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">Admin Office {profile?.branchId?.name && `(${profile.branchId.name})`}</h3>
                                        <p className="text-xs text-gray-500">{profile?.branchId?.phone || profile?.instituteId?.phone || '—'}</p>
                                    </div>
                                </div>
                                <div className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">Email Support {profile?.branchId?.name && `(${profile.branchId.name})`}</h3>
                                        <p className="text-xs text-gray-500">{profile?.branchId?.email || profile?.instituteId?.email || '—'}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="mb-20">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Common FAQs</h2>
                            {faqLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : faqData.length === 0 ? (
                                <p className="text-sm text-gray-500 py-4">No FAQs available.</p>
                            ) : (
                                <div className="space-y-3">
                                    {faqData.map((faq, i) => (
                                        <FAQItem key={i} question={faq.question} answer={faq.answer} />
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                ) : (
                    <div className="space-y-3 mb-20">
                        {isFetchingMyTickets ? (
                            <div className="flex justify-center py-12">
                                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : myTickets.length === 0 ? (
                            <p className="text-sm text-gray-500 py-8 text-center">No tickets raised yet.</p>
                        ) : (
                            myTickets.map(ticket => (
                                <div key={ticket._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{ticket.category}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ticket.status === 'Open' || ticket.status === 'In-Progress' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-1">{ticket.topic}</h3>
                                    <p className="text-xs text-gray-400 flex items-center gap-1">
                                        <Info size={12} /> Ref: {ticket._id?.slice(-8)} • {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : ''}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* FAB */}
                <div className="fixed bottom-6 right-6 z-30">
                    <button
                        onClick={() => setIsRaiseModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                        <Plus size={20} /> Raise Ticket
                    </button>
                </div>

                {/* Raise Ticket Modal */}
                <AnimatePresence>
                    {isRaiseModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
                                onClick={() => setIsRaiseModalOpen(false)}
                            />
                            <motion.div
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 relative z-10 pointer-events-auto max-h-[90vh] overflow-y-auto"
                            >
                                <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Raise Support Ticket</h2>

                                <form onSubmit={handleRaiseTicket} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                        <select
                                            value={ticketForm.category}
                                            onChange={(e) => setTicketForm((p) => ({ ...p, category: e.target.value }))}
                                            className="w-full p-3 bg-gray-50 border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        >
                                            <option value="General">General Inquiry</option>
                                            <option value="IT Support">IT Support</option>
                                            <option value="HR & Payroll">HR & Payroll</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Leave">Leave</option>
                                            <option value="Attendance">Attendance</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
                                        <input
                                            type="text"
                                            value={ticketForm.topic}
                                            onChange={(e) => setTicketForm((p) => ({ ...p, topic: e.target.value }))}
                                            className="w-full p-3 bg-gray-50 border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Brief issue title"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                        <textarea
                                            rows="4"
                                            value={ticketForm.details}
                                            onChange={(e) => setTicketForm((p) => ({ ...p, details: e.target.value }))}
                                            className="w-full p-3 bg-gray-50 border-gray-100 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                            placeholder="Explain your issue in detail..."
                                            required
                                        />
                                    </div>
                                    <button type="submit" disabled={submitLoading} className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-200 active:scale-95 transition-transform mt-2 disabled:opacity-70">
                                        {submitLoading ? 'Submitting...' : 'Submit Ticket'}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
};

export default TeacherHelpPage;
