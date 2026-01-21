
import React from 'react';

const YearStatusBadge = ({ status }) => {

    let colorClass, label;

    switch (status) {
        case 'active':
            colorClass = 'bg-green-50 text-green-700 border-green-200';
            label = 'ACTIVE SESSION';
            break;
        case 'upcoming':
            colorClass = 'bg-blue-50 text-blue-700 border-blue-200';
            label = 'UPCOMING';
            break;
        case 'closed':
            colorClass = 'bg-gray-100 text-gray-500 border-gray-200';
            label = 'CLOSED / ARCHIVED';
            break;
        default:
            colorClass = 'bg-gray-50 text-gray-500 border-gray-200';
            label = status;
    }

    return (
        <span className={`
            inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold tracking-wider border uppercase
            ${colorClass}
        `}>
            {label}
            {status === 'active' && <span className="ml-1.5 flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>}
        </span>
    );
};

export default YearStatusBadge;
