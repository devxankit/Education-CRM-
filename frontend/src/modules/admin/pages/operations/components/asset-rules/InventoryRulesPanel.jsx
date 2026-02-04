
import React, { useState } from 'react';
import { Layers, AlertCircle } from 'lucide-react';

const InventoryRulesPanel = ({ isLocked, policy, setPolicy }) => {

    const handleChange = (field, value) => {
        if (isLocked) return;
        setPolicy({ ...policy, [field]: value });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <Layers className="text-amber-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Inventory Management</h3>
                    <p className="text-xs text-gray-500">Stock levels & alerting rules.</p>
                </div>
            </div>

            <div className="p-6 space-y-6">

                {/* Master Switch */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Real-time Stock Tracking</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={policy.trackingEnabled}
                            disabled={isLocked}
                            onChange={(e) => handleChange('trackingEnabled', e.target.checked)}
                        />
                        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} peer-checked:bg-amber-600`}></div>
                    </label>
                </div>

                <hr className="border-gray-100" />

                {/* Thresholds */}
                <div className={`space-y-4 transition-opacity ${!policy.trackingEnabled ? 'opacity-50 pointer-events-none' : ''}`}>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Global Low Stock Threshold</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                value={policy.lowStockThreshold}
                                onChange={(e) => handleChange('lowStockThreshold', Number(e.target.value))}
                                disabled={isLocked}
                                className="w-20 px-3 py-2 border border-gray-300 rounded text-sm font-bold text-amber-700"
                            />
                            <span className="text-xs text-gray-500">Units</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">Alerts admins when stock dips below this count.</p>
                    </div>

                    <div className="flex items-start gap-2 bg-amber-50 p-3 rounded border border-amber-100">
                        <AlertCircle size={14} className="text-amber-600 mt-0.5" />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-amber-800">Auto-Block Issue</span>
                                <input
                                    type="checkbox"
                                    checked={policy.autoBlockIssue}
                                    onChange={(e) => handleChange('autoBlockIssue', e.target.checked)}
                                    disabled={isLocked}
                                    className="w-4 h-4 text-amber-600 rounded cursor-pointer accent-amber-600"
                                />
                            </div>
                            <p className="text-[10px] text-amber-700 mt-1">
                                System prevents issuance if stock count reaches zero.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default InventoryRulesPanel;
