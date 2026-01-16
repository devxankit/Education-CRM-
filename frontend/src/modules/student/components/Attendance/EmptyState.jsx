import React from 'react';

const EmptyState = ({ message = "No attendance data available." }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            </div>
            <p className="text-gray-500 font-medium">{message}</p>
        </div>
    );
};

export default EmptyState;
