import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Plus, History } from 'lucide-react';

// Components
import QuickHelpCards from '../components/HelpSupport/QuickHelpCards';
import FAQAccordion from '../components/HelpSupport/FAQAccordion';
import RaiseTicketForm from '../components/HelpSupport/RaiseTicketForm';
import TicketCard from '../components/HelpSupport/TicketCard';
import InfoTooltip from '../components/Attendance/InfoTooltip';
import EmptyState from '../components/Attendance/EmptyState';

// Data
import { supportData } from '../data/supportData';

const HelpSupportPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [showRaiseModal, setShowRaiseModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [viewMode, setViewMode] = useState('help'); // 'help' or 'tickets'

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

        // Simulate Fetch
        setTimeout(() => {
            setData(supportData);
            setLoading(false);
        }, 600);

        return () => lenis.destroy();
    }, []);

    const handleCommonIssueClick = (category) => {
        setSelectedCategory(category);
        setShowRaiseModal(true);
    };

    const handleTicketSubmit = (ticketDetails) => {
        // Mock submission logic
        console.log("Submitted:", ticketDetails);
        setShowRaiseModal(false);
        alert("Ticket Raised Successfully! Reference: TKT-MOCK-NEW");
        setViewMode('tickets'); // Switch to tracking view
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
                                {data.tickets.filter(t => t.status !== 'Closed').length > 0 && (
                                    <span className={`text-[10px] px-1.5 rounded-full ${viewMode === 'tickets' ? 'bg-white text-gray-900' : 'bg-red-100 text-red-600'}`}>
                                        {data.tickets.filter(t => t.status !== 'Closed').length}
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
                                    <FAQAccordion data={data.faq} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="tickets"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {data.tickets.length > 0 ? (
                                        <div className="space-y-3">
                                            {data.tickets.map(ticket => (
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
                        categories={data.categories}
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
