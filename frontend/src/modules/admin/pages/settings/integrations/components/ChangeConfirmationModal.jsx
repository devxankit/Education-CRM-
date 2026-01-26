import React from 'react';
import { ShieldAlert, X } from 'lucide-react';

const ChangeConfirmationModal = ({ action, onConfirm, onCancel }) => {

    if (!action) return null;

    const { type, integrationName } = action;
    const isCritical = ['email', 'otp', 'payment'].some(k => integrationName.toLowerCase().includes(k));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col scale-100">

                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">Confirm Action</h3>
                    <button onClick={onCancel}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                </div>

                <div className="p-6 space-y-4">
                    {type === 'disable' && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <div className="flex gap-3">
                                <ShieldAlert className="text-red-600 shrink-0" />
                                <div>
                                    <p className="font-bold text-red-900 text-sm">Disabling Active Integration</p>
                                    <p className="text-sm text-red-800 mt-1">
                                        You are about to disable <strong>{integrationName}</strong>.
                                        {isCritical && " This is a CRITICAL service. Login messages, OTPs, or Payments may stop working immediately."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {type === 'enable' && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                            <p className="text-sm text-blue-900">
                                You are enabling <strong>{integrationName}</strong>. Ensure you have tested the connection before proceeding to avoid system errors.
                            </p>
                        </div>
                    )}

                    <div className="mt-4">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                            <input type="checkbox" className="mt-1 rounded text-indigo-600" />
                            <span className="text-sm text-gray-600">
                                I confirm I am authorized to modify system connectivity settings.
                            </span>
                        </label>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium">Cancel</button>
                    <button onClick={onConfirm} className={`px-6 py-2 text-white rounded-lg shadow-md font-medium ${type === 'disable' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                        Confirm {type === 'disable' ? 'Disable' : 'Enable'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ChangeConfirmationModal;
