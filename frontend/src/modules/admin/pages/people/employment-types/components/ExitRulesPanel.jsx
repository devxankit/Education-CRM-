
import React from 'react';
import { LogOut } from 'lucide-react';

const ExitRulesPanel = ({ data, onChange }) => {

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 mt-4">
            <h4 className="text-sm font-bold text-red-600 mb-4 flex items-center gap-2">
                <LogOut size={16} /> Exit & Separation Policy
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Notice Period (Days)</label>
                    <input
                        type="number"
                        value={data.noticePeriod || 30}
                        onChange={(e) => handleChange('noticePeriod', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Probation Period (Months)</label>
                    <input
                        type="number"
                        value={data.probationMonths || 3}
                        onChange={(e) => handleChange('probationMonths', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                <div className="col-span-2 space-y-2 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.exitApprovalRequired || true}
                            onChange={(e) => handleChange('exitApprovalRequired', e.target.checked)}
                            className="rounded text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Manager Approval Required for Resignation</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.clearanceMandatory || true}
                            onChange={(e) => handleChange('clearanceMandatory', e.target.checked)}
                            className="rounded text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Clearance Checklist Mandatory for Release</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ExitRulesPanel;
