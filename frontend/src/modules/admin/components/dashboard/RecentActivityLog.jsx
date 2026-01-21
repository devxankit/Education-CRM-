
import React from 'react';
import { FileText, Eye } from 'lucide-react';

const RecentActivityLog = () => {
    const logs = [
        { id: 1, user: 'Super Admin', action: 'Locked Academic Year 2024-25', time: '10 mins ago' },
        { id: 2, user: 'Academics Head', action: 'Published Final Exam Schedule', time: '1 hour ago' },
        { id: 3, user: 'Finance Manager', action: 'Updated Fee Structure Class 10', time: '3 hours ago' },
        { id: 4, user: 'System', action: 'Auto-backup completed', time: '4 hours ago' }
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <FileText size={20} className="text-gray-600" />
                    Recent Activity
                </h2>
                <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                    View Full Audit <Eye size={12} />
                </button>
            </div>

            <div className="space-y-4">
                {logs.map((log, index) => (
                    <div key={log.id} className="flex items-start gap-3 relative pb-4 last:pb-0 last:border-0 border-l border-gray-100 pl-4 ml-2">
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-gray-200 rounded-full border-2 border-white ring-1 ring-gray-100"></div>
                        <div>
                            <p className="text-sm text-gray-900">
                                <span className="font-semibold">{log.user}</span> {log.action}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{log.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivityLog;
