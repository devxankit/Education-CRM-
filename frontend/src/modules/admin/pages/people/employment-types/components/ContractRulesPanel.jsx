
import React from 'react';
import { Scroll, Info } from 'lucide-react';

const ContractRulesPanel = ({ data, onChange, visible }) => {

    if (!visible) return null;

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-5 mt-4">
            <h4 className="text-sm font-bold text-orange-800 mb-4 flex items-center gap-2">
                <Scroll size={16} /> Contract Terms & Conditions
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duration Type</label>
                    <select
                        value={data.durationType || 'Fixed Term'}
                        onChange={(e) => handleChange('durationType', e.target.value)}
                        className="w-full text-sm border border-orange-200 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="Fixed Term">Fixed Period (Months)</option>
                        <option value="Open Ended">Open Ended / At Will</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Std. Duration (Months)</label>
                    <input
                        type="number"
                        min="1"
                        value={data.durationMonths || ''}
                        onChange={(e) => handleChange('durationMonths', e.target.value)}
                        className="w-full text-sm border border-orange-200 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                        disabled={data.durationType === 'Open Ended'}
                    />
                </div>

                <div className="col-span-2 flex items-center gap-6 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.renewalAllowed || false}
                            onChange={(e) => handleChange('renewalAllowed', e.target.checked)}
                            className="rounded text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Renewal Allowed</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.autoExpire || false}
                            onChange={(e) => handleChange('autoExpire', e.target.checked)}
                            className="rounded text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Auto-Expire on End Date</span>
                    </label>
                </div>

                <div className="col-span-2 bg-orange-100 p-3 rounded text-xs text-orange-800 flex items-start gap-2">
                    <Info size={14} className="shrink-0 mt-0.5" />
                    <p>Alerts will be sent 30 days before contract expiry. Auto-expiry will automatically mark employees as 'Inactive'.</p>
                </div>
            </div>
        </div>
    );
};

export default ContractRulesPanel;
