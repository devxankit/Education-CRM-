
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const PayrollSchedulePanel = ({ isLocked, data = {}, onChange }) => {

    const handleChange = (field, value) => {
        if (isLocked) return;
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm font_['Inter']">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <Calendar className="text-blue-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Payroll Schedule & Cycle</h3>
                    <p className="text-xs text-gray-500">Define the monthly processing timeline.</p>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">Pay Cycle Start Day</label>
                    <select
                        value={data.cycleStart || 1}
                        onChange={(e) => handleChange('cycleStart', Number(e.target.value))}
                        disabled={isLocked}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white outline-none cursor-pointer font-medium"
                    >
                        <option value="1">1st of Month (to 30th/31st)</option>
                        <option value="26">26th of Previous (to 25th)</option>
                        <option value="21">21st of Previous (to 20th)</option>
                    </select>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium italic">Defines the attendance period considered for salary.</p>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">Salary Payout Day</label>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 font-medium">Day</span>
                        <input
                            type="number" min="1" max="31"
                            value={data.payoutDay || 5}
                            disabled={isLocked}
                            onChange={(e) => handleChange('payoutDay', Number(e.target.value))}
                            className="w-16 px-3 py-2 border border-gray-300 rounded text-sm focus:border-indigo-500 text-center font-bold outline-none"
                        />
                        <span className="text-sm text-gray-600 font-medium">of Next Month</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100 h-fit self-end shadow-sm">
                    <input
                        type="checkbox"
                        checked={data.autoGenerateSlips || false}
                        onChange={(e) => handleChange('autoGenerateSlips', e.target.checked)}
                        disabled={isLocked}
                        className="w-5 h-5 text-indigo-600 rounded cursor-pointer"
                    />
                    <div>
                        <label className="block text-sm font-bold text-blue-900 cursor-pointer">Auto-Generate Payslips</label>
                        <p className="text-[10px] text-blue-700 font-medium">
                            Automatically generate PDF slips on Payout Day.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PayrollSchedulePanel;
