import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckSquare } from 'lucide-react';

// Components
import HomeworkTabs from '../components/Homework/HomeworkTabs';
import HomeworkCard from '../components/Homework/HomeworkCard';
import HomeworkDetail from '../components/Homework/HomeworkDetail';
import InfoTooltip from '../components/Attendance/InfoTooltip';
import EmptyState from '../components/Attendance/EmptyState';

// Data
import { homeworkData, homeworkStats } from '../data/homeworkData';

const TABS = ['All', 'Pending', 'Submitted', 'Overdue'];

const HomeworkPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('Pending');
    const [selectedHomework, setSelectedHomework] = useState(null);

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
            setData(homeworkData);
            setStats(homeworkStats);
            setLoading(false);
        }, 800);

        return () => lenis.destroy();
    }, []);

    // Filter Logic
    const filteredData = data.filter(item => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Pending') return item.status === 'Pending';
        if (activeTab === 'Submitted') return item.status === 'Submitted' || item.status === 'Checked';
        if (activeTab === 'Overdue') return item.status === 'Overdue' || item.status === 'Late';
        return true;
    });

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

                    <h1 className="text-lg font-bold text-gray-900">Homework</h1>

                    <InfoTooltip
                        content={
                            <div className="space-y-2">
                                <p className="font-bold border-b border-gray-100 pb-1">Submission Rules</p>
                                <p>1. Files must be under 5MB.</p>
                                <p>2. Late submissions are marked yellow.</p>
                                <p>3. Once checked, you cannot resubmit.</p>
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
                        <p className="mt-4 text-sm text-gray-500 font-medium">Loading Tasks...</p>
                    </div>
                ) : (
                    <>
                        <HomeworkTabs
                            tabs={TABS}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            counts={stats}
                        />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {filteredData.length > 0 ? (
                                    filteredData.map((hw, index) => (
                                        <HomeworkCard
                                            key={hw.id}
                                            homework={hw}
                                            index={index}
                                            onClick={setSelectedHomework}
                                        />
                                    ))
                                ) : (
                                    <div className="py-12">
                                        <EmptyState message={`No ${activeTab.toLowerCase()} homework found.`} />
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </>
                )}
            </main>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedHomework && (
                    <HomeworkDetail
                        homework={selectedHomework}
                        onClose={() => setSelectedHomework(null)}
                        onRefresh={() => {
                            // Mock Refresh - update status locally for demo
                            const newData = data.map(d =>
                                d.id === selectedHomework.id
                                    ? { ...d, status: 'Submitted', submission: { date: new Date().toISOString(), files: [{ name: 'Uploaded_File.pdf' }] } }
                                    : d
                            );
                            setData(newData);
                            // Update stats mock
                            setStats(prev => ({ ...prev, pending: prev.pending - 1, submitted: prev.submitted + 1 }));
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default HomeworkPage;
