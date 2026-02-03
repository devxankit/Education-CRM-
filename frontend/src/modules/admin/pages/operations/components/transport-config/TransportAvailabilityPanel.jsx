
import React, { useState } from 'react';
import { Bus, Power, MapPin } from 'lucide-react';

const TransportAvailabilityPanel = ({ isLocked, data, onChange }) => {

    const config = data || {
        isEnabled: true,
        isMandatory: false,
        scope: 'all'
    };

    const handleChange = (field, value) => {
        if (isLocked) return;
        onChange({ ...config, [field]: value });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Bus className="text-yellow-600" size={20} />
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Transport Availability</h3>
                        <p className="text-xs text-gray-500">Enable or disable transport services for this branch.</p>
                    </div>
                </div>

                {/* Visual Status Switch */}
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase ${config.isEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                        {config.isEnabled ? 'Service Active' : 'Disabled'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={config.isEnabled}
                            disabled={isLocked}
                            onChange={(e) => handleChange('isEnabled', e.target.checked)}
                        />
                        <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} peer-checked:bg-green-600`}></div>
                    </label>
                </div>
            </div>

            <div className={`p-6 space-y-6 ${!config.isEnabled ? 'opacity-50 pointer-events-none' : ''}`}>

                {/* Mandatory Rule */}
                <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                        <input
                            type="checkbox"
                            checked={config.isMandatory}
                            onChange={(e) => handleChange('isMandatory', e.target.checked)}
                            disabled={isLocked}
                            className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
                            Transport Mandatory
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-100 text-red-700 font-bold uppercase">Strict</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            If enabled, all students must opt for transport unless exempted by management.
                            Typically used for residential or remote campuses.
                        </p>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Scope */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-3">Service Scope</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            onClick={() => handleChange('scope', 'all')}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${config.scope === 'all' ? 'bg-yellow-50 border-yellow-200 ring-1 ring-yellow-400' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <MapPin size={16} className={config.scope === 'all' ? 'text-yellow-700' : 'text-gray-400'} />
                                <span className={`text-sm font-bold ${config.scope === 'all' ? 'text-yellow-900' : 'text-gray-600'}`}>Entire City</span>
                            </div>
                            <p className="text-[10px] text-gray-500">Service available for all reachable areas.</p>
                        </div>

                        <div
                            onClick={() => handleChange('scope', 'selected')}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${config.scope === 'selected' ? 'bg-yellow-50 border-yellow-200 ring-1 ring-yellow-400' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Bus size={16} className={config.scope === 'selected' ? 'text-yellow-700' : 'text-gray-400'} />
                                <span className={`text-sm font-bold ${config.scope === 'selected' ? 'text-yellow-900' : 'text-gray-600'}`}>Limited Routes</span>
                            </div>
                            <p className="text-[10px] text-gray-500">Service restricted to specific zones only.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TransportAvailabilityPanel;
