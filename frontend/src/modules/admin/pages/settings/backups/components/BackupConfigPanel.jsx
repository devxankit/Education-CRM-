import React, { useState } from 'react';
import { Save, History } from 'lucide-react';

const BackupConfigPanel = ({ config, onSave }) => {

    const [values, setValues] = useState(config);

    const handleChange = (key, val) => {
        setValues(prev => ({ ...prev, [key]: val }));
    };

    const handleToggleScope = (key) => {
        setValues(prev => ({
            ...prev,
            scope: { ...prev.scope, [key]: !prev.scope[key] }
        }));
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <History size={18} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Automated Backup Rules</h3>
                    <p className="text-xs text-gray-500">Configure schedule and retention for auto-backups.</p>
                </div>
            </div>

            <div className="p-6 space-y-6">

                {/* Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Frequency</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500 bg-white"
                            value={values.frequency}
                            onChange={(e) => handleChange('frequency', e.target.value)}
                        >
                            <option value="daily">Daily (Recommended)</option>
                            <option value="weekly">Weekly</option>
                            <option value="manual">Manual Only</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Time (UTC)</label>
                        <input
                            type="time"
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500"
                            value={values.time}
                            onChange={(e) => handleChange('time', e.target.value)}
                            disabled={values.frequency === 'manual'}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Retention</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500 bg-white"
                            value={values.retention}
                            onChange={(e) => handleChange('retention', e.target.value)}
                        >
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="90">Last 90 Days</option>
                            <option value="365">1 Year</option>
                        </select>
                    </div>
                </div>

                {/* Scope */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Backup Scope</label>
                    <div className="flex gap-4">
                        {['database', 'documents', 'configs'].map((key) => (
                            <label key={key} className={`flex items-center gap-2 p-3 border rounded cursor-pointer transition-colors ${values.scope[key] ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'hover:bg-gray-50 border-gray-200'}`}>
                                <input
                                    type="checkbox"
                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                    checked={values.scope[key]}
                                    onChange={() => handleToggleScope(key)}
                                />
                                <span className="text-sm font-medium capitalize">{key}</span>
                            </label>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        *Database includes all records. Configurations includes system settings.
                    </p>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={() => onSave(values)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition-colors"
                    >
                        <Save size={16} /> Save Configuration
                    </button>
                </div>

            </div>
        </div>
    );
};

export default BackupConfigPanel;
