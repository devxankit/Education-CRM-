
import React from 'react';
import { Check, X, Clock } from 'lucide-react';

const PendingActionsTable = () => {
    const actions = [
        { id: 1, type: 'Role Change', requestor: 'Operations Head', detail: 'Promote Staff A to Manager', time: '2 hrs ago' },
        { id: 2, type: 'Bulk Import', requestor: 'HR Admin', detail: 'Import 50 new students', time: '4 hrs ago' },
        { id: 3, type: 'Policy Update', requestor: 'Finance Head', detail: 'Update Late Fee Rules', time: '1 day ago' },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="text-amber-500" size={20} />
                    Pending Actions
                </h2>
                <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800">View All</button>
            </div>

            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-5 py-3 font-medium">Request</th>
                            <th className="px-5 py-3 font-medium">Detail</th>
                            <th className="px-5 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {actions.map(action => (
                            <tr key={action.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 py-4">
                                    <p className="font-medium text-gray-900">{action.type}</p>
                                    <p className="text-xs text-gray-500">{action.requestor}</p>
                                </td>
                                <td className="px-5 py-4">
                                    <p className="text-gray-600 truncate max-w-[200px]" title={action.detail}>{action.detail}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{action.time}</p>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Approve">
                                            <Check size={16} />
                                        </button>
                                        <button className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Reject">
                                            <X size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingActionsTable;
