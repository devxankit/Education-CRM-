
import React, { useState } from 'react';
import { TrendingUp, User, ArrowUpRight } from 'lucide-react';

const EscalationMatrixPanel = ({ isLocked, escalation = {}, onChange }) => {

    const handleChange = (field, value) => {
        if (isLocked) return;
        onChange({ ...escalation, [field]: value });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <TrendingUp className="text-red-500" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Escalation Matrix</h3>
                    <p className="text-xs text-gray-500">Chain of command for unresolved issues.</p>
                </div>
            </div>

            <div className="p-6 space-y-6">

                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Enable Escalation Workflow</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={escalation.escalationEnabled}
                            disabled={isLocked}
                            onChange={(e) => handleChange('escalationEnabled', e.target.checked)}
                        />
                        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} peer-checked:bg-red-500`}></div>
                    </label>
                </div>

                <div className={`space-y-4 transition-opacity ${!escalation.escalationEnabled ? 'opacity-50 pointer-events-none' : ''}`}>

                    {/* Level 1 */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">L1</div>
                        <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-700">Support Agent</p>
                                <p className="text-[10px] text-gray-400">Initial Point of Contact</p>
                            </div>
                            <ArrowUpRight size={14} className="text-gray-400" />
                        </div>
                    </div>

                    {/* Level 2 */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-700">L2</div>
                        <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-700">Team Lead / Manager</p>
                                <p className="text-[10px] text-gray-400">Escalates after 50% Breach</p>
                            </div>
                            <ArrowUpRight size={14} className="text-gray-400" />
                        </div>
                    </div>

                    {/* Level 3 */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold text-red-700">L3</div>
                        <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-700">Admin / Operations Head</p>
                                <p className="text-[10px] text-gray-400">Escalates on Full Breach</p>
                            </div>
                            <User size={14} className="text-gray-400" />
                        </div>
                    </div>

                    {/* Auto Breach Toggle */}
                    <div className="pt-2 flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={escalation.autoBreachEscalation}
                            onChange={(e) => handleChange('autoBreachEscalation', e.target.checked)}
                            disabled={isLocked}
                            className="w-4 h-4 text-red-500 rounded cursor-pointer"
                        />
                        <span className="text-xs font-medium text-gray-600">Auto-escalate on SLA breach</span>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default EscalationMatrixPanel;
