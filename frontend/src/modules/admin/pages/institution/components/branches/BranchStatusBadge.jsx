
import React from 'react';

const BranchStatusBadge = ({ isActive }) => {
    return (
        <span className={`
            inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border
            ${isActive
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-gray-100 text-gray-600 border-gray-200'
            }
        `}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            {isActive ? 'ACTIVE' : 'INACTIVE'}
        </span>
    );
};

export default BranchStatusBadge;
