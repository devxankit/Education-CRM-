
import React, { useState } from 'react';
import { X, Lock, AlertOctagon, FileCheck } from 'lucide-react';

const CloseYearModal = ({ isOpen, onClose, year, onConfirm }) => {
    const [reason, setReason] = useState('');
    const [confirmed, setConfirmed] = useState(false);

    if (!isOpen || !year) return null;

    const handleConfirm = () => {
        if (confirmed && reason.length >= 2) {
            onConfirm(year._id || year.id, reason);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in border-t-4 border-red-600">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2 text-red-700 font-bold text-lg mb-1">
                                <Lock size={24} />
                                Close Session {year.name}
                            </div>
                            <p className="text-sm text-gray-500">
                                This will mark the session as <strong className="text-gray-800">Archived / Read-Only</strong>.
                            </p>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-400"><X size={20} /></button>
                    </div>

                    {/* Information about closing */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-5 border border-gray-200">
                        <p className="text-sm text-gray-600">
                            Closing an academic year is a final step. Please ensure all examinations are completed and final reports are generated before proceeding.
                        </p>
                    </div>

                    {/* Critical Warning */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5 flex gap-3 text-red-800 text-sm">
                        <AlertOctagon className="shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="font-bold">Irreversible Action Warning</p>
                            <ul className="list-disc pl-4 mt-1 space-y-1 text-xs">
                                <li>All Marks, Attendance, and Financial data will be <strong>Frozen</strong>.</li>
                                <li>Staff cannot edit any records found in this session.</li>
                                <li>Reports will remain accessible in "Archives".</li>
                            </ul>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Audit Reason <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm"
                            placeholder="e.g. End of Financial Year Closure"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />

                        <label className="flex items-center gap-2 cursor-pointer mt-2">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                                checked={confirmed}
                                onChange={(e) => setConfirmed(e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">I understand that this action freezes historical data.</span>
                        </label>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
                        <button
                            onClick={handleConfirm}
                            disabled={!confirmed || reason.length < 2}
                            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FileCheck size={16} /> Confirm Closure
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CloseYearModal;
