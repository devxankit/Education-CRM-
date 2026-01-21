
import React, { useState } from 'react';
import { X, PlayCircle, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const ActivateYearModal = ({ isOpen, onClose, year, onConfirm }) => {
    const [reason, setReason] = useState('');
    const [confirmed, setConfirmed] = useState(false);

    if (!isOpen || !year) return null;

    // Mock Checklist
    const checks = [
        { label: 'Institution Profile Locked', status: true },
        { label: 'At least 1 Branch Configured', status: true },
        { label: 'Classes & Sections Defined', status: true }, // Ideally checking real data
        { label: 'Fee Structures Approved', status: false } // Example failing check (visual only for now)
    ];

    const handleConfirm = () => {
        if (confirmed && reason.length > 5) {
            onConfirm(year.id, reason);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in border-t-4 border-green-500">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2 text-green-700 font-bold text-lg mb-1">
                                <PlayCircle size={24} />
                                Activate Session {year.name}
                            </div>
                            <p className="text-sm text-gray-500">
                                This will act as the <strong className="text-gray-800">System Current Year</strong>.
                            </p>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-400"><X size={20} /></button>
                    </div>

                    {/* Prerequisite Checklist */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-5 border border-gray-200">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                            System Readiness Check
                        </h4>
                        <div className="space-y-2">
                            {checks.map((check, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    {check.status ? (
                                        <CheckCircle2 size={16} className="text-green-500" />
                                    ) : (
                                        <AlertTriangle size={16} className="text-amber-500" />
                                    )}
                                    <span className={check.status ? 'text-gray-700' : 'text-amber-700 font-medium'}>
                                        {check.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Critical Warning */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5 flex gap-3 text-amber-800 text-sm">
                        <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="font-bold">Critical System Action</p>
                            <ul className="list-disc pl-4 mt-1 space-y-1 text-xs">
                                <li>Any previous Active Session will be <strong>Automatically Closed</strong>.</li>
                                <li>All new admissions and fees will be linked to <strong>{year.name}</strong>.</li>
                                <li>System context will switch immediately for all users.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Audit Reason <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                            placeholder="e.g. Starting New Academic Session 2026"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />

                        <label className="flex items-center gap-2 cursor-pointer mt-2">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                                checked={confirmed}
                                onChange={(e) => setConfirmed(e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">I confirm that all prerequisites are met.</span>
                        </label>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
                        <button
                            onClick={handleConfirm}
                            disabled={!confirmed || reason.length < 5}
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShieldCheck size={16} /> Confirm Activation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivateYearModal;
