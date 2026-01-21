
import React from 'react';

const CapacityIndicator = ({ total, used, label }) => {

    const percentage = Math.min(100, Math.round((used / total) * 100)) || 0;

    const getColor = (pct) => {
        if (pct >= 100) return 'bg-red-500';
        if (pct >= 80) return 'bg-orange-500';
        return 'bg-green-500';
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">{label || 'Capacity'}</span>
                <span className="text-[10px] font-bold text-gray-700">{used} / {total}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-300 ${getColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default CapacityIndicator;
