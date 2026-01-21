
import React from 'react';

const UserStatusBadge = ({ status }) => {
    const isActive = status === 'active';

    return (
        <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
            ${isActive
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }
        `}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {isActive ? 'Active' : 'Suspended'}
        </span>
    );
};

export default UserStatusBadge;
