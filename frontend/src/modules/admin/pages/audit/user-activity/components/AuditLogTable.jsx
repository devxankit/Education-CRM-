import React, { useState } from 'react';
import { Eye, ShieldAlert, LogIn, Edit, Trash, PlusCircle } from 'lucide-react';
import AuditDetailModal from './AuditDetailModal';

const AuditLogTable = ({ logs }) => {

    const [selectedLog, setSelectedLog] = useState(null);

    const getActionIcon = (type) => {
        switch (type) {
            case 'login': return <LogIn size={16} className="text-blue-500" />;
            case 'create': return <PlusCircle size={16} className="text-green-500" />;
            case 'update': return <Edit size={16} className="text-orange-500" />;
            case 'delete': return <Trash size={16} className="text-red-500" />;
            case 'security': return <ShieldAlert size={16} className="text-red-600" />;
            default: return <Edit size={16} className="text-gray-500" />;
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">

            {/* Table Header */}
            <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 whitespace-nowrap">Timestamp</th>
                            <th className="px-6 py-3 whitespace-nowrap">User / Actor</th>
                            <th className="px-6 py-3 whitespace-nowrap">Action Type</th>
                            <th className="px-6 py-3 whitespace-nowrap">Module</th>
                            <th className="px-6 py-3 whitespace-nowrap">IP Address</th>
                            <th className="px-6 py-3 whitespace-nowrap w-24">Status</th>
                            <th className="px-6 py-3 text-right">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50 hover:cursor-default transition-colors group">
                                <td className="px-6 py-3 font-mono text-gray-500 text-xs">
                                    {log.timestamp}
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                            {log.user[0]}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{log.user}</div>
                                            <div className="text-[10px] text-gray-400 capitalize">{log.role}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex items-center gap-2 text-gray-700 capitalize">
                                        {getActionIcon(log.actionType)}
                                        {log.action}
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600 border border-gray-200">
                                        {log.module}
                                    </span>
                                </td>
                                <td className="px-6 py-3 font-mono text-xs text-gray-500">
                                    {log.ip}
                                </td>
                                <td className="px-6 py-3">
                                    {log.status === 'success' ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                            Success
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100 animate-pulse">
                                            Failed
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <button
                                        onClick={() => setSelectedLog(log)}
                                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                        title="View Payload"
                                    >
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Mock */}
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
                <span>Showing 1-10 of {logs.length} records</span>
                <div className="flex gap-2">
                    <button disabled className="px-3 py-1 border rounded bg-white text-gray-300 cursor-not-allowed">Previous</button>
                    <button className="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-50">Next</button>
                </div>
            </div>

            {selectedLog && (
                <AuditDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
            )}

        </div>
    );
};

export default AuditLogTable;
