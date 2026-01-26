import React from 'react';

const ReportStatusBadge = ({ status }) => {
    const styles = {
        draft: 'bg-gray-100 text-gray-600 border-gray-200',
        active: 'bg-green-50 text-green-700 border-green-200',
        archived: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        deprecated: 'bg-red-50 text-red-700 border-red-200'
    };

    const labels = {
        draft: 'Draft',
        active: 'Active',
        archived: 'Archived',
        deprecated: 'Deprecated'
    };

    const statusKey = status?.toLowerCase() || 'draft';

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[statusKey] || styles.draft}`}>
            {labels[statusKey] || status}
        </span>
    );
};

export default ReportStatusBadge;
