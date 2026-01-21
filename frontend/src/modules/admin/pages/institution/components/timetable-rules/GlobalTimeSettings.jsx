
import React from 'react';
import { Clock, CalendarDays } from 'lucide-react';

const GlobalTimeSettings = ({ ruleData, onChange, isLocked }) => {

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleDayToggle = (day) => {
        if (isLocked) return;
        const currentDays = ruleData.workingDays || [];
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day];

        onChange('workingDays', newDays);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <Clock size={18} className="text-indigo-600" />
                <h2 className="font-semibold text-gray-800">Global Time Settings</h2>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Academic Day Start Time</label>
                        <input
                            type="time"
                            value={ruleData.startTime}
                            onChange={(e) => onChange('startTime', e.target.value)}
                            disabled={isLocked}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Academic Day End Time</label>
                        <input
                            type="time"
                            value={ruleData.endTime}
                            onChange={(e) => onChange('endTime', e.target.value)}
                            disabled={isLocked}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                        <CalendarDays size={16} /> Working Days Configuration
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {days.map(day => (
                            <button
                                key={day}
                                onClick={() => handleDayToggle(day)}
                                disabled={isLocked}
                                className={`
                                    px-4 py-2 rounded-lg text-sm font-medium border transition-colors
                                    ${ruleData.workingDays?.includes(day)
                                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                    }
                                    ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}
                                `}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalTimeSettings;
