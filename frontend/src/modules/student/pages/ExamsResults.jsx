import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

// Components
import ExamTabs from '../components/Exams/ExamTabs';
import ExamListCards from '../components/Exams/ExamListCards';
import ExamTimetable from '../components/Exams/ExamTimetable';
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
    const examsError = useStudentStore(state => state.examsError);
    const resultsError = useStudentStore(state => state.resultsError);
    const fetchExams = useStudentStore(state => state.fetchExams);
    const fetchResults = useStudentStore(state => state.fetchResults);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Upcoming Exams');
    const [selectedResult, setSelectedResult] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);

    const loadData = React.useCallback(async () => {
        setLoading(true);
        await Promise.all([fetchExams(), fetchResults()]);
        setLoading(false);
    }, [fetchExams, fetchResults]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (activeTab !== 'Upcoming Exams') setSelectedExam(null);
    }, [activeTab]);

    // When URL has result id, switch to Results tab (modal opens via selectedResult effect)
    useEffect(() => {
        if (id && (results || []).length > 0) {
            const found = (results || []).find(r => r._id === id);
            if (found) setActiveTab('Results');
        }
    }, [id, results]);

    // Transform Data - handles API response structure (populated subjectId, etc.)
    const formattedData = React.useMemo(() => ({
        upcoming: (exams || []).map(e => {
            const subjList = e.subjects || [];
            return {
                id: e._id,
                name: e.examName || 'Exam',
                examType: e.examType || '',
                startDate: e.startDate,
                endDate: e.endDate,
                subjects: subjList.map(s => {
                    const subId = s.subjectId;
                    const subName = typeof subId === 'object' && subId?.name ? subId.name : 'Subject';
                    return {
                        id: s._id || subId?._id || `${e._id}_${subName}`,
                        name: subName,
                        date: s.date,
                        startTime: s.startTime || null,
                        endTime: s.endTime || null,
                        time: [s.startTime, s.endTime].filter(Boolean).join(' – ') || null,
                        room: s.roomNo || 'N/A',
                        maxMarks: s.maxMarks
                    };
                })
            };
        }),
        results: (results || []).map(r => {
            const pct = r.percentage ?? 0;
            const obtained = r.totalMarksObtained ?? (r.results || []).reduce((sum, s) => sum + (s.marksObtained || s.marks || 0), 0);
            const total = r.totalMaxMarks ?? (r.results || []).reduce((sum, s) => sum + (s.totalMarks || s.total || 0), 0);
            const statusVal = r.overallStatus ?? (pct >= 33 ? "Pass" : "Fail");
            const gradeVal = r.overallGrade ?? (() => {
                if (pct >= 91) return "A+";
                if (pct >= 81) return "A";
                if (pct >= 71) return "B+";
                if (pct >= 61) return "B";
                if (pct >= 51) return "C+";
                if (pct >= 41) return "C";
                if (pct >= 33) return "D";
                return "E";
            })();
            return {
                id: r._id,
                examName: r.examId?.examName || "Exam",
                date: r.updatedAt,
                grade: gradeVal,
                percentage: Math.round(pct),
                status: statusVal,
                remarks: r.remarks || "Performance is recorded for this exam.",
                subjects: (r.results || []).map(s => ({
                    name: s.subjectId?.name || s.subjectName || "Subject",
                    marks: s.marksObtained ?? s.marks ?? 0,
                    total: s.totalMarks ?? s.total ?? 0,
                    grade: s.grade || "—",
                    status: s.status || "—",
                    remarks: s.remarks || ""
                })),
                obtainedMarks: obtained,
                totalMarks: total,
                publishedDate: r.updatedAt || r.createdAt
            };
        }),
        performance: (() => {
            const list = results || [];
            const trend = list.slice(-5).reverse().map(r => ({
                exam: (r.examId?.examName || "Exam").split(' ')[0],
                percentage: Math.round(r.percentage ?? 0)
            }));
            const subjectMap = {};
            list.forEach(r => {
                (r.results || []).forEach(s => {
                    const name = s.subjectId?.name || s.subjectName || "Subject";
                    if (!subjectMap[name]) subjectMap[name] = { total: 0, sum: 0 };
                    const t = s.totalMarks ?? s.total ?? 1;
                    const m = s.marksObtained ?? s.marks ?? 0;
                    if (t > 0) {
                        subjectMap[name].sum += (m / t) * 100;
                        subjectMap[name].total += 1;
                    }
                });
            });
            const subjectAverage = Object.entries(subjectMap).map(([subject, v]) => ({
                subject,
                avg: Math.round(v.total > 0 ? v.sum / v.total : 0)
            })).sort((a, b) => b.avg - a.avg);
            const insight = list.length > 0
                ? "Your hard work is reflecting in your scores! Consistency is key to academic success."
                : "Complete your first exam to see detailed performance analytics here.";
            return { insight, trend, subjectAverage };
        })()
    }), [exams, results]);

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
            if (selectedExam) {
                return (
                    <ExamTimetable
                        exams={[selectedExam]}
                        examName={selectedExam.name}
                        onBack={() => setSelectedExam(null)}
                    />
                );
            }
            return (
                <ExamListCards
                    exams={formattedData.upcoming}
                    onSelect={setSelectedExam}
                />
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
                ) : (examsError && resultsError && !exams?.length && !results?.length) ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <p className="text-sm text-red-600 text-center mb-4">{examsError || resultsError}</p>
                        <button
                            onClick={loadData}
                            className="px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        {(examsError || resultsError) && (
                            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-2">
                                <p className="text-xs text-amber-800 flex-1">
                                    {examsError && resultsError ? 'Exams & results failed to load.' : (examsError || resultsError)}
                                </p>
                                <button onClick={loadData} className="text-xs font-bold text-amber-700 hover:underline shrink-0">
                                    Retry
                                </button>
                            </div>
                        )}
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
