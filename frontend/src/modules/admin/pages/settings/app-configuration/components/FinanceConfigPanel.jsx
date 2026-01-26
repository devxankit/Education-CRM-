import React from 'react';

const FinanceConfigPanel = ({ values, onChange }) => {
    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Default Fee Structure</label>
                    <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                        {['monthly', 'term', 'annual'].map((type) => (
                            <button
                                key={type}
                                onClick={() => onChange('feeStructure', type)}
                                className={`flex-1 py-1.5 text-xs font-medium rounded capitalize transition-all ${values.feeStructure === type ? 'bg-white text-indigo-700 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {type}-wise
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Sets the default template for new fee creations.</p>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Grace Period for Payments</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            min="0"
                            max="30"
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-center"
                            value={values.feeGracePeriod}
                            onChange={(e) => onChange('feeGracePeriod', parseInt(e.target.value))}
                        />
                        <span className="text-sm text-gray-600">Days after due date</span>
                    </div>
                </div>

            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-bold text-gray-800">Late Fee Policy</label>
                    <div className={`relative inline-flex items-center cursor-pointer`}>
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={values.enableLateFee}
                            onChange={(e) => onChange('enableLateFee', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </div>
                </div>

                {values.enableLateFee && (
                    <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-1">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Calculation Method</label>
                            <select
                                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm bg-white"
                                value={values.lateFeeMethod}
                                onChange={(e) => onChange('lateFeeMethod', e.target.value)}
                            >
                                <option value="fixed">Fixed Daily Amount</option>
                                <option value="percentage">Percentage of Due</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Value</label>
                            <input
                                type="number"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500"
                                value={values.lateFeeValue}
                                onChange={(e) => onChange('lateFeeValue', parseFloat(e.target.value))}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default FinanceConfigPanel;
