
import React from 'react';

const CategoryStatusBadge = ({ isActive }) => {
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );
};

export default CategoryStatusBadge;
