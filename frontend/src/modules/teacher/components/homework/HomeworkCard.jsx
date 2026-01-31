import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Users, FileText, ChevronRight } from 'lucide-react';

const HomeworkCard = ({ homework, onClick }) => {
    const isLate = new Date(homework.dueDate) < new Date() && homework.status === 'Active';

    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all mb-4 group cursor-pointer relative overflow-hidden"
        >
            {/* Statur Bar */}
            <div className={`absolute top-0 left-0 w-1 h-full ${homework.status === 'Active' ? 'bg-indigo-500' : (homework.status === 'Draft' ? 'bg-gray-400' : 'bg-emerald-500')}`}></div>

            <div className="pl-3">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-1 inline-block">
                            {homework.subject}
                        </span>
                        <span className="mx-2 text-[10px] text-gray-300">•</span>
                        <span className="text-[10px] font-bold text-gray-500">
                            {homework.class}
                        </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${homework.status === 'Active' ? 'bg-green-50 text-green-700' : (homework.status === 'Draft' ? 'bg-gray-100 text-gray-500' : 'bg-gray-100 text-gray-500')}`}>
                        {homework.status}
                    </span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 leading-tight mb-2 group-hover:text-indigo-700 transition-colors">
                    {homework.title}
                </h3>

                {homework.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                        {homework.description}
                    </p>
                )}

                <div className="flex items-center gap-4 text-[11px] text-gray-500 font-medium mb-3">
                    <span className={`flex items-center gap-1 ${isLate ? 'text-red-500' : ''}`}>
                        <Clock size={12} />
                        Due: {new Date(homework.dueDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users size={12} />
                        {homework.submissionCount}/{homework.totalStudents} Submitted
                    </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <FileText size={12} />
                        <span>{homework.attachments.length} Attachment(s)</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                        className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                        Detail <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default HomeworkCard;
