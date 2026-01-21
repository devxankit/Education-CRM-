
import React from 'react';
import { useLocation } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const PlaceholderPage = () => {
    const location = useLocation();
    const pathParts = location.pathname.split('/').filter(Boolean);
    const pageName = pathParts[pathParts.length - 1]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-4">
                    <FileQuestion size={40} className="text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageName}</h1>
                <p className="text-gray-600 mb-4">This page is under development</p>
                <div className="inline-block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
                    Path: {location.pathname}
                </div>
            </div>
        </div>
    );
};

export default PlaceholderPage;
