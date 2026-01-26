import React from 'react';
import { X, AlertTriangle, ArrowRight, Zap } from 'lucide-react';

const ConfigImpactPreview = ({ changes, onConfirm, onCancel }) => {

    if (!changes || changes.length === 0) return null;

    // Categorize changes
    const moduleStatusChanges = changes.filter(c => c.key.startsWith('module_'));
    const workflowChanges = changes.filter(c => !c.key.startsWith('module_'));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] scale-100">

                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Review Impact Analysis</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Configuration v1.0 → v1.1</p>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">

                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg shadow-sm">
                        <div className="flex gap-3">
                            <Zap className="text-yellow-600 shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="font-bold text-yellow-900 text-sm">System Consistency Check</p>
                                <p className="text-sm text-yellow-800 mt-1">
                                    You are modifying core system behaviors. While historical data remains safe, future workflows will adapt immediately.
                                    Users may need to refresh their sessions.
                                </p>
                            </div>
                        </div>
                    </div>

                    {moduleStatusChanges.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Module Visibility Updates</h4>
                            <div className="space-y-2">
                                {moduleStatusChanges.map((change, idx) => {
                                    const moduleName = change.key.replace('module_', '').toUpperCase();
                                    const isEnabling = change.newVal === true;
                                    return (
                                        <div key={idx} className={`flex items-center justify-between p-3 rounded border text-sm ${isEnabling ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                            <span className="font-medium text-gray-700">{moduleName} MODULE</span>
                                            <span className={`font-bold text-xs px-2 py-0.5 rounded ${isEnabling ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                                {isEnabling ? 'ENABLING' : 'DISABLING'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {workflowChanges.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Workflow & Policy Updates</h4>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-2">Setting</th>
                                            <th className="px-4 py-2">Previous</th>
                                            <th className="px-4 py-2">New</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {workflowChanges.map((change, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 font-medium text-gray-900">{change.label}</td>
                                                <td className="px-4 py-2 text-gray-500 truncate max-w-[120px]">{String(change.oldVal)}</td>
                                                <td className="px-4 py-2 font-medium text-indigo-600 truncate max-w-[120px]">{String(change.newVal)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                            <input type="checkbox" className="mt-1 rounded text-indigo-600 focus:ring-indigo-500" />
                            <span className="text-sm text-gray-600">
                                I confirm these changes are intentional and I assume responsibility for the workflow impact.
                            </span>
                        </label>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                    >
                        Back to Edit
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md font-medium transition-colors"
                    >
                        Confirm & Apply
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ConfigImpactPreview;
