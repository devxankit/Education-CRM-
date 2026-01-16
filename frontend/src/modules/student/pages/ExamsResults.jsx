import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

// Components
import ExamTabs from '../components/Exams/ExamTabs';
import UpcomingExamCard from '../components/Exams/UpcomingExamCard';
import ResultCard from '../components/Exams/ResultCard';
import ResultDetailModal from '../components/Exams/ResultDetailModal';
import PerformanceOverview from '../components/Exams/PerformanceOverview';
import InfoTooltip from '../components/Attendance/InfoTooltip'; // Reuse existing tooltip
import EmptyState from '../components/Attendance/EmptyState'; // Reuse existing empty state

// Data
import { examsData } from '../data/examsData';

const TABS = ['Upcoming Exams', 'Results', 'Performance'];

const ExamsResultsPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('Upcoming Exams');
    const [selectedResult, setSelectedResult] = useState(null);

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
            setData(examsData);
            setLoading(false);
        }, 800);

        return () => lenis.destroy();
    }, []);

    // Tab Content Renderer
    const renderContent = () => {
        if (!data) return null;

        if (activeTab === 'Upcoming Exams') {
            if (data.upcoming.length === 0) return <EmptyState message="No upcoming exams scheduled." />;
            return (
                <div className="space-y-4">
                    {data.upcoming.map((exam, index) => (
                        <UpcomingExamCard key={exam.id} exam={exam} index={index} />
                    ))}
                </div>
            );
        }

        if (activeTab === 'Results') {
            if (data.results.length === 0) return <EmptyState message="No results published yet." />;
            return (
                <div className="space-y-2">
                    {data.results.map((result, index) => (
                        <ResultCard
                            key={result.id}
                            result={result}
                            index={index}
                            onClick={setSelectedResult}
                        />
                    ))}
                </div>
            );
        }

        if (activeTab === 'Performance') {
            if (!data.performance) return <EmptyState message="No performance data available." />;
            return <PerformanceOverview data={data.performance} />;
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50/50 pb-24">
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

                    <h1 className="text-lg font-bold text-gray-900">Exams & Results</h1>

                    <InfoTooltip
                        content={
                            <div className="space-y-2">
                                <p className="font-bold border-b border-gray-100 pb-1">Grading System</p>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                    <span>A+ : 91-100%</span>
                                    <span>C+ : 51-60%</span>
                                    <span>A  : 81-90%</span>
                                    <span>C  : 41-50%</span>
                                    <span>B+ : 71-80%</span>
                                    <span>D  : 33-40%</span>
                                    <span>B  : 61-70%</span>
                                    <span>E  : &lt;33% (Fail)</span>
                                </div>
                            </div>
                        }
                    >
                        <button className="p-2 -mr-2 text-gray-400 hover:text-gray-600">
                            <Info size={20} />
                        </button>
                    </InfoTooltip>
                </div>
            </div>

            <main className="max-w-lg mx-auto px-4 pt-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-sm text-gray-500 font-medium">Loading Records...</p>
                    </div>
                ) : (
                    <>
                        <ExamTabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </>
                )}
            </main>

            {/* Modal */}
            <AnimatePresence>
                {selectedResult && (
                    <ResultDetailModal
                        result={selectedResult}
                        onClose={() => setSelectedResult(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExamsResultsPage;
