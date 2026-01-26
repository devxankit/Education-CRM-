import React from 'react';
import { Monitor, Sun, Moon } from 'lucide-react';

const SystemDefaultsForm = ({ values, onChange }) => {
    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Dashboard Landings */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Default Dashboard Landing Pages</label>
                    <p className="text-xs text-gray-500 mb-4">Set the first page users see upon login based on their role.</p>

                    <div className="space-y-3">
                        {['Student', 'Teacher', 'Admin'].map(role => (
                            <div key={role} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                                <span className="text-sm font-medium text-gray-700">{role} Role</span>
                                <select
                                    className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:border-indigo-500"
                                    value={values[`dashboard${role}`] || 'Dashboard'}
                                    onChange={(e) => onChange(`dashboard${role}`, e.target.value)}
                                >
                                    <option value="Dashboard">Dashboard (Default)</option>
                                    <option value="Profile">My Profile</option>
                                    <option value="Notices">Notices Board</option>
                                    {role === 'Student' && <option value="Academics">Academics</option>}
                                    {role === 'Admin' && <option value="Reports">Reports Overview</option>}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                {/* UI Preferences */}
                <div className="space-y-6">

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Default Theme Mode</label>
                        <div className="flex gap-3">
                            {[
                                { id: 'light', label: 'Light', icon: Sun },
                                { id: 'dark', label: 'Dark', icon: Moon },
                                { id: 'system', label: 'System', icon: Monitor }
                            ].map((mode) => {
                                const Icon = mode.icon;
                                const isSelected = values.themeMode === mode.id;
                                return (
                                    <button
                                        key={mode.id}
                                        onClick={() => onChange('themeMode', mode.id)}
                                        className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${isSelected ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <Icon size={20} />
                                        <span className="text-xs">{mode.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Records Per Page</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                            value={values.paginationLimit}
                            onChange={(e) => onChange('paginationLimit', e.target.value)}
                        >
                            <option value="10">10 Rows</option>
                            <option value="25">25 Rows (Recommended)</option>
                            <option value="50">50 Rows</option>
                            <option value="100">100 Rows</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Session Timeout</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min="15"
                                max="120"
                                step="15"
                                className="flex-1 accent-indigo-600"
                                value={values.sessionTimeout}
                                onChange={(e) => onChange('sessionTimeout', e.target.value)}
                            />
                            <span className="text-sm font-medium w-24 text-right">{values.sessionTimeout} min</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Users will be logged out after inactivity.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SystemDefaultsForm;
