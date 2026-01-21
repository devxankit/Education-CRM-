
import React from 'react';

const HostelConfigStatusBadge = ({ status }) => {

    // Status: draft | active | locked

    const getStyles = () => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'locked':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'draft':
            default:
                return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getLabel = () => {
        switch (status) {
            case 'active': return 'Active';
            case 'locked': return 'Locked & Enforced';
            case 'draft': return 'Draft Mode';
            default: return 'Draft';
        }
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${getStyles()}`}>
            {getLabel()}
        </span>
    );
};

export default HostelConfigStatusBadge;
