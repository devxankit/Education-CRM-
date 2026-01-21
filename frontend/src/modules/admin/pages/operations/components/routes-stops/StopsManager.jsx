
import React, { useState } from 'react';
import { MapPin, GripVertical, Trash2, Plus, Clock } from 'lucide-react';

const StopsManager = ({ stops, onChange }) => {

    // stops is an array of objects
    // onChange(updatedStops)

    const handleAdd = () => {
        const newStop = {
            id: Date.now(),
            name: '',
            pickupTime: '',
            dropTime: '',
            students: 0
        };
        onChange([...stops, newStop]);
    };

    const handleRemove = (id) => {
        // Prevent if students assigned (mock logic handled by parent usually, but here UI only)
        onChange(stops.filter(s => s.id !== id));
    };

    const handleChange = (id, field, value) => {
        onChange(stops.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                    <MapPin size={14} /> Route Stops ({stops.length})
                </h4>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center gap-1"
                >
                    <Plus size={14} /> Add Stop
                </button>
            </div>

            <div className="space-y-2">
                {stops.map((stop, index) => (
                    <div key={stop.id} className="bg-white border border-gray-200 rounded-lg p-3 flex gap-3 items-start group shadow-sm">

                        <div className="mt-2 text-gray-400 cursor-move">
                            <GripVertical size={16} />
                        </div>

                        <div className="flex-1 grid grid-cols-12 gap-2">
                            {/* Seq */}
                            <div className="col-span-1 flex items-center justify-center">
                                <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold">
                                    {index + 1}
                                </span>
                            </div>

                            {/* Name */}
                            <div className="col-span-5">
                                <label className="block text-[10px] text-gray-400 font-bold mb-0.5">Stop Name</label>
                                <input
                                    type="text"
                                    value={stop.name}
                                    onChange={(e) => handleChange(stop.id, 'name', e.target.value)}
                                    placeholder="Enter Stop Name"
                                    className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:border-indigo-500 outline-none"
                                />
                            </div>

                            {/* Pickup Time */}
                            <div className="col-span-3">
                                <label className="block text-[10px] text-gray-400 font-bold mb-0.5">Pickup</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        value={stop.pickupTime}
                                        onChange={(e) => handleChange(stop.id, 'pickupTime', e.target.value)}
                                        className="w-full text-xs border border-gray-300 rounded pl-6 pr-1 py-1.5 focus:border-indigo-500 outline-none"
                                    />
                                    <Clock size={10} className="absolute left-1.5 top-2 text-gray-400" />
                                </div>
                            </div>

                            {/* Drop Time */}
                            <div className="col-span-3">
                                <label className="block text-[10px] text-gray-400 font-bold mb-0.5">Drop</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        value={stop.dropTime}
                                        onChange={(e) => handleChange(stop.id, 'dropTime', e.target.value)}
                                        className="w-full text-xs border border-gray-300 rounded pl-6 pr-1 py-1.5 focus:border-indigo-500 outline-none"
                                    />
                                    <Clock size={10} className="absolute left-1.5 top-2 text-gray-400" />
                                </div>
                            </div>

                        </div>

                        {/* Actions */}
                        <div className="mt-1">
                            <button
                                onClick={() => handleRemove(stop.id)}
                                disabled={stop.students > 0}
                                title={stop.students > 0 ? "Cannot remove stop with assigned students" : "Remove Stop"}
                                className={`p-1.5 rounded transition-colors ${stop.students > 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-300 hover:text-red-500 hover:bg-gray-100'}`}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                    </div>
                ))}

                {stops.length === 0 && (
                    <div className="text-center py-6 text-gray-400 text-xs italic border border-dashed border-gray-300 rounded-lg">
                        No stops added yet. Click "Add Stop" to build the route.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StopsManager;
