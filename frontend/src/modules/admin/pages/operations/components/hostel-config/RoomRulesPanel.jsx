
import React, { useState } from 'react';
import { Home, LayoutGrid } from 'lucide-react';

const RoomRulesPanel = ({ isLocked, data = {}, onChange }) => {

    const handleChange = (field, value) => {
        if (isLocked) return;
        onChange({ ...data, [field]: value });
    };

    const toggleType = (type) => {
        if (isLocked) return;
        onChange({
            ...data,
            roomTypes: { ...data.roomTypes, [type]: !data.roomTypes?.[type] }
        });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <Home className="text-teal-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Room & Occupancy Rules</h3>
                    <p className="text-xs text-gray-500">Define habitable unit structures.</p>
                </div>
            </div>

            <div className="p-6 space-y-6">

                {/* Room Types */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-3">Allowed Room Configurations</label>
                    <div className="space-y-2">
                        {['single', 'double', 'triple', 'dorm'].map((type) => (
                            <label key={type} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                    {type === 'dorm' ? 'Dormitory (4+ Beds)' : `${type} Occupancy`}
                                </span>
                                <input
                                    type="checkbox"
                                    checked={data.roomTypes?.[type] || false}
                                    onChange={() => toggleType(type)}
                                    disabled={isLocked}
                                    className="w-4 h-4 text-teal-600 rounded"
                                />
                            </label>
                        ))}
                    </div>
                </div>

                <hr className="border-gray-100" />

                <div className="flex items-center justify-between">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Max Beds Limit</label>
                        <p className="text-[10px] text-gray-400">System hard cap per room.</p>
                    </div>
                    <div className="w-24">
                        <input
                            type="number"
                            min="1" max="20"
                            value={data.maxBedsPerRoom || 0}
                            onChange={(e) => handleChange('maxBedsPerRoom', Number(e.target.value))}
                            disabled={isLocked}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-center font-bold text-teal-800"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RoomRulesPanel;
