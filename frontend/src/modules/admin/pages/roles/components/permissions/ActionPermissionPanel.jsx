
import React from 'react';
import { AlertCircle, Lock } from 'lucide-react';

const ActionPermissionPanel = ({ permissions, onChange }) => {

    const actions = [
        { key: 'fees_collect', label: 'Collect Fees Cash/Online', risk: 'medium' },
        { key: 'fees_discount', label: 'Apply Fee Waiver / Discount', risk: 'high' },
        { key: 'doc_approve', label: 'Approve Admission Documents', risk: 'medium' },
        { key: 'doc_verify', label: 'Verify Documents (Physical)', risk: 'low' },
        { key: 'payroll_process', label: 'Process Monthly Payroll', risk: 'critical' },
        { key: 'bulk_import', label: 'Bulk Import Data', risk: 'high' }
    ];

    const handleToggle = (key, field) => {
        onChange(key, field);
    };

    return (
        <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-amber-600 mt-0.5 shrink-0" size={20} />
                <div className="text-sm text-amber-900">
                    <p className="font-semibold">Workflow Sensitivity</p>
                    <p>These actions trigger significant system changes. You can enable them and optionally mandate <strong>"Approval Required"</strong> logic.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actions.map(action => {
                    const isEnabled = permissions[action.key]?.enabled === true;
                    const isApprovalRequired = permissions[action.key]?.approvalRequired === true;

                    return (
                        <div key={action.key} className={`bg-white border rounded-lg p-5 transition-shadow hover:shadow-sm ${isEnabled ? 'border-gray-300' : 'border-gray-200 bg-gray-50/50'}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className={`font-semibold text-sm ${isEnabled ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {action.label}
                                    </h4>
                                    <span className={`
                                        text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded mt-2 inline-block
                                        ${action.risk === 'critical' ? 'bg-red-100 text-red-700' :
                                            action.risk === 'high' ? 'bg-orange-100 text-orange-700' :
                                                'bg-blue-100 text-blue-700'}
                                    `}>
                                        {action.risk} Risk
                                    </span>
                                </div>

                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={isEnabled}
                                        onChange={() => handleToggle(action.key, 'enabled')}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            {/* Secondary Option: Require Approval */}
                            <div className={`mt-4 pt-3 border-t border-gray-100 flex items-center justify-between transition-opacity ${isEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                                <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                    <Lock size={12} /> Require Approval?
                                </span>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                        checked={isApprovalRequired}
                                        onChange={() => handleToggle(action.key, 'approvalRequired')}
                                    />
                                    <span className="text-xs text-gray-700">Yes</span>
                                </label>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ActionPermissionPanel;
