
import React from 'react';

const HolidayTypeLegend = () => {
    const types = [
        { label: 'Academic Holiday', color: 'bg-blue-100 text-blue-800 border-blue-200' },
        { label: 'Exam Holiday', color: 'bg-purple-100 text-purple-800 border-purple-200' },
        { label: 'Staff Holiday', color: 'bg-green-100 text-green-800 border-green-200' },
        { label: 'Restricted Holiday', color: 'bg-amber-100 text-amber-800 border-amber-200' }
    ];

    return (
        <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-xs">
            {types.map((type, i) => (
                <div key={i} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full border ${type.color.replace('text-', 'border-').split(' ')[2] || 'border-gray-300'} ${type.color.split(' ')[0]}`}></span>
                    <span className="text-gray-600 font-medium">{type.label}</span>
                </div>
            ))}
        </div>
    );
};

export default HolidayTypeLegend;
