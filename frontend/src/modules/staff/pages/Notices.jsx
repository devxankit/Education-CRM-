
import React, { useState } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { Bell, Info, AlertTriangle, CheckCircle, Clock, Calendar } from 'lucide-react';

const MOCK_NOTICES = [
    {
        id: 1,
        title: 'System Maintenance Scheduled',
        content: 'The CRM will be unavailable on Saturday from 10 PM to 12 AM for scheduled upgrades. Please save all work beforehand.',
        date: '2024-03-10',
        priority: 'High',
        type: 'System',
        isRead: false
    },
    {
        id: 2,
        title: 'Quarterly Staff Meeting',
        content: 'All staff members are required to attend the quarterly review details in the conference room. Transport Department to present stats.',
        date: '2024-03-08',
        priority: 'Normal',
        type: 'General',
        isRead: true
    },
    {
        id: 3,
        title: 'Fee Collection Policy Update',
        content: 'New guidelines for partial fee acceptance have been updated in the Accounts module. Please review before next collection.',
        date: '2024-03-05',
        priority: 'Important',
        type: 'Accounts',
        isRead: false
    }
];

const Notices = () => {
    // This page is View-Only for all staff.
    const [notices, setNotices] = useState(MOCK_NOTICES);

    const markAsRead = (id) => {
        setNotices(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    return (
        <div className="max-w-3xl mx-auto pb-20 md:pb-6 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notices & Announcements</h1>
                    <p className="text-sm text-gray-500">Stay updated with admin communications</p>
                </div>
            </div>

            {/* Notice List */}
            <div className="space-y-4">
                {notices.map(notice => (
                    <NoticeCard
                        key={notice.id}
                        notice={notice}
                        onMarkRead={() => markAsRead(notice.id)}
                    />
                ))}
            </div>

            {notices.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <Bell size={48} className="mx-auto mb-2 opacity-30" />
                    No active notices.
                </div>
            )}
        </div>
    );
};

// --- SUB-COMPONENT ---

const NoticeCard = ({ notice, onMarkRead }) => {
    const isPriority = notice.priority === 'High' || notice.priority === 'Important';

    return (
        <div className={`bg-white rounded-xl shadow-sm border overflow-hidden relative transition-all ${notice.isRead ? 'border-gray-200 opacity-80' : 'border-indigo-100 ring-1 ring-indigo-50 shadow-md'
            }`}>
            {/* Unread Indicator */}
            {!notice.isRead && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full m-3 animate-pulse border-2 border-white "></div>
            )}

            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-lg ${isPriority ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                            {isPriority ? <AlertTriangle size={16} /> : <Info size={16} />}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${notice.type === 'Accounts' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                            }`}>
                            {notice.type}
                        </span>
                    </div>
                    <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                        <Calendar size={12} /> {notice.date}
                    </span>
                </div>

                <h3 className={`font-bold text-lg mb-2 ${notice.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                    {notice.title}
                </h3>
                <p className={`text-sm leading-relaxed mb-4 ${notice.isRead ? 'text-gray-500' : 'text-gray-600'}`}>
                    {notice.content}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-xs px-2 py-1 bg-gray-50 text-gray-500 rounded font-bold">
                        Priority: {notice.priority}
                    </span>

                    {!notice.isRead ? (
                        <button
                            onClick={onMarkRead}
                            className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            <CheckCircle size={16} /> Acknowledge Read
                        </button>
                    ) : (
                        <span className="flex items-center gap-2 text-xs font-bold text-green-600">
                            <CheckCircle size={14} /> Read
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notices;