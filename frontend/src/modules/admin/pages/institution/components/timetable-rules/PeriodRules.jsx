
import React from 'react';
import { LayoutGrid, Coffee } from 'lucide-react';

const PeriodRules = ({ ruleData, onChange, isLocked }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <LayoutGrid size={18} className="text-indigo-600" />
                <h2 className="font-semibold text-gray-800">Lecture & Period Structure</h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Durations */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Timings (Minutes)</h3>

                    <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-700">Standard Period Duration</label>
                        <input
                            type="number"
                            className="w-24 px-3 py-1.5 border border-gray-300 rounded text-sm text-right outline-none focus:border-indigo-500 disabled:bg-gray-50"
                            value={ruleData.periodDuration}
                            onChange={(e) => onChange('periodDuration', e.target.value)}
                            disabled={isLocked}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-700 flex items-center gap-2">
                            <Coffee size={14} className="text-amber-600" /> Short Break
                        </label>
                        <input
                            type="number"
                            className="w-24 px-3 py-1.5 border border-gray-300 rounded text-sm text-right outline-none focus:border-indigo-500 disabled:bg-gray-50"
                            value={ruleData.shortBreakDuration}
                            onChange={(e) => onChange('shortBreakDuration', e.target.value)}
                            disabled={isLocked}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-700 flex items-center gap-2">
                            <Coffee size={14} className="text-amber-600" /> Lunch Break
                        </label>
                        <input
                            type="number"
                            className="w-24 px-3 py-1.5 border border-gray-300 rounded text-sm text-right outline-none focus:border-indigo-500 disabled:bg-gray-50"
                            value={ruleData.lunchBreakDuration}
                            onChange={(e) => onChange('lunchBreakDuration', e.target.value)}
                            disabled={isLocked}
                        />
                    </div>
                </div>

                {/* Constraints */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Daily Limits</h3>

                    <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-700">Max Periods / Day (Student)</label>
                        <input
                            type="number"
                            className="w-24 px-3 py-1.5 border border-gray-300 rounded text-sm text-right outline-none focus:border-indigo-500 disabled:bg-gray-50"
                            value={ruleData.maxPeriodsStudent}
                            onChange={(e) => onChange('maxPeriodsStudent', e.target.value)}
                            disabled={isLocked}
                        />
                    </div>

                    <div className="flex justify-between items-center bg-yellow-50 p-2 rounded border border-yellow-100 -mx-2">
                        <label className="text-sm text-gray-900 font-medium">Max Periods / Day (Teacher)</label>
                        <input
                            type="number"
                            className="w-24 px-3 py-1.5 border border-yellow-300 rounded text-sm text-right outline-none focus:border-indigo-500 bg-white disabled:bg-gray-50"
                            value={ruleData.maxPeriodsTeacher}
                            onChange={(e) => onChange('maxPeriodsTeacher', e.target.value)}
                            disabled={isLocked}
                        />
                    </div>
                    <p className="text-[10px] text-gray-400 text-right">Used for workload validation</p>
                </div>
            </div>
        </div>
    );
};

export default PeriodRules;
