
import React, { useState } from 'react';
import { Users, Truck } from 'lucide-react';

const CapacityRulesPanel = ({ isLocked, data, onChange }) => {

    const rules = data || {
        maxCapacity: 40,
        bufferPercent: 10,
        allowOverbooking: false
    };

    const handleChange = (field, value) => {
        if (isLocked) return;
        onChange({ ...rules, [field]: value });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <Truck className="text-purple-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Fleet Capacity Logic</h3>
                    <p className="text-xs text-gray-500">Manage vehicle occupancy limits.</p>
                </div>
            </div>

            <div className="p-6 space-y-6">

                {/* Sliders / Inputs */}
                <div>
                    <div className="flex justify-between mb-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Standard Vehicle Capacity (Seats)</label>
                        <span className="text-xs font-bold text-gray-900">{rules.maxCapacity} Seats</span>
                    </div>
                    <input
                        type="range"
                        min="10" max="60" step="1"
                        value={rules.maxCapacity}
                        onChange={(e) => handleChange('maxCapacity', Number(e.target.value))}
                        disabled={isLocked}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                </div>

                <div>
                    <div className="flex justify-between mb-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Safety Buffer (%)</label>
                        <span className="text-xs font-bold text-gray-900">{rules.bufferPercent}%</span>
                    </div>
                    <input
                        type="range"
                        min="0" max="25" step="5"
                        value={rules.bufferPercent}
                        onChange={(e) => handleChange('bufferPercent', Number(e.target.value))}
                        disabled={isLocked}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Reserve {rules.bufferPercent}% of seats for emergencies or staff.</p>
                </div>

                <hr className="border-gray-100" />

                {/* Overbooking */}
                <div className={`flex items-start gap-3 p-3 rounded-lg border ${rules.allowOverbooking ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="mt-0.5">
                        <input
                            type="checkbox"
                            checked={rules.allowOverbooking}
                            onChange={(e) => handleChange('allowOverbooking', e.target.checked)}
                            disabled={isLocked}
                            className="w-4 h-4 text-orange-600 rounded cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-bold ${rules.allowOverbooking ? 'text-orange-900' : 'text-gray-700'}`}>
                            Allow Overbooking (Standing)
                        </label>
                        <p className={`text-xs mt-1 leading-relaxed ${rules.allowOverbooking ? 'text-orange-700' : 'text-gray-500'}`}>
                            If enabled, system allows assigning students beyond seated capacity up to 120%.
                            <br /><strong>Not recommended for safety reasons.</strong>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CapacityRulesPanel;
