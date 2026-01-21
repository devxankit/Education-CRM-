
import React from 'react';

const AcademicLevelBadge = ({ level }) => {

    let colorClass = 'bg-gray-100 text-gray-600 border-gray-200';

    switch (level?.toLowerCase()) {
        case 'primary':
            colorClass = 'bg-green-50 text-green-700 border-green-200';
            break;
        case 'secondary':
            colorClass = 'bg-blue-50 text-blue-700 border-blue-200';
            break;
        case 'senior_secondary':
            colorClass = 'bg-indigo-50 text-indigo-700 border-indigo-200';
            break;
        case 'ug':
            colorClass = 'bg-purple-50 text-purple-700 border-purple-200';
            break;
        case 'pg':
            colorClass = 'bg-pink-50 text-pink-700 border-pink-200';
            break;
        default:
            break;
    }

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
            {level?.replace('_', ' ')}
        </span>
    );
};

export default AcademicLevelBadge;
