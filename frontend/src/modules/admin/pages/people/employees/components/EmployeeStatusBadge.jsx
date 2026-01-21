
import React from 'react';

const EmployeeStatusBadge = ({ status }) => {

    // Statuses: Draft, Active, Suspended, Exited

    const getStyles = () => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Draft':
                return 'bg-gray-100 text-gray-600 border-gray-200';
            case 'Suspended':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Exited':
                return 'bg-red-50 text-red-600 border-red-100 line-through';
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

export default EmployeeStatusBadge;
