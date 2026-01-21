
import React from 'react';

const TeacherStatusBadge = ({ status }) => {

    // Statuses: Active, On Leave, Inactive

    const getStyles = () => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'On Leave':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Inactive':
                return 'bg-gray-100 text-gray-600 border-gray-200';
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

export default TeacherStatusBadge;
