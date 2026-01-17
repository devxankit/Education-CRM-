
import React from 'react';
import { Mail, AlertCircle, FileText, CheckCircle } from 'lucide-react';

const NoticeCard = ({ notice, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`group bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden ${notice.isRead ? 'border-gray-100 opacity-80' : 'border-indigo-100 bg-indigo-50/10'
                }`}
        >
            {/* Unread Indicator */}
            {!notice.isRead && (
                <div className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full"></div>
            )}

            <div className="flex justify-between items-start mb-2 pr-4">
                <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wide ${notice.category === 'Fee' ? 'bg-green-50 text-green-700' :
                        notice.category === 'Exam' ? 'bg-orange-50 text-orange-700' :
                            'bg-gray-100 text-gray-500'
                    }`}>
                    {notice.category}
                </span>
                <span className="text-[10px] font-medium text-gray-400">{notice.date}</span>
            </div>

            <h3 className={`text-sm font-bold mb-2 group-hover:text-indigo-600 transition-colors ${notice.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{notice.title}</h3>

            <div className="flex items-center gap-2 mt-3">
                {notice.isImportant && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                        <AlertCircle size={10} /> Important
                    </span>
                )}
                {notice.requiresAck && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        <FileText size={10} /> Acknowledge
                    </span>
                )}
            </div>
        </div>
    );
};

export default NoticeCard;
