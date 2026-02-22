
import React from 'react';
import { Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const HomeworkCard = ({ homework, onClick }) => {
    // Status Logic
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Submitted': return 'bg-green-50 text-green-700 border-green-100';
            case 'Late': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-yellow-50 text-yellow-700 border-yellow-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Submitted': return CheckCircle;
            case 'Late': return AlertTriangle;
            default: return Clock;
        }
    };

    const StatusIcon = getStatusIcon(homework.status);

    return (
        <div
            onClick={onClick}
            className="group bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
        >
            <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider border-b border-l ${getStatusStyle(homework.status)}`}>
                <div className="flex items-center gap-1">
                    <StatusIcon size={12} />
                    {homework.status}
                </div>
            </div>

            <div className="pr-20 mb-2">
                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded mb-1 uppercase tracking-wide">
                    {homework.subject}
                </span>
                <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {homework.title}
                </h3>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-1.5 text-gray-500">
                    <Calendar size={14} />
                    <span className="text-xs font-medium">Due: {homework.dueDate ? new Date(homework.dueDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                {homework.teacher && (
                    <span className="text-[10px] font-medium text-gray-400">
                        {homework.teacher}
                    </span>
                )}
            </div>
        </div>
    );
};

export default HomeworkCard;
