
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Award, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParentStore } from '../../../store/parentStore';

const ResultDetailPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const exams = useParentStore(state => state.exams);
    const result = (exams || []).find(e => {
        const eId = e._id || e.id;
        return eId?.toString() === examId || eId === examId;
    });

    const [expandedSubject, setExpandedSubject] = useState(null);

    const toggleSubject = (name) => {
        if (expandedSubject === name) setExpandedSubject(null);
        else setExpandedSubject(name);
    }

    if (!result) return <div className="p-10 text-center"><span className="loading loading-spinner text-indigo-600"></span></div>;

    const isPassed = result.status === 'Passed';

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ChevronLeft size={22} className="text-gray-600" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900 truncate pr-4">{result.title}</h1>
                </div>
                <button className="p-2 text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100">
                    <Download size={20} />
                </button>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-5">
                {/* Summary Card */}
                <div className={`rounded-2xl p-6 text-white text-center shadow-lg ${isPassed ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-orange-500 to-red-600'}`}>
                    <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center mb-3 backdrop-blur-md">
                        <Award size={32} className="text-white" />
                    </div>
                    <h2 className="text-5xl font-extrabold mb-1">{result.overall}</h2>
                    <p className="text-sm font-medium opacity-90 uppercase tracking-widest mb-4">Overall Score</p>

                    <div className="flex justify-center gap-4 text-sm font-semibold bg-black/10 rounded-xl p-3 backdrop-blur-sm">
                        <div>
                            <span className="block opacity-70 text-[10px] uppercase">Grade</span>
                            <span className="text-xl">{result.grade}</span>
                        </div>
                        <div className="w-px bg-white/20"></div>
                        <div>
                            <span className="block opacity-70 text-[10px] uppercase">Marks</span>
                            <span className="text-xl">{result.obtainedMarks}/{result.totalMarks}</span>
                        </div>
                    </div>
                </div>

                {/* Teacher Remarks */}
                {result.remarks && (
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Detailed Feedback</h3>
                        <p className="text-sm text-gray-700 italic">"{result.remarks}"</p>
                    </div>
                )}

                {/* Subject Wise List */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Subject Performance</h3>
                    <div className="space-y-2">
                        {result.subjects.map((sub, idx) => (
                            <div
                                key={idx}
                                onClick={() => toggleSubject(sub.name)}
                                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all"
                            >
                                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${sub.marks >= 80 ? 'bg-green-100 text-green-700' : sub.marks >= 60 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                            <span className="text-xs font-bold w-6 block text-center">{sub.grade}</span>
                                        </div>
                                        <h4 className="text-sm font-bold text-gray-900">{sub.name}</h4>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-gray-600">{sub.marks}/{sub.total}</span>
                                        {expandedSubject === sub.name ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {expandedSubject === sub.name && (
                                        <motion.div
                                            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                                            className="bg-gray-50 border-t border-gray-100 px-4 py-3"
                                        >
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-500 font-medium">Remarks:</span>
                                                <span className="text-gray-900 font-bold">{sub.remark}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
};

export default ResultDetailPage;
