import React from 'react';

const IntegrationCategorySection = ({ title, description, children }) => {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {children}
            </div>
        </div>
    );
};

export default IntegrationCategorySection;
