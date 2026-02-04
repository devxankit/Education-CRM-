
import React, { useState } from 'react';
import { UserCheck, CornerUpRight, ClipboardCheck } from 'lucide-react';

const AssignmentRulesPanel = ({ isLocked, rules, setRules }) => {

    const handleChange = (field, value) => {
        if (isLocked) return;
        setRules({ ...rules, [field]: value });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <ClipboardCheck className="text-purple-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Allocation & Return Policy</h3>
                    <p className="text-xs text-gray-500">Rules for issuing and returning assets.</p>
                </div>
            </div>

            <div className="p-6 space-y-6">

                {/* 1. Assignable To */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-3">Assignable Entities</label>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: 'allowStaff', label: 'Individual Staff' },
                            { id: 'allowDepartment', label: 'Departments' },
                            { id: 'allowLocation', label: 'Locations / Rooms' }
                        ].map((item) => (
                            <label key={item.id} className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all ${rules[item.id] ? 'bg-purple-50 border-purple-200 ring-1 ring-purple-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                                <input
                                    type="checkbox"
                                    checked={rules[item.id]}
                                    onChange={(e) => handleChange(item.id, e.target.checked)}
                                    disabled={isLocked}
                                    className="w-4 h-4 text-purple-600 rounded"
                                />
                                <span className="text-sm font-medium text-gray-800">{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* 2. Process Controls */}
                <div className="space-y-4">

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
                                <UserCheck size={16} className="text-indigo-500" /> Manager Approval Required
                            </label>
                            <p className="text-xs text-gray-500 mt-1 pl-6">
                                Assignment must be approved by Dept Head or Admin.
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={rules.approvalRequired}
                                disabled={isLocked}
                                onChange={(e) => handleChange('approvalRequired', e.target.checked)}
                            />
                            <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} peer-checked:bg-purple-600`}></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
                                <CornerUpRight size={16} className="text-indigo-500" /> Mandatory Exit Return
                            </label>
                            <p className="text-xs text-gray-500 mt-1 pl-6">
                                Block employee exit clearance if assets are pending return.
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={rules.mandatoryReturn}
                                disabled={isLocked}
                                onChange={(e) => handleChange('mandatoryReturn', e.target.checked)}
                            />
                            <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} peer-checked:bg-purple-600`}></div>
                        </label>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AssignmentRulesPanel;
