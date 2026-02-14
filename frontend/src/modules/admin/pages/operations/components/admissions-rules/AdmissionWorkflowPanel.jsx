import React from 'react';
import { GitPullRequest, ArrowRight } from 'lucide-react';

const AdmissionWorkflowPanel = ({ isLocked, data, onChange }) => {
    const config = data || {
        requireFee: true,
        requireDocs: true,
        approval: 'admin'
    };

    const handleChange = (field, value) => {
        if (isLocked) return;
        onChange({ ...config, [field]: value });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-r from-teal-50/50 to-white px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-100">
                    <GitPullRequest className="text-teal-600" size={20} />
                </div>
                <div>
                    <h3 className="text-base font-bold text-gray-900">Admission Workflow</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Define the steps from Inquiry to Enrollment.</p>
                </div>
            </div>

            <div className="p-6">

                {/* Visual Workflow */}
                <div className="flex items-center gap-2 mb-8 text-xs font-bold text-gray-600 overflow-x-auto pb-2 scrollbar-thin">
                    <div className="px-3 py-2 bg-gray-100 rounded-lg border border-gray-200 shrink-0">Inquiry</div>
                    <ArrowRight size={14} className="text-gray-400 shrink-0" />
                    <div className="px-3 py-2 bg-gray-100 rounded-lg border border-gray-200 shrink-0">Application Form</div>
                    <ArrowRight size={14} className="text-gray-400 shrink-0" />

                    {config.requireDocs && (
                        <>
                            <div className="px-3 py-2 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 shrink-0">Doc Verification</div>
                            <ArrowRight size={14} className="text-gray-400 shrink-0" />
                        </>
                    )}

                    <div className="px-3 py-2 bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-200 shrink-0">
                        Approval ({config.approval})
                    </div>
                    <ArrowRight size={14} className="text-gray-400 shrink-0" />

                    {config.requireFee && (
                        <>
                            <div className="px-3 py-2 bg-green-50 text-green-800 rounded-lg border border-green-200 shrink-0">Fee Payment</div>
                            <ArrowRight size={14} className="text-gray-400 shrink-0" />
                        </>
                    )}

                    <div className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-900 shrink-0">Confirmed</div>
                </div>

                {/* Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Prerequisites for Confirmation</label>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-white hover:shadow-sm hover:border-indigo-100 transition-all">
                                <input
                                    type="checkbox"
                                    checked={config.requireDocs}
                                    onChange={(e) => handleChange('requireDocs', e.target.checked)}
                                    disabled={isLocked}
                                    className="w-4 h-4 text-indigo-600 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Document Verification Mandatory</span>
                            </label>

                            <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-white hover:shadow-sm hover:border-indigo-100 transition-all">
                                <input
                                    type="checkbox"
                                    checked={config.requireFee}
                                    onChange={(e) => handleChange('requireFee', e.target.checked)}
                                    disabled={isLocked}
                                    className="w-4 h-4 text-indigo-600 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Fee Payment Mandatory</span>
                            </label>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AdmissionWorkflowPanel;
