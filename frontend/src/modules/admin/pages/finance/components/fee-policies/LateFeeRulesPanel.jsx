
import React, { useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const LateFeeRulesPanel = ({ isLocked }) => {

    const [rules, setRules] = useState({
        enabled: true,
        gracePeriod: 7,
        type: 'flat', // flat | percentage
        value: 50,
        frequency: 'daily', // one-time | daily | weekly
        maxCap: 1000
    });

    const handleChange = (field, value) => {
        if (isLocked) return;
        setRules(prev => ({ ...prev, [field]: value }));
    };

    if (!rules.enabled) {
        return (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 flex justify-between items-center opacity-75">
                <div className="flex items-center gap-3">
                    <Clock className="text-gray-400" size={24} />
                    <div>
                        <h3 className="text-sm font-bold text-gray-700">Late Fee Penalties</h3>
                        <p className="text-xs text-gray-500">Currently Disabled. No fines will be charged.</p>
                    </div>
                </div>
                <button
                    disabled={isLocked}
                    onClick={() => handleChange('enabled', true)}
                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                    Enable Late Fees
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Clock className="text-orange-600" size={20} />
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Late Fee Penalties</h3>
                        <p className="text-xs text-gray-500">Fine calculation logic for overdue payments.</p>
                    </div>
                </div>
                <button
                    disabled={isLocked}
                    onClick={() => handleChange('enabled', false)}
                    className="text-xs text-red-600 hover:underline disabled:opacity-50"
                >
                    Disable
                </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Grace Period</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={rules.gracePeriod}
                            disabled={isLocked}
                            onChange={(e) => handleChange('gracePeriod', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-indigo-500"
                        />
                        <span className="text-sm text-gray-600">Days</span>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Fine Type</label>
                    <select
                        value={rules.type}
                        disabled={isLocked}
                        onChange={(e) => handleChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white outline-none"
                    >
                        <option value="flat">Flat Amount ($)</option>
                        <option value="percentage">Percentage (%)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Value</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={rules.value}
                            disabled={isLocked}
                            onChange={(e) => handleChange('value', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-indigo-500"
                        />
                        <span className="absolute right-3 top-2 text-xs text-gray-400 font-bold">
                            {rules.type === 'percentage' ? '%' : '$'}
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Frequency</label>
                    <select
                        value={rules.frequency}
                        disabled={isLocked}
                        onChange={(e) => handleChange('frequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white outline-none"
                    >
                        <option value="one-time">One-time Fine</option>
                        <option value="daily">Daily (Per Day)</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>

                {/* Max Cap */}
                <div className="md:col-span-4 bg-orange-50 p-3 rounded-lg flex items-center gap-3 border border-orange-100">
                    <AlertTriangle size={16} className="text-orange-600 shrink-0" />
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-orange-800 mb-0.5">Maximum Late Fee Cap</label>
                        <p className="text-[10px] text-orange-700">Stop charging fines once the total penalty reaches this amount.</p>
                    </div>
                    <div className="w-32 bg-white rounded border border-orange-200">
                        <input
                            type="number"
                            value={rules.maxCap}
                            disabled={isLocked}
                            onChange={(e) => handleChange('maxCap', Number(e.target.value))}
                            className="w-full px-2 py-1 text-sm bg-transparent outline-none text-right font-mono"
                            placeholder="Current Cap"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LateFeeRulesPanel;
