
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, HelpCircle, Mail, MapPin, Phone, Plus, Tag } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const TeacherHelpPage = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('faq'); // 'faq' | 'tickets'
    const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
    const [tickets, setTickets] = useState([
        { id: 'TKT-102', subject: 'Salary Slip Incorrect', status: 'Open', date: '2 days ago', category: 'Finance' },
        { id: 'TKT-098', subject: 'Leave Approval Pending', status: 'Closed', date: '1 week ago', category: 'HR' },
    ]);

    const faqData = [
        { question: 'How to reset my password?', answer: 'You can reset your password by going to Profile > Settings > Change Password. If you forgot your password, contact Admin.' },
        { question: 'How to apply for leave?', answer: 'Navigate to Profile, then select "Apply for Leave". Fill in the dates and reason, then submit for approval.' },
        { question: 'How to update profile details?', answer: 'Some details can be updated in Profile > Edit. For critical changes like Name or Designation, please raise a ticket to HR.' },
        { question: 'Issue with Attendance marking', answer: 'If attendance is not syncing, ensure you have a stable internet connection. If the issue persists, raise an IT Support ticket.' },
    ];

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

    const handleRaiseTicket = (e) => {
        e.preventDefault();
        // Mock submission
        const newTicket = { id: `TKT-${Math.floor(Math.random() * 1000)}`, subject: 'New Support Request', status: 'Open', date: 'Just now', category: 'General' };
        setTickets([newTicket, ...tickets]);
        setIsRaiseModalOpen(false);
        setViewMode('tickets');
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
                            {tickets.filter(t => t.status === 'Open').length}
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
                                        <h3 className="text-sm font-bold text-gray-900">Admin Office</h3>
                                        <p className="text-xs text-gray-500">+91 98765 43210</p>
                                    </div>
                                </div>
                                <div className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">Email Support</h3>
                                        <p className="text-xs text-gray-500">support@educationcrm.com</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="mb-20">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Common FAQs</h2>
                            <div className="space-y-3">
                                {faqData.map((faq, i) => (
                                    <FAQItem key={i} question={faq.question} answer={faq.answer} />
                                ))}
                            </div>
                        </section>
                    </>
                ) : (
                    <div className="space-y-3 mb-20">
                        {tickets.map(ticket => (
                            <div key={ticket.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{ticket.category}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ticket.status === 'Open' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                        {ticket.status}
                                    </span>
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 mb-1">{ticket.subject}</h3>
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <Info size={12} /> Ref: {ticket.id} • {ticket.date}
                                </p>
                            </div>
                        ))}
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
                                        <select className="w-full p-3 bg-gray-50 border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none">
                                            <option>General Inquiry</option>
                                            <option>IT Support</option>
                                            <option>HR & Payroll</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
                                        <input type="text" className="w-full p-3 bg-gray-50 border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Brief issue title" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                        <textarea rows="4" className="w-full p-3 bg-gray-50 border-gray-100 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Explain your issue in detail..." required></textarea>
                                    </div>
                                    <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-200 active:scale-95 transition-transform mt-2">
                                        Submit Ticket
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
