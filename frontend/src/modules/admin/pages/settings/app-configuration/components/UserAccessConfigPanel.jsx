import React from 'react';

const UserAccessConfigPanel = ({ values, onChange }) => {
    return (
        <div className="space-y-4">

            <label className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div>
                    <span className="block text-sm font-bold text-gray-900">Allow Multiple Active Sessions</span>
                    <span className="block text-xs text-gray-500 mt-0.5">If disabled, logging in on a new device will logout previous sessions.</span>
                </div>
                <div className={`relative inline-flex items-center cursor-pointer`}>
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={values.allowMultiSession}
                        onChange={(e) => onChange('allowMultiSession', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
            </label>

            <label className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div>
                    <span className="block text-sm font-bold text-gray-900">Force Logout on Password Change</span>
                    <span className="block text-xs text-gray-500 mt-0.5">Immediately terminate all active sessions when a user updates their credentials.</span>
                </div>
                <div className={`relative inline-flex items-center cursor-pointer`}>
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={values.forceLogoutOnPassChange}
                        onChange={(e) => onChange('forceLogoutOnPassChange', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
            </label>

            <label className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div>
                    <span className="block text-sm font-bold text-gray-900">Strict Role-Based Dashboards</span>
                    <span className="block text-xs text-gray-500 mt-0.5">Prevent users from navigating to dashboards not assigned to their primary role.</span>
                </div>
                <div className={`relative inline-flex items-center cursor-pointer`}>
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={values.strictRoleDashboards}
                        onChange={(e) => onChange('strictRoleDashboards', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
            </label>

        </div>
    );
};

export default UserAccessConfigPanel;
