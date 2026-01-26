import React from 'react';
import { X, AlertTriangle, ArrowRight } from 'lucide-react';

const ChangeSummaryModal = ({ changes, onConfirm, onCancel }) => {

    if (!changes || changes.length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Confirm System Changes</h3>
                        <p className="text-sm text-gray-500">Review the impact before applying changes globally.</p>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">

                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
                        <div className="flex gap-3">
                            <AlertTriangle className="text-orange-600 shrink-0" />
                            <div>
                                <p className="font-bold text-orange-900 text-sm">Warning: Global Impact</p>
                                <p className="text-sm text-orange-800 mt-1">
                                    You are about to modify <strong>{changes.length}</strong> system settings. These changes will reflect immediately for all users.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3">Setting</th>
                                    <th className="px-4 py-3">Previous Value</th>
                                    <th className="px-4 py-3">New Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {changes.map((change, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{change.label}</td>
                                        <td className="px-4 py-3 text-gray-500 truncate max-w-[150px]">{String(change.oldVal || '-')}</td>
                                        <td className="px-4 py-3 text-indigo-600 font-medium truncate max-w-[150px]">
                                            <div className="flex items-center gap-2">
                                                <ArrowRight size={14} className="text-gray-400" />
                                                {String(change.newVal)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" className="mt-1 rounded text-indigo-600" />
                            <span className="text-sm text-gray-600">
                                I verify that I am authorized to make these changes and understand the operational impact on the institution's ERP system.
                            </span>
                        </label>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md font-medium transition-colors"
                    >
                        Apply Changes
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ChangeSummaryModal;
