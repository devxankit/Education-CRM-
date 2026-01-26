import React from 'react';
import { CheckCircle, XCircle, Clock, ArchiveRestore, Download } from 'lucide-react';

const BackupHistoryTable = ({ history, onRestore }) => {

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Backup Timeline</h3>
                <span className="text-xs text-gray-500">Showing last 5 records</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 w-40">Date & Time</th>
                            <th className="px-6 py-3">Trigger Type</th>
                            <th className="px-6 py-3">Scope</th>
                            <th className="px-6 py-3">Size</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {history.map((backup) => (
                            <tr key={backup.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-3 font-medium text-gray-900">
                                    {backup.date}
                                    <div className="text-xs text-gray-400 font-normal">{backup.time}</div>
                                </td>
                                <td className="px-6 py-3">
                                    <span className={`text-xs px-2 py-0.5 rounded border ${backup.type === 'manual' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                        {backup.type === 'manual' ? 'Manual' : 'Automated'}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-gray-600 capitalize">
                                    {backup.scope}
                                </td>
                                <td className="px-6 py-3 text-gray-600 font-mono text-xs">
                                    {backup.size}
                                </td>
                                <td className="px-6 py-3">
                                    {backup.status === 'completed' && (
                                        <div className="flex items-center gap-1.5 text-green-600 font-medium text-xs">
                                            <CheckCircle size={14} /> Success
                                        </div>
                                    )}
                                    {backup.status === 'failed' && (
                                        <div className="flex items-center gap-1.5 text-red-600 font-medium text-xs">
                                            <XCircle size={14} /> Failed
                                        </div>
                                    )}
                                    {backup.status === 'processing' && (
                                        <div className="flex items-center gap-1.5 text-blue-600 font-medium text-xs">
                                            <Clock size={14} className="animate-pulse" /> Running
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            title="Download Logs"
                                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                        >
                                            <Download size={16} />
                                        </button>
                                        {backup.status === 'completed' && (
                                            <button
                                                onClick={() => onRestore(backup)}
                                                className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded text-xs font-bold transition-all"
                                            >
                                                <ArchiveRestore size={14} /> Restore
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {history.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm italic bg-gray-50">
                    No backup records found.
                </div>
            )}
        </div>
    );
};

export default BackupHistoryTable;
