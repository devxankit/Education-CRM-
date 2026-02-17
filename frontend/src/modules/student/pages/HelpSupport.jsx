import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '@/app/api';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Plus, History } from 'lucide-react';
import { useStudentStore } from '../../../store/studentStore';

// Components
import QuickHelpCards from '../components/HelpSupport/QuickHelpCards';
import FAQAccordion from '../components/HelpSupport/FAQAccordion';
import RaiseTicketForm from '../components/HelpSupport/RaiseTicketForm';
import TicketCard from '../components/HelpSupport/TicketCard';
import InfoTooltip from '../components/Attendance/InfoTooltip';
import EmptyState from '../components/Attendance/EmptyState';

const HelpSupportPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const token = useStudentStore((s) => s.token);
    const tickets = useStudentStore(state => state.tickets) || [];
    const fetchTickets = useStudentStore(state => state.fetchTickets);
    const addTicket = useStudentStore(state => state.addTicket);

    const [loading, setLoading] = useState(!tickets || tickets.length === 0);
    const [faqData, setFaqData] = useState([]);
    const [showRaiseModal, setShowRaiseModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [viewMode, setViewMode] = useState('help'); // 'help' or 'tickets'

    useEffect(() => {
        fetchTickets().finally(() => setLoading(false));
    }, [fetchTickets]);

    useEffect(() => {
        if (!token) return;
        axios
            .get(`${API_URL}/faq/public`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                if (res.data?.success && Array.isArray(res.data.data)) {
                    const list = res.data.data;
                    const grouped = {};
                    list.forEach((f) => {
                        const cat = f.category || 'General';
                        if (!grouped[cat]) grouped[cat] = [];
                        grouped[cat].push({ q: f.question, a: f.answer });
                    });
                    setFaqData(
                        Object.entries(grouped).map(([category, questions]) => ({ category, questions }))
                    );
                }
            })
            .catch(() => setFaqData([]));
    }, [token]);

    // Transform tickets for UI (backend uses topic, UI uses subject; backend status can be "In-Progress")
    const allTickets = tickets.map(t => ({
        id: t._id,
        category: t.category,
        topic: t.topic,
        subject: t.topic,
        status: (t.status === 'In-Progress' ? 'In Progress' : t.status) || 'Open',
        priority: t.priority,
        date: t.createdAt,
        lastUpdate: t.respondedAt || t.updatedAt || t.createdAt,
        details: t.details,
        response: t.response,
        updates: t.response ? [t.response] : []
    }));

    const supportData = {
        faq: faqData,
        categories: ["Academic", "Fee Related", "Homework", "General", "Correction", "Attendance Issue", "Homework Submission Issue", "Fees / Payment Issue", "Profile Correction"]
    };

    // Initial Load & Smooth Scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => lenis.destroy();
    }, []);

    const handleCommonIssueClick = (category) => {
        setSelectedCategory(category);
        setShowRaiseModal(true);
    };

    // Map UI categories to backend enum (Academic, Fee Related, Homework, General, Correction, Attendance, Fees, Transport, Other)
    const mapCategoryToBackend = (cat) => {
        const map = {
            'Attendance Issue': 'Attendance',
            'Homework Submission Issue': 'Homework',
            'Fees / Payment Issue': 'Fee Related',
            'Profile Correction': 'Correction'
        };
        return map[cat] || (supportData.categories.includes(cat) ? cat : 'General');
    };

    const handleTicketSubmit = async (ticketDetails) => {
        const formattedTicket = {
            category: mapCategoryToBackend(ticketDetails.category),
            topic: ticketDetails.subject,
            details: ticketDetails.description,
            priority: 'Normal',
            ...(ticketDetails.file && { file: ticketDetails.file })
        };
        const success = await addTicket(formattedTicket);
        if (success) {
            setShowRaiseModal(false);
            setViewMode('tickets');
        } else {
            throw new Error('Failed to create ticket. Please try again.');
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50/50">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center justify-between max-w-lg mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <h1 className="text-lg font-bold text-gray-900">Help & Support</h1>

                    <InfoTooltip
                        content={
                            <div className="space-y-2">
                                <p className="font-bold border-b border-gray-100 pb-1">Support Policy</p>
                                <p>1. Tickets are responded to within 24-48 hours.</p>
                                <p>2. Please check FAQs before raising tickets.</p>
                                <p>3. Urgent issues should be reported to class teacher.</p>
                            </div>
                        }
                    >
                        <button className="p-2 -mr-2 text-gray-400 hover:text-gray-600">
                            <Info size={20} />
                        </button>
                    </InfoTooltip>
                </div>
            </div>

            <main className="max-w-lg mx-auto px-4 pt-6 pb-24">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-sm text-gray-500 font-medium">Loading Helpdesk...</p>
                    </div>
                ) : (
                    <>
                        {/* View Switcher */}
                        <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm mb-6">
                            <button
                                onClick={() => setViewMode('help')}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${viewMode === 'help' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                FAQ & Help
                            </button>
                            <button
                                onClick={() => setViewMode('tickets')}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${viewMode === 'tickets' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                My Tickets
                                {allTickets.filter(t => t.status !== 'Closed').length > 0 && (
                                    <span className={`text-[10px] px-1.5 rounded-full ${viewMode === 'tickets' ? 'bg-white text-gray-900' : 'bg-red-100 text-red-600'}`}>
                                        {allTickets.filter(t => t.status !== 'Closed').length}
                                    </span>
                                )}
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {viewMode === 'help' ? (
                                <motion.div
                                    key="help"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <QuickHelpCards onSelectCategory={handleCommonIssueClick} />
                                    <FAQAccordion data={supportData.faq} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="tickets"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {allTickets.length > 0 ? (
                                        <div className="space-y-3">
                                            {allTickets.map(ticket => (
                                                <TicketCard key={ticket.id} ticket={ticket} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-12">
                                            <EmptyState message="No support tickets raised." />
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </main>

            {/* Raise Ticket FAB */}
            <div className="fixed bottom-24 right-6 z-30">
                <button
                    onClick={() => {
                        setSelectedCategory('');
                        setShowRaiseModal(true);
                    }}
                    className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
                >
                    <Plus size={20} /> Raise Ticket
                </button>
            </div>

            {/* Raise Ticket Modal */}
            <AnimatePresence>
                {showRaiseModal && (
                    <RaiseTicketForm
                        categories={supportData.categories}
                        defaultCategory={selectedCategory}
                        onClose={() => setShowRaiseModal(false)}
                        onSubmit={handleTicketSubmit}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default HelpSupportPage;
