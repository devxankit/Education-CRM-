
import React from 'react';

const ProgramStatusBadge = ({ status }) => {
    const isActive = status === 'active';

    return (
        <span className={`
            inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border
            ${isActive
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-gray-100 text-gray-500 border-gray-200'
            }
        `}>
            {isActive ? 'Active Intake' : 'Archived'}
        </span>
    );
};

export default ProgramStatusBadge;
