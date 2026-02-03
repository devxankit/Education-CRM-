
import React, { useState } from 'react';
import { GitCommit, AlertTriangle } from 'lucide-react';

const RouteRulesPanel = ({ isLocked, data, onChange }) => {

    const limits = data || {
        maxRoutes: 15,
        maxStops: 25,
        dynamicStops: false
    };

    const handleChange = (field, value) => {
        if (isLocked) return;
        onChange({ ...limits, [field]: value });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <GitCommit className="text-blue-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Route & Hub Constraints</h3>
                    <p className="text-xs text-gray-500">Limits on network complexity.</p>
                </div>
            </div>

            <div className="p-6 space-y-6">

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Max Routes</label>
                        <input
                            type="number"
                            disabled={isLocked}
                            value={limits.maxRoutes}
                            onChange={(e) => handleChange('maxRoutes', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Max Stops / Route</label>
                        <input
                            type="number"
                            disabled={isLocked}
                            value={limits.maxStops}
                            onChange={(e) => handleChange('maxStops', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                    <div className="mt-0.5">
                        <input
                            type="checkbox"
                            checked={limits.dynamicStops}
                            onChange={(e) => handleChange('dynamicStops', e.target.checked)}
                            disabled={isLocked}
                            className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-blue-900">Allow Dynamic Ad-hoc Stops</label>
                        <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                            Permit drivers/admins to pick up students from non-standard stops in emergencies.
                            <br /><span className="italic font-medium text-blue-800">Warning: May affect route timing audits.</span>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RouteRulesPanel;
