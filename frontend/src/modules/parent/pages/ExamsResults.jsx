
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Info, Calendar, Book, Award, HeadphonesIcon, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ResultCard from '../components/exams/ResultCard';

import { useParentStore } from '../../../store/parentStore';

const ParentExamsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state || {};
    const { childId, highlightLatestResult } = state;
    const latestExamRef = useRef(null);

    const exams = useParentStore(state => state.exams);
    const fetchExams = useParentStore(state => state.fetchExams);
    const isLoading = useParentStore(state => state.isLoading);
    const selectedChildIdStore = useParentStore(state => state.selectedChildId);

    const [activeTab, setActiveTab] = useState('All');
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    // 1. Entry Check & Scroll
    useEffect(() => {
        const idToUse = childId || selectedChildIdStore;
        if (idToUse) {
            fetchExams(idToUse);
        }

        if (highlightLatestResult && latestExamRef.current) {
            setTimeout(() => {
                latestExamRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }, [childId, selectedChildIdStore, highlightLatestResult, fetchExams]); // Changed dependency from navigate to fetchExams

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 font-medium">Loading exam results...</p>
                </div>
            </div>
        );
    }

    // Handlers
    const handleBack = () => navigate(-1);

    const handleExamClick = (id) => {
        navigate(`/parent/results/${id}`, { state: { childId, source: 'results_list' } });
    };

    const handleQuickAction = (path) => {
        navigate(path, { state: { childId, source: 'results' } });
    };

    // Filter Logic
    const filteredExams = exams.filter(exam => {
        if (activeTab === 'All') return true;
        return exam.type === activeTab;
    });

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ChevronLeft size={22} className="text-gray-600" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Exams & Results</h1>
                </div>
                <button
                    onClick={() => setIsInfoModalOpen(true)}
                    className="p-2 rounded-full hover:bg-indigo-50 text-indigo-600 transition-colors"
                >
                    <Info size={20} />
                </button>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">

                {/* 2. Filters */}
                <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {['All', 'Unit Test', 'Mid-Term', 'Final'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 min-w-[25%] py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* 3. Exam List */}
                <div className="space-y-4">
                    {filteredExams.length > 0 ? (
                        filteredExams.map(exam => (
                            <div key={exam.id} ref={exam.isLatest ? latestExamRef : null}>
                                <ResultCard
                                    exam={exam}
                                    onClick={() => handleExamClick(exam.id)}
                                    isHighlighted={exam.isLatest && highlightLatestResult}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Award size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-900">No Results Found</h3>
                            <p className="text-xs text-gray-500 mt-1">Check back later for published results.</p>
                        </div>
                    )}
                </div>

                {/* 7. Quick Actions */}
                <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Related Actions</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <button onClick={() => handleQuickAction('/parent/attendance')} className="p-3 bg-white border border-gray-100 rounded-xl flex flex-col items-center gap-2 hover:border-indigo-100 active:scale-95 transition-all">
                            <Calendar size={20} className="text-emerald-500" />
                            <span className="text-[10px] font-bold text-gray-600">Attendance</span>
                        </button>
                        <button onClick={() => handleQuickAction('/parent/homework')} className="p-3 bg-white border border-gray-100 rounded-xl flex flex-col items-center gap-2 hover:border-indigo-100 active:scale-95 transition-all">
                            <Book size={20} className="text-blue-500" />
                            <span className="text-[10px] font-bold text-gray-600">Homework</span>
                        </button>
                        <button onClick={() => handleQuickAction('/parent/support')} className="p-3 bg-white border border-gray-100 rounded-xl flex flex-col items-center gap-2 hover:border-indigo-100 active:scale-95 transition-all">
                            <HeadphonesIcon size={20} className="text-gray-500" />
                            <span className="text-[10px] font-bold text-gray-600">Support</span>
                        </button>
                    </div>
                </div>

            </main>

            {/* Info Modal */}
            <AnimatePresence>
                {isInfoModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsInfoModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-xl"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Grading System</h3>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                We follow a standard grading scale to assess student performance fairly.
                            </p>
                            <div className="space-y-2 mb-6 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <span className="font-bold text-green-600">Grade A (80-100%)</span>
                                    <span className="text-gray-500">Excellent</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <span className="font-bold text-blue-600">Grade B (60-79%)</span>
                                    <span className="text-gray-500">Good</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <span className="font-bold text-orange-600">Grade C (40-59%)</span>
                                    <span className="text-gray-500">Average</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="font-bold text-red-600">Grade D (Below 40%)</span>
                                    <span className="text-gray-500">Poor</span>
                                </div>
                            </div>
                            <button onClick={() => setIsInfoModalOpen(false)} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl text-sm">Got it</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ParentExamsPage;
