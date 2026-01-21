
import React, { useState } from 'react';
import { ClipboardList, History, AlertCircle } from 'lucide-react';

const AuditRulesPanel = ({ isLocked }) => {

    const [policy, setPolicy] = useState({
        periodicAudit: true,
        frequency: 'quarterly', // monthly | quarterly | yearly
        physicalVerification: true,
        retentionYears: 5
    });

    const handleChange = (field, value) => {
        if (isLocked) return;
        setPolicy(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <ClipboardList className="text-teal-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Audit & Compliance</h3>
                    <p className="text-xs text-gray-500">Inventory verification schedule.</p>
                </div>
            </div>

            <div className="p-6 space-y-6">

                {/* Audit Frequency */}
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-teal-900">Periodic Asset Audit</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={policy.periodicAudit}
                                disabled={isLocked}
                                onChange={(e) => handleChange('periodicAudit', e.target.checked)}
                            />
                            <div className={`w-9 h-5 bg-teal-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} peer-checked:bg-teal-600`}></div>
                        </label>
                    </div>

                    <div className={`space-y-3 transition-all ${!policy.periodicAudit ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div>
                            <label className="block text-xs font-semibold text-teal-800 uppercase mb-1">Frequency</label>
                            <select
                                value={policy.frequency}
                                onChange={(e) => handleChange('frequency', e.target.value)}
                                disabled={isLocked}
                                className="w-full bg-white border border-teal-200 text-teal-900 text-sm rounded px-2 py-1.5 outline-none"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>

                        <div className="flex items-start gap-2 pt-2">
                            <input
                                type="checkbox"
                                checked={policy.physicalVerification}
                                onChange={(e) => handleChange('physicalVerification', e.target.checked)}
                                disabled={isLocked}
                                className="mt-0.5 w-4 h-4 text-teal-600 rounded cursor-pointer"
                            />
                            <p className="text-xs text-teal-800 leading-tight">
                                Require physical QuickScan® verification of all trackable assets during audit.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Retention */}
                <div>
                    <div className="flex items-center gap-2 text-gray-800 font-semibold text-xs border-b border-gray-200 pb-2 mb-3">
                        <History size={14} /> Historical Data Retention
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Retain Disposal Records For</span>
                        <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                            <input
                                type="number"
                                min="1" max="15"
                                value={policy.retentionYears}
                                onChange={(e) => handleChange('retentionYears', Number(e.target.value))}
                                disabled={isLocked}
                                className="w-10 text-center font-bold text-sm bg-transparent outline-none"
                            />
                            <span className="text-xs text-gray-400">Years</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuditRulesPanel;
