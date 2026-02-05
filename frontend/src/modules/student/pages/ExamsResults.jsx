import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

import { useStudentStore } from '../../../store/studentStore';

const TABS = ['Upcoming Exams', 'Results', 'Performance'];

const ExamsResultsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const containerRef = useRef(null);
    const exams = useStudentStore(state => state.exams);
    const results = useStudentStore(state => state.results);
    const fetchExams = useStudentStore(state => state.fetchExams);
    const fetchResults = useStudentStore(state => state.fetchResults);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Upcoming Exams');
    const [selectedResult, setSelectedResult] = useState(null);

    // Initial Load
    useEffect(() => {
        Promise.all([fetchExams(), fetchResults()]).finally(() => setLoading(false));
    }, [fetchExams, fetchResults]);

    // Transform Data
    const formattedData = {
        upcoming: exams.map(e => ({
            id: e._id,
            name: e.examName,
            startDate: e.startDate,
            endDate: e.endDate,
            subjects: e.subjects.map(s => ({
                id: s._id,
                name: s.subjectId?.name || "Subject",
                date: s.date,
                time: `${s.startTime} - ${s.endTime}`,
                room: s.roomNo || "N/A"
            }))
        })),
        results: results.map(r => ({
            id: r._id,
            examName: r.examId?.examName || "Exam",
            date: r.updatedAt,
            overallGrade: "A", // Backend doesn't have overall grade yet
            percentage: 85, // Placeholder
            status: "Pass",
            subjects: r.results.map(s => ({
                name: s.subjectId?.name || "Subject",
                marks: s.marksObtained,
                total: s.totalMarks,
                grade: s.grade,
                status: s.status
            }))
        })),
        performance: {
            average: 82,
            rank: "5th",
            attendance: 90,
            subjectPerformance: []
        }
    };

    // Update selected result if ID changes
    useEffect(() => {
        if (id && formattedData.results.length > 0) {
            const result = formattedData.results.find(r => r.id === id);
            if (result) {
                setSelectedResult(result);
            }
        } else if (!id) {
            setSelectedResult(null);
        }
    }, [id, formattedData.results]);

    const handleResultClick = (result) => {
        navigate(`${result.id}`);
    };

    const handleCloseDetail = () => {
        navigate('..', { relative: 'path' });
    };

    // Tab Content Renderer
    const renderContent = () => {
        if (activeTab === 'Upcoming Exams') {
            if (formattedData.upcoming.length === 0) return <EmptyState message="No upcoming exams scheduled." />;
            return (
                <div className="space-y-4">
                    {formattedData.upcoming.map((exam, index) => (
                        <UpcomingExamCard key={exam.id} exam={exam} index={index} />
                    ))}
                </div>
            );
        }

        if (activeTab === 'Results') {
            if (formattedData.results.length === 0) return <EmptyState message="No results published yet." />;
            return (
                <div className="space-y-2">
                    {formattedData.results.map((result, index) => (
                        <ResultCard
                            key={result.id}
                            result={result}
                            index={index}
                            onClick={handleResultClick}
                        />
                    ))}
                </div>
            );
        }

        if (activeTab === 'Performance') {
            return <PerformanceOverview data={formattedData.performance} />;
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
                        onClose={handleCloseDetail}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExamsResultsPage;
