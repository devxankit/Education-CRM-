
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye } from 'lucide-react';

const RecentActivityLog = ({ recentActivity = [] }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <FileText size={20} className="text-gray-600" />
                    Recent Activity
                </h2>
                <Link to="/admin/audit/user-activity" className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    View Full Audit <Eye size={12} />
                </Link>
            </div>

            <div className="space-y-4">
                {recentActivity.length === 0 ? (
                    <p className="text-sm text-gray-500 py-2">No recent activity.</p>
                ) : (
                    recentActivity.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 relative pb-4 last:pb-0 last:border-0 border-l border-gray-100 pl-4 ml-2">
                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-gray-200 rounded-full border-2 border-white ring-1 ring-gray-100" />
                            <div>
                                <p className="text-sm text-gray-900">
                                    <span className="font-semibold">{log.user}</span> {log.action}
                                    {log.target ? ` ${log.target}` : ''}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{log.time}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentActivityLog;
