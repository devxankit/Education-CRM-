
import React from 'react';
import { Shield, Clock, FileWarning, Unlock, AlertTriangle } from 'lucide-react';

const GovernancePolicyPanel = ({ policies, onUpdate }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-8">

            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
                    <Shield size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">Governance & Exceptions</h3>
                    <p className="text-sm text-gray-500">Define global handling for provisional admissions and overrides.</p>
                </div>
            </div>

            {/* Provisional Admission Policy */}
            <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    <Clock size={16} className="text-gray-500" />
                    Provisional Admission Policy
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div>
                        <label className="flex items-center justify-between cursor-pointer mb-2">
                            <span className="text-sm font-medium text-gray-700">Allow Provisional Admission?</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={policies.provisionalAllowed}
                                    onChange={(e) => onUpdate('provisionalAllowed', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                            </div>
                        </label>
                        <p className="text-xs text-gray-500">
                            If enabled, students can be admitted with "Pending" mandatory documents for a limited time.
                        </p>
                    </div>

                    <div className={!policies.provisionalAllowed ? 'opacity-50 pointer-events-none' : ''}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Provisional Validity</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={policies.provisionalDays}
                                onChange={(e) => onUpdate('provisionalDays', parseInt(e.target.value))}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm py-2 px-3"
                            />
                            <span className="text-sm text-gray-500 font-medium">days</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Override Authority */}
            <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    <Unlock size={16} className="text-gray-500" />
                    Override Authority
                </h4>

                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 border border-amber-200 bg-amber-50 rounded-lg">
                        <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                        <div className="text-xs text-amber-800">
                            <strong>Security Note:</strong> All overrides are logged in the Compliance Audit Trail.
                            Users with "Override Authority" can bypass "Hard Block" rules manually.
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {['Super Admin', 'Principal', 'Registrar', 'Compliance Officer'].map((role) => {
                            const checked = policies.overrideRoles?.includes(role);
                            const toggle = () => {
                                const next = checked
                                    ? (policies.overrideRoles || []).filter((r) => r !== role)
                                    : [...(policies.overrideRoles || []), role];
                                onUpdate('overrideRoles', next);
                            };
                            return (
                                <label key={role} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={toggle}
                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="text-sm text-gray-700">{role}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default GovernancePolicyPanel;
