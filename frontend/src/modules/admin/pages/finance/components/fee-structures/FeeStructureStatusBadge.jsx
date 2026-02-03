
import React from 'react';

const FeeStructureStatusBadge = ({ status }) => {

    // Status Logic
    const getStatusStyle = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'active':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'draft':
                return 'bg-gray-100 text-gray-600 border-gray-200';
            case 'archived':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            default:
                return 'bg-gray-50 text-gray-500 border-gray-200';
        }
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(status)}`}>
            {status}
        </span>
    );
};

export default FeeStructureStatusBadge;
