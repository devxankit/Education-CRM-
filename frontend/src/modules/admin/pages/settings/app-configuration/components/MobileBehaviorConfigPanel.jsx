import React from 'react';
import { Smartphone, Zap, LayoutTemplate } from 'lucide-react';

const MobileBehaviorConfigPanel = ({ values, onChange }) => {
    return (
        <div className="space-y-4">

            <label className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex gap-3 items-center">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Smartphone size={20} />
                    </div>
                    <div>
                        <span className="block text-sm font-bold text-gray-900">Enable Mobile App Access</span>
                        <span className="block text-xs text-gray-500 mt-0.5">Allow users to login via official Android/iOS apps.</span>
                    </div>
                </div>
                <div className={`relative inline-flex items-center cursor-pointer`}>
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={values.enableMobileApp}
                        onChange={(e) => onChange('enableMobileApp', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
            </label>

            {values.enableMobileApp && (
                <div className="ml-4 pl-4 border-l-2 border-gray-100 space-y-4 animate-in fade-in slide-in-from-left-2">

                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="flex gap-3 items-center">
                            <Zap size={16} className="text-gray-500" />
                            <div>
                                <span className="block text-sm font-medium text-gray-900">Lite Mode for Reports</span>
                                <span className="block text-xs text-gray-400 mt-0.5">Disable heavy charts on mobile to save data.</span>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            checked={values.mobileLiteReports}
                            onChange={(e) => onChange('mobileLiteReports', e.target.checked)}
                        />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="flex gap-3 items-center">
                            <LayoutTemplate size={16} className="text-gray-500" />
                            <div>
                                <span className="block text-sm font-medium text-gray-900">Bottom Navigation Bar</span>
                                <span className="block text-xs text-gray-400 mt-0.5">Use bottom nav instead of hamburger menu.</span>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            checked={values.mobileBottomNav}
                            onChange={(e) => onChange('mobileBottomNav', e.target.checked)}
                        />
                    </label>

                </div>
            )}

        </div>
    );
};

export default MobileBehaviorConfigPanel;
