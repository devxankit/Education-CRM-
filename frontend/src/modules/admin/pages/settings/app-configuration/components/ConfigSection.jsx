import React, { useState } from 'react';
import { Save, AlertTriangle } from 'lucide-react';

const ConfigSection = ({ title, description, children, isDirty }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{description}</p>
                </div>
                {isDirty && (
                    <div className="flex items-center gap-2 text-orange-600 text-xs font-semibold bg-orange-50 px-2 py-1 rounded border border-orange-100 animate-pulse">
                        <AlertTriangle size={12} /> Modified
                    </div>
                )}
            </div>

            <div className="p-6 space-y-6">
                {children}
            </div>
        </div>
    );
};

export default ConfigSection;
