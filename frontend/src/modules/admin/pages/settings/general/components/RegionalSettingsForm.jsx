import React from 'react';
import { Globe } from 'lucide-react';

const RegionalSettingsForm = ({ values, onChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                    value={values.timezone}
                    onChange={(e) => onChange('timezone', e.target.value)}
                >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC (Universal)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">System events will be logged in this time.</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                    value={values.dateFormat}
                    onChange={(e) => onChange('dateFormat', e.target.value)}
                >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 31/01/2025)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 01/31/2025)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                    <option value="D MMM, YYYY">D MMM, YYYY (31 Jan, 2025)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                    value={values.currency}
                    onChange={(e) => onChange('currency', e.target.value)}
                >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">System Language</label>
                <div className="relative">
                    <Globe size={16} className="absolute left-3 top-3 text-gray-400" />
                    <select
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                        value={values.language}
                        onChange={(e) => onChange('language', e.target.value)}
                    >
                        <option value="en-US">English (US)</option>
                        <option value="en-UK">English (UK)</option>
                        <option value="es">Spanish (Español) - Beta</option>
                        <option value="hi">Hindi (हिंदी) - Beta</option>
                    </select>
                </div>
            </div>

        </div>
    );
};

export default RegionalSettingsForm;
