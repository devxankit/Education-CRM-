
import React from 'react';
import { AlertTriangle, X, CheckCircle, Users, FileWarning } from 'lucide-react';

const RuleImpactPreview = ({ isOpen, onClose, onConfirm, stats }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Confirm Rule Activation</h3>
                            <p className="text-sm text-amber-700">These changes will immediately affect system access.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Impact Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-center">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Affected Students</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.affectedUsers}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-center">
                            <p className="text-xs text-red-600 uppercase tracking-wide font-semibold mb-1">Blocked Admissions</p>
                            <p className="text-3xl font-bold text-red-700">{stats.blockedAdmissions}</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 text-center">
                            <p className="text-xs text-orange-600 uppercase tracking-wide font-semibold mb-1">Pending Verifications</p>
                            <p className="text-3xl font-bold text-orange-700">{stats.pendingVerifications}</p>
                        </div>
                    </div>

                    {/* Warning List */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <FileWarning size={18} className="text-gray-500" />
                            Critical Impact Analysis
                        </h4>
                        <ul className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span><strong>Hard Block</strong> applied to "Transfer Certificate". 12 pending admissions will be halted immediately.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">•</span>
                                <span><strong>Expiry Rule</strong> enabled for "Medical Fitness". 45 students will be flagged for re-validation.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span>Version <strong>v1.2</strong> will be archived. This action is irreversible.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Confirmation Checkbox */}
                    <label className="flex items-center gap-3 p-4 border border-indigo-100 bg-indigo-50 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors">
                        <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                        <span className="text-sm font-medium text-indigo-900">
                            I understand the impact of these rules and authorize the activation.
                        </span>
                    </label>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md flex items-center gap-2"
                    >
                        <CheckCircle size={18} />
                        Confirm & Activate
                    </button>
                </div>

            </div>
        </div>
    );
};

export default RuleImpactPreview;
