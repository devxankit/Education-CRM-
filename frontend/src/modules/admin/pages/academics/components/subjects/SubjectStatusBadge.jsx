
import React from 'react';

const SubjectStatusBadge = ({ status }) => {
    const isActive = status === 'active';

    return (
        <span className={`
            inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border
            ${isActive
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-gray-100 text-gray-500 border-gray-200'
            }
        `}>
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );
};

export default SubjectStatusBadge;
