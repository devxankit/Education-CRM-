import React from 'react';
import { ArrowDownAZ, ArrowUpAZ, Layers } from 'lucide-react';

const GroupingPanel = ({ config, fields, onUpdate }) => {

    const handleChange = (key, value) => {
        onUpdate({ ...config, [key]: value });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">Organization</h3>
                <p className="text-sm text-gray-500">Configure how the data should be sorted and grouped in the final output.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Sorting */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-4">
                        <ArrowDownAZ size={18} className="text-indigo-600" /> Sort Order
                    </h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Primary Sort Column</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500"
                                value={config.sortBy || ''}
                                onChange={(e) => handleChange('sortBy', e.target.value)}
                            >
                                <option value="">No Sorting (Default)</option>
                                {fields.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sortOrder"
                                    checked={config.sortOrder === 'asc'}
                                    onChange={() => handleChange('sortOrder', 'asc')}
                                    className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700 flex items-center gap-1"><ArrowDownAZ size={14} /> Ascending</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sortOrder"
                                    checked={config.sortOrder === 'desc'}
                                    onChange={() => handleChange('sortOrder', 'desc')}
                                    className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700 flex items-center gap-1"><ArrowUpAZ size={14} /> Descending</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Grouping */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-4">
                        <Layers size={18} className="text-indigo-600" /> Grouping & Aggregates
                    </h4>
                    <p className="text-xs text-gray-500 mb-4 bg-yellow-50 p-2 rounded border border-yellow-100">
                        Grouping will collapse rows based on the selected field. Ensure other fields support aggregation (Count, Sum).
                    </p>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Group By</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500"
                            value={config.groupBy || ''}
                            onChange={(e) => handleChange('groupBy', e.target.value)}
                        >
                            <option value="">No Grouping (Detail View)</option>
                            {fields.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>

                    {config.groupBy && (
                        <div className="mt-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.showCount}
                                    onChange={(e) => handleChange('showCount', e.target.checked)}
                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">Show Row Count</span>
                            </label>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default GroupingPanel;
