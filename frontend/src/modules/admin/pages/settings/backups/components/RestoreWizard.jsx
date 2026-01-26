import React, { useState } from 'react';
import { ArchiveRestore, AlertTriangle, Check, X, ShieldAlert } from 'lucide-react';

const RestoreWizard = ({ backup, onConfirm, onCancel }) => {

    // Steps: 0: Impact, 1: Scope, 2: Verification
    const [step, setStep] = useState(0);
    const [confirmationText, setConfirmationText] = useState('');
    const [restoreScope, setRestoreScope] = useState('full'); // full | config | db

    const isConfirmed = confirmationText === 'RESTORE SYSTEM';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-5 border-b border-red-100 bg-red-50 flex items-center gap-4">
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                        <ArchiveRestore size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-red-900">System Restoration Wizard</h3>
                        <p className="text-xs text-red-700">Restore Point: {backup.id} ({backup.date} {backup.time})</p>
                    </div>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Content Body */}
                <div className="p-8 space-y-6 overflow-y-auto">

                    {step === 0 && (
                        <div className="space-y-6">
                            <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                                <div className="flex gap-3">
                                    <ShieldAlert className="text-orange-600 shrink-0" size={24} />
                                    <div>
                                        <h4 className="font-bold text-orange-900 text-sm uppercase">Critical Warning</h4>
                                        <p className="text-sm text-orange-800 mt-2 leading-relaxed">
                                            This action is <strong>destructive</strong>. Restoring the system will overwrite current data with the snapshot from {backup.date}.
                                            Any data created after this date will be permanently lost unless backed up separately.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <h4 className="font-bold text-gray-800">Select Restore Scope</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { id: 'full', label: 'Full System Restore', desc: 'Database + Files + Configs' },
                                    { id: 'db', label: 'Database Only', desc: 'Only Records (Students, Fees)' },
                                    { id: 'config', label: 'Configuration Only', desc: 'Settings & Workflows' }
                                ].map((opt) => (
                                    <div
                                        key={opt.id}
                                        onClick={() => setRestoreScope(opt.id)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${restoreScope === opt.id ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className="font-bold text-sm text-gray-900">{opt.label}</div>
                                        <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6 text-center py-4">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <AlertTriangle size={36} />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900">Final Confirmation Required</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                To proceed, please type <strong>RESTORE SYSTEM</strong> in the box below. This serves as your digital signature authorization.
                            </p>

                            <input
                                type="text"
                                className="w-full max-w-sm mx-auto px-4 py-3 border-2 border-red-200 rounded-lg text-center font-bold text-red-600 focus:outline-none focus:border-red-500 placeholder-red-200 uppercase"
                                placeholder="TYPE HERE"
                                value={confirmationText}
                                onChange={(e) => setConfirmationText(e.target.value)}
                                autoComplete="off"
                                onPaste={(e) => e.preventDefault()}
                            />
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                    <div className="flex gap-2">
                        {/* Steps dots */}
                        <div className={`h-2 w-2 rounded-full ${step >= 0 ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                        <div className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                    </div>

                    <div className="flex gap-3">
                        {step === 0 ? (
                            <>
                                <button onClick={onCancel} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium">Cancel</button>
                                <button onClick={() => setStep(1)} className="px-6 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md font-bold">
                                    Next: Verify
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setStep(0)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium">Back</button>
                                <button
                                    onClick={() => onConfirm(backup.id, restoreScope)}
                                    disabled={!isConfirmed}
                                    className={`px-6 py-2 text-white rounded-lg shadow-md font-bold transition-all ${isConfirmed ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'}`}
                                >
                                    EXECUTE RESTORE
                                </button>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RestoreWizard;
