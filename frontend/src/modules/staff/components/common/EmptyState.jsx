
import React from 'react';

const EmptyState = ({ title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-gray-200 rounded-xl">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{title || 'No Records Found'}</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-6">{description || 'Try adjusting your search or filters to find what you are looking for.'}</p>
            {action}
        </div>
    );
};

export default EmptyState;