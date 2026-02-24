
import React, { useState } from 'react';
import { CalendarX, AlertCircle } from 'lucide-react';

const LeaveDeductionPanel = ({ isLocked, data = {}, onChange }) => {

    const handleChange = (field, value) => {
        if (isLocked) return;
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm font-['Inter']">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <CalendarX className="text-orange-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Leave & Loss of Pay (LOP) Rules</h3>
                    <p className="text-xs text-gray-500">How unpaid currency affects salary calculation.</p>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* LOP Formula */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">LOP Per Day Calculation</label>
                    <div className="space-y-3">
                        <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${data.lopFormula === 'fixed_30' ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                            <input
                                type="radio"
                                name="lop"
                                checked={data.lopFormula === 'fixed_30'}
                                onChange={() => handleChange('lopFormula', 'fixed_30')}
                                disabled={isLocked}
                                className="mt-1 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div>
                                <span className="block font-medium text-gray-900 text-sm">Fixed 30 Days</span>
                                <span className="block text-xs text-gray-500 mt-1">Per Day Salary = Total Salary / 30. Consistent every month regardless of month length (Feb/Mar).</span>
                            </div>
                        </label>

                        <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${data.lopFormula === 'actual_days' ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                            <input
                                type="radio"
                                name="lop"
                                checked={data.lopFormula === 'actual_days'}
                                onChange={() => handleChange('lopFormula', 'actual_days')}
                                disabled={isLocked}
                                className="mt-1 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div>
                                <span className="block font-medium text-gray-900 text-sm">Actual Month Days</span>
                                <span className="block text-xs text-gray-500 mt-1">Per Day Salary = Total Salary / (28, 30 or 31). Value changes slightly every month.</span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Rules */}
                {/* <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">Strict Attendance Policies</label>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox" id="sandwich"
                                checked={data.sandwichRule || false}
                                onChange={(e) => handleChange('sandwichRule', e.target.checked)}
                                disabled={isLocked}
                                className="mt-1 w-4 h-4 text-indigo-600 rounded cursor-pointer"
                            />
                            <div>
                                <label htmlFor="sandwich" className="block text-sm font-medium text-gray-900 cursor-pointer">Enable "Sandwich Rule"</label>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    If an employee is absent on Friday AND Monday, the weekend (Sat/Sun) will be counted as Leave (LOP).
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox" id="weekends"
                                checked={data.includeWeekends || false}
                                onChange={(e) => handleChange('includeWeekends', e.target.checked)}
                                disabled={isLocked}
                                className="mt-1 w-4 h-4 text-indigo-600 rounded cursor-pointer"
                            />
                            <div>
                                <label htmlFor="weekends" className="block text-sm font-medium text-gray-900 cursor-pointer">Include Weekends in Continuous Leave</label>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    If leave is taken from Friday to Tuesday, Sat/Sun are counted as leave days.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-gray-400 bg-white p-2 rounded border border-gray-100 shadow-sm">
                        <AlertCircle size={12} />
                        <span>Changes up-to-date will affect payroll calculation for the CURRENT month onwards.</span>
                    </div>

                </div> */}

            </div>
        </div>
    );
};

export default LeaveDeductionPanel;
