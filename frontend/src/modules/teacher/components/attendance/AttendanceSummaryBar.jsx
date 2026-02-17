import React from 'react';
import { motion } from 'framer-motion';

const AttendanceSummaryBar = ({ stats, onSubmit, disabled }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-50">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                <div className="flex gap-6 text-xs">
                    <div className="flex flex-col items-center">
                        <span className="block text-lg font-black text-emerald-600">{stats.present}</span>
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Present</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="block text-lg font-black text-red-600">{stats.absent}</span>
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Absent</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="block text-lg font-black text-amber-600">{stats.leave}</span>
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Leave</span>
                    </div>
                </div>

                <motion.button
                    whileTap={!disabled ? { scale: 0.98 } : {}}
                    onClick={!disabled ? onSubmit : undefined}
                    className={`flex-1 font-bold text-sm py-3 px-6 rounded-xl transition-all ${disabled
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                            : 'bg-gray-900 text-white shadow-lg shadow-gray-200 hover:bg-black'
                        }`}
                >
                    Submit Attendance
                </motion.button>
            </div>
        </div>
    );
};

export default AttendanceSummaryBar;
