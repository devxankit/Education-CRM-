
import React from 'react';
import { ShieldCheck, Archive, Clock } from 'lucide-react';

const VerificationWorkflowPanel = ({ isLocked, workflow, setWorkflow }) => {

    const handleChange = (field, value) => {
        if (isLocked) return;
        setWorkflow({ ...workflow, [field]: value });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <ShieldCheck className="text-teal-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Workflow & Retention</h3>
                    <p className="text-xs text-gray-500">Approval process & data lifecycle.</p>
                </div>
            </div>

            <div className="p-6 space-y-6">

                {/* Workflow Type */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-3">Verification Process</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            onClick={() => handleChange('verificationLevel', 'single')}
                            className={`p-3 border rounded-lg cursor-pointer ${workflow.verificationLevel === 'single' ? 'bg-teal-50 border-teal-200 ring-1 ring-teal-300' : 'hover:bg-gray-50'}`}
                        >
                            <span className="text-sm font-bold text-gray-800 block">Single Level</span>
                            <span className="text-[10px] text-gray-500">Data Entry Operator verifies.</span>
                        </div>
                        <div
                            onClick={() => handleChange('verificationLevel', 'multi')}
                            className={`p-3 border rounded-lg cursor-pointer ${workflow.verificationLevel === 'multi' ? 'bg-teal-50 border-teal-200 ring-1 ring-teal-300' : 'hover:bg-gray-50'}`}
                        >
                            <span className="text-sm font-bold text-gray-800 block">Multi Level</span>
                            <span className="text-[10px] text-gray-500">Operator uploads, Admin approves.</span>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Auto Actions */}
                <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                        <input
                            type="checkbox"
                            checked={workflow.autoReject}
                            onChange={(e) => handleChange('autoReject', e.target.checked)}
                            disabled={isLocked}
                            className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-800">Auto-Reject on Mismatch</label>
                        <p className="text-xs text-gray-500 mt-1">
                            Automatically reject documents if OCR confidence is low (requires OCR module).
                        </p>
                    </div>
                </div>

                {/* Retention */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-800 font-semibold text-xs border-b border-gray-200 pb-2 mb-2">
                        <Archive size={14} /> Data Lifecycle Policy
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Retention Period</span>
                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-gray-200">
                            <input
                                type="number"
                                min="1" max="10"
                                value={workflow.retentionYears}
                                onChange={(e) => handleChange('retentionYears', Number(e.target.value))}
                                disabled={isLocked}
                                className="w-10 text-center font-bold text-sm outline-none"
                            />
                            <span className="text-xs text-gray-400">Years</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Action after Expiry</span>
                        <select
                            disabled={isLocked}
                            value={workflow.expiryAction || 'Archive'}
                            onChange={(e) => handleChange('expiryAction', e.target.value)}
                            className="bg-white border border-gray-200 text-xs rounded px-2 py-1 outline-none"
                        >
                            <option value="Archive">Auto Archive (Read-only)</option>
                            <option value="Delete">Hard Delete</option>
                        </select>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default VerificationWorkflowPanel;
