
import React from 'react';

const AssetStatusBadge = ({ status }) => {

    // Statuses: Available, Assigned, Under Maintenance, Damaged, Lost, Retired

    const getStyles = () => {
        switch (status) {
            case 'Available':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Assigned':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Under Maintenance':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Damaged':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Lost':
                return 'bg-gray-800 text-white border-gray-600';
            case 'Retired':
                return 'bg-gray-100 text-gray-400 border-gray-200 line-through';
            default:
                return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${getStyles()}`}>
            {status}
        </span>
    );
};

export default AssetStatusBadge;
