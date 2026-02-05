import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Layers, FileDigit, BarChart2, CheckCircle, Lock, ArrowRight } from 'lucide-react';

const ExamCard = ({ exam, subject, onEnterMarks, onClick }) => {
    const isCompleted = exam.status === 'Completed';
    const isPublished = exam.status === 'Published';

    // Status Config
    const statusColor = {
        'Published': 'bg-indigo-50 text-indigo-700 border-indigo-200',
        'Upcoming': 'bg-blue-50 text-blue-600 border-blue-200',
        'Completed': 'bg-emerald-50 text-emerald-600 border-emerald-200',
        'Draft': 'bg-gray-50 text-gray-500 border-gray-200',
    };

    const displayStatus = isPublished ? 'Active' : exam.status;

    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`bg-white p-5 rounded-2xl border mb-4 relative overflow-hidden transition-all group hover:shadow-md cursor-pointer ${isPublished ? 'border-indigo-100 shadow-sm' : 'border-gray-100'}`}
        >
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-3">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${statusColor[exam.status] || 'bg-gray-100'}`}>
                    {displayStatus}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                    <Calendar size={12} />
                    {new Date(subject.date || exam.startDate).toLocaleDateString()}
                </div>
            </div>

            <h3 className="text-base font-bold text-gray-900 leading-tight mb-1">{exam.examName || exam.title}</h3>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-4">
                <span className="text-indigo-600 font-bold">{subject.subjectName}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>{exam.classes?.map(c => c.name).join(', ') || 'N/A'}</span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center gap-2">
                    <div className="p-1.5 bg-white rounded-lg text-gray-400 shadow-sm">
                        <FileDigit size={14} />
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-gray-900">{subject.maxMarks}</span>
                        <span className="text-[9px] text-gray-400 font-medium">Max Marks</span>
                    </div>
                </div>
                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center gap-2">
                    <div className="p-1.5 bg-white rounded-lg text-gray-400 shadow-sm">
                        <Layers size={14} />
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-gray-900">{subject.passingMarks}</span>
                        <span className="text-[9px] text-gray-400 font-medium">Passing</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gray-50 flex justify-end">
                {isPublished ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); onEnterMarks(exam); }}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                        Enter Marks <ArrowRight size={14} />
                    </button>
                ) : (
                    <button
                        onClick={(e) => { e.stopPropagation(); onEnterMarks(exam); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isCompleted ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        {isCompleted ? <><CheckCircle size={14} /> View Marks</> : 'View Details'}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default ExamCard;
