import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PerformanceSnapshot = ({ stats }) => {
    const navigate = useNavigate();

    return (
        <div className="mb-24">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Your Performance</h3>
            <div
                onClick={() => navigate('/teacher/reports')}
                className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 cursor-pointer active:scale-98 transition-transform"
            >
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h4 className="text-lg font-bold">Good Job, Sir! 👍</h4>
                        <p className="text-xs text-indigo-200 mt-1">You are consistently managing your classes.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Attendance */}
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                            <span className="text-indigo-100">Attendance Completion</span>
                            <span>{stats.attendanceCompletion}%</span>
                        </div>
                        <div className="h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.attendanceCompletion}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-emerald-400 rounded-full"
                            ></motion.div>
                        </div>
                    </div>

                    {/* Homework */}
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                            <span className="text-indigo-100">Homework Review</span>
                            <span>{stats.homeworkReviewed}%</span>
                        </div>
                        <div className="h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.homeworkReviewed}%` }}
                                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                                className="h-full bg-amber-400 rounded-full"
                            ></motion.div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-indigo-300">Engagement Score</span>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className={star <= Math.round(stats.engagementScore) ? "text-yellow-400" : "text-indigo-900"}>★</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceSnapshot;
