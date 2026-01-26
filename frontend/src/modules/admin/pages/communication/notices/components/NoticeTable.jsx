
import React from 'react';
import { FileText, Users, Clock, AlertCircle, BarChart2, MoreVertical, Edit, Eye, CheckCircle } from 'lucide-react';

const NoticeTable = ({ notices, onAction }) => {

    const getPriorityColor = (p) => {
        switch (p) {
            case 'URGENT': return 'bg-red-100 text-red-700 border-red-200';
            case 'IMPORTANT': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-blue-50 text-blue-700 border-blue-100';
        }
    };

    const getStatusColor = (s) => {
        switch (s) {
            case 'PUBLISHED': return 'bg-green-100 text-green-700';
            case 'SCHEDULED': return 'bg-purple-100 text-purple-700';
            case 'DRAFT': return 'bg-gray-100 text-gray-700';
            case 'ARCHIVED': return 'bg-gray-50 text-gray-400';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Notice Details</th>
                        <th className="px-6 py-4">Priority / Category</th>
                        <th className="px-6 py-4">Target Audience</th>
                        <th className="px-6 py-4">Delivery</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {notices.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No notices found. Create a new notice to get started.</p>
                            </td>
                        </tr>
                    ) : (
                        notices.map((notice) => (
                            <tr key={notice.id} className="hover:bg-gray-50/50 transition-colors group">

                                {/* 1. Details */}
                                <td className="px-6 py-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-1">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 line-clamp-1">{notice.title}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <span className="font-mono">{notice.id}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {notice.publishDate}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* 2. Priority */}
                                <td className="px-6 py-4">
                                    <div className="space-y-1.5">
                                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityColor(notice.priority)}`}>
                                            {notice.priority}
                                        </span>
                                        <div className="text-sm text-gray-600">{notice.category}</div>
                                    </div>
                                </td>

                                {/* 3. Audience */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-sm text-gray-700">
                                        <Users size={16} className="text-gray-400" />
                                        <span>{notice.audienceSummary}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1 pl-5">
                                        {notice.recipientCount} Recipients
                                    </div>
                                </td>

                                {/* 4. Delivery */}
                                <td className="px-6 py-4">
                                    <div className="flex gap-1.5">
                                        {notice.channels.map(ch => (
                                            <span key={ch} className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-medium text-gray-600 uppercase">
                                                {ch}
                                            </span>
                                        ))}
                                    </div>
                                    {notice.ackRequired && (
                                        <div className="flex items-center gap-1 text-xs text-indigo-600 mt-1 font-medium">
                                            <CheckCircle size={12} /> Ack. Required
                                        </div>
                                    )}
                                </td>

                                {/* 5. Status */}
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(notice.status)}`}>
                                        {notice.status}
                                    </span>
                                </td>

                                {/* 6. Actions */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onAction('VIEW', notice)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        {notice.status === 'DRAFT' && (
                                            <button
                                                onClick={() => onAction('EDIT', notice)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Notice"
                                            >
                                                <Edit size={18} />
                                            </button>
                                        )}
                                        {notice.status !== 'DRAFT' && (
                                            <button
                                                onClick={() => onAction('STATS', notice)}
                                                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                title="View Statistics"
                                            >
                                                <BarChart2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>

                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default NoticeTable;
