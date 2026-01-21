
import React, { useState } from 'react';
import { RotateCcw, Info } from 'lucide-react';

const RefundRulesPanel = ({ isLocked }) => {

    const [rules, setRules] = useState({
        allowed: false,
        windowDays: 30, // Request window
        deductionPercent: 10, // Default admin charge
        allowPartial: false
    });

    const handleChange = (field, value) => {
        if (isLocked) return;
        setRules(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <RotateCcw className="text-gray-500" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Refund Policy</h3>
                    <p className="text-xs text-gray-500">Rules for handling withdrawal/cancellation refunds.</p>
                </div>
            </div>

            <div className="p-6">

                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="checkbox" id="allowRefund"
                        checked={rules.allowed}
                        onChange={(e) => handleChange('allowed', e.target.checked)}
                        disabled={isLocked}
                        className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <label htmlFor="allowRefund" className="text-sm font-semibold text-gray-700">Enable Refund Operations</label>
                </div>

                {rules.allowed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-in">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Max Eligibility Window</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={rules.windowDays}
                                    disabled={isLocked}
                                    onChange={(e) => handleChange('windowDays', Number(e.target.value))}
                                    className="w-24 px-3 py-2 border border-gray-300 rounded text-sm focus:border-indigo-500"
                                />
                                <span className="text-sm text-gray-600">Days from payment</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">Refund requests are blocked after this period.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Standard Deduction</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={rules.deductionPercent}
                                    disabled={isLocked}
                                    onChange={(e) => handleChange('deductionPercent', Number(e.target.value))}
                                    className="w-24 px-3 py-2 border border-gray-300 rounded text-sm focus:border-indigo-500"
                                />
                                <span className="text-sm text-gray-600">% Processing Fee</span>
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-blue-50 p-3 rounded-lg flex gap-3 text-xs text-blue-700 border border-blue-100">
                            <Info size={16} className="shrink-0 mt-0.5" />
                            <p>
                                Refunds are never automated. These rules only validate "Eligibility" of a refund request.
                                The actual money transfer is a manual Accounts operation.
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default RefundRulesPanel;
