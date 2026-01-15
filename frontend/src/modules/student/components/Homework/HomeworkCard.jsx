import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, CheckCircle, FileText, ChevronRight } from 'lucide-react';

const HomeworkCard = ({ item, onClick }) => {
    const isPending = item.status === 'Pending';
    const isOverdue = isPending && new Date(item.dueDate) < new Date();

    const statusColor = isOverdue
        ? 'bg-red-50 text-red-600 border-red-100'
        : isPending
            ? 'bg-orange-50 text-orange-600 border-orange-100'
            : 'bg-green-50 text-emerald-600 border-green-100';

    const statusIcon = isOverdue ? AlertCircle : isPending ? ClockIcon : CheckCircle;

    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(item)}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] mb-3 relative overflow-hidden"
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                    {item.subject}
                </span>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColor}`}>
                    {isOverdue ? 'Overdue' : item.status}
                </div>
            </div>

            <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight">{item.title}</h3>

            <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400" />
                    <span>Due: {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                {item.priority === 'High' && isPending && (
                    <span className="text-red-500 font-medium text-[10px]">High Priority</span>
                )}
            </div>

            <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={18} className="text-gray-300" />
            </div>
        </motion.div>
    );
};

// Simple Clock Icon component for internal use
const ClockIcon = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

export default HomeworkCard;
