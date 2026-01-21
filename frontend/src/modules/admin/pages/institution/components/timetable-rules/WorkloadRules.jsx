
import React from 'react';
import { Briefcase, AlertTriangle } from 'lucide-react';

const WorkloadRules = ({ ruleData, onChange, isLocked }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <Briefcase size={18} className="text-indigo-600" />
                <h2 className="font-semibold text-gray-800">Teacher Workload Safety</h2>
            </div>

            <div className="p-6">
                <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded mb-6 flex gap-2">
                    <AlertTriangle size={16} className="shrink-0" />
                    These rules prevent the auto-scheduler from assigning excessive workload to faculty members.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Max Continuous Lectures</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                            value={ruleData.maxConsecutive}
                            onChange={(e) => onChange('maxConsecutive', e.target.value)}
                            disabled={isLocked}
                        />
                        <p className="text-xs text-gray-400 mt-1">Force break after X periods</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Max Weekly Hours</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                            value={ruleData.maxWeeklyHours}
                            onChange={(e) => onChange('maxWeeklyHours', e.target.value)}
                            disabled={isLocked}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Min Free Periods / Day</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                            value={ruleData.minFreePeriods}
                            onChange={(e) => onChange('minFreePeriods', e.target.value)}
                            disabled={isLocked}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkloadRules;
