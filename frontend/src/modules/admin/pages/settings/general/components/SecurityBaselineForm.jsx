import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const SecurityBaselineForm = ({ values, onChange }) => {
    return (
        <div className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg flex gap-3 border border-orange-100 mb-4">
                <ShieldAlert className="text-orange-600 shrink-0" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-orange-900">Baseline Security</h4>
                    <p className="text-xs text-orange-800 mt-1">These are global defaults. Granular controls (2FA, IP Whitelisting) are available in the dedicated Security module.</p>
                </div>
            </div>

            <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <div>
                        <span className="block text-sm font-bold text-gray-900">Force Profile Completion on Login</span>
                        <span className="block text-xs text-gray-500 mt-0.5">Users must complete mandatory fields before accessing dashboard.</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${values.forceProfileCompletion ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={values.forceProfileCompletion}
                            onChange={(e) => onChange('forceProfileCompletion', e.target.checked)}
                        />
                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${values.forceProfileCompletion ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                </label>

                <label className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <div>
                        <span className="block text-sm font-bold text-gray-900">Force Password Change</span>
                        <span className="block text-xs text-gray-500 mt-0.5">Require users to change temporary passwords on first login.</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${values.forcePasswordChange ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={values.forcePasswordChange}
                            onChange={(e) => onChange('forcePasswordChange', e.target.checked)}
                        />
                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${values.forcePasswordChange ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Password Length</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                            value={values.minPasswordLength}
                            onChange={(e) => onChange('minPasswordLength', parseInt(e.target.value))}
                        >
                            <option value="6">6 Characters (Weak)</option>
                            <option value="8">8 Characters (Recommended)</option>
                            <option value="12">12 Characters (Strong)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Complexity Requirement</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                            value={values.passwordComplexity}
                            onChange={(e) => onChange('passwordComplexity', e.target.value)}
                        >
                            <option value="none">None</option>
                            <option value="alphanumeric">Alphanumeric</option>
                            <option value="strong">Strong (Symbol + Case)</option>
                        </select>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SecurityBaselineForm;
