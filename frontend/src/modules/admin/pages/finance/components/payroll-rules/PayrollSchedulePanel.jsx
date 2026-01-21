
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const PayrollSchedulePanel = ({ isLocked }) => {

    const [schedule, setSchedule] = useState({
        cycleStart: 1, // 1st of month
        payoutDay: 5, // 5th of next month
        autoGenerateSlips: false
    });

    const handleChange = (field, value) => {
        if (isLocked) return;
        setSchedule(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <Calendar className="text-blue-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Payroll Schedule & Cycle</h3>
                    <p className="text-xs text-gray-500">Define the monthly processing timeline.</p>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Pay Cycle Start Day</label>
                    <select
                        value={schedule.cycleStart}
                        onChange={(e) => handleChange('cycleStart', Number(e.target.value))}
                        disabled={isLocked}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white outline-none"
                    >
                        <option value="1">1st of Month (to 30th/31st)</option>
                        <option value="26">26th of Previous (to 25th)</option>
                        <option value="21">21st of Previous (to 20th)</option>
                    </select>
                    <p className="text-[10px] text-gray-400 mt-1">Defines the attendance period considered for salary.</p>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Salary Payout Day</label>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Day</span>
                        <input
                            type="number" min="1" max="31"
                            value={schedule.payoutDay}
                            disabled={isLocked}
                            onChange={(e) => handleChange('payoutDay', Number(e.target.value))}
                            className="w-16 px-3 py-2 border border-gray-300 rounded text-sm focus:border-indigo-500 text-center font-bold"
                        />
                        <span className="text-sm text-gray-600">of Next Month</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100 h-fit self-end">
                    <input
                        type="checkbox"
                        checked={schedule.autoGenerateSlips}
                        onChange={(e) => handleChange('autoGenerateSlips', e.target.checked)}
                        disabled={isLocked}
                        className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <div>
                        <label className="block text-sm font-medium text-blue-900">Auto-Generate Payslips</label>
                        <p className="text-[10px] text-blue-700">
                            Automatically generate PDF slips on Payout Day.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PayrollSchedulePanel;
