import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Layers, FileDigit, BarChart2, CheckCircle, Lock, ArrowRight } from 'lucide-react';

const ExamCard = ({ exam, onEnterMarks, onClick }) => {
    const isLocked = exam.status === 'Locked';
    const isActive = exam.status === 'Active';

    // Status Config
    const statusColor = {
        'Active': 'bg-indigo-50 text-indigo-700 border-indigo-200',
        'Upcoming': 'bg-blue-50 text-blue-600 border-blue-200',
        'Submitted': 'bg-emerald-50 text-emerald-600 border-emerald-200',
        'Locked': 'bg-gray-50 text-gray-500 border-gray-200',
    };

    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`bg-white p-5 rounded-2xl border mb-4 relative overflow-hidden transition-all group hover:shadow-md cursor-pointer ${isActive ? 'border-indigo-100 shadow-sm' : 'border-gray-100'}`}
        >
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-3">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${statusColor[exam.status] || 'bg-gray-100'}`}>
                    {exam.status}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                    <Calendar size={12} />
                    {new Date(exam.date).toLocaleDateString()}
                </div>
            </div>

            <h3 className="text-base font-bold text-gray-900 leading-tight mb-1">{exam.title}</h3>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-4">
                <span>{exam.subject}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>{exam.class}</span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center gap-2">
                    <div className="p-1.5 bg-white rounded-lg text-gray-400 shadow-sm">
                        <FileDigit size={14} />
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-gray-900">{exam.totalMarks}</span>
                        <span className="text-[9px] text-gray-400 font-medium">Total Marks</span>
                    </div>
                </div>
                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center gap-2">
                    <div className="p-1.5 bg-white rounded-lg text-gray-400 shadow-sm">
                        <BarChart2 size={14} />
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-gray-900">{isActive ? `${exam.evaluatedCount}/${exam.studentsCount}` : exam.studentsCount}</span>
                        <span className="text-[9px] text-gray-400 font-medium">{isActive ? 'Evaluated' : 'Students'}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gray-50 flex justify-end">
                {isActive ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); onEnterMarks(exam); }}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                        Enter Marks <ArrowRight size={14} />
                    </button>
                ) : (
                    <button
                        disabled={isLocked}
                        onClick={(e) => { e.stopPropagation(); onEnterMarks(exam); }} // Reusing the same modal for viewing or navigate to report
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isLocked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        {isLocked ? <><Lock size={14} /> View Result</> : 'View Details'}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default ExamCard;
