
import React, { useState } from 'react';
import { Bed, Users, Building, ShieldCheck } from 'lucide-react';

const HostelAvailabilityPanel = ({ isLocked }) => {

    const [config, setConfig] = useState({
        isEnabled: true,
        separateBlocks: {
            boys: true,
            girls: true,
            staff: false
        },
        maxHostels: 2
    });

    const handleChange = (field, value) => {
        if (isLocked) return;
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleBlockToggle = (key) => {
        if (isLocked) return;
        setConfig(prev => ({
            ...prev,
            separateBlocks: { ...prev.separateBlocks, [key]: !prev.separateBlocks[key] }
        }));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Bed className="text-orange-600" size={20} />
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Hostel Availability</h3>
                        <p className="text-xs text-gray-500">Enable accommodation facilities.</p>
                    </div>
                </div>

                {/* Visual Switch */}
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase ${config.isEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                        {config.isEnabled ? 'Active' : 'Disabled'}
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

                {/* Structure Types */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-3">Facility Types</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                        {/* Boys */}
                        <div
                            onClick={() => handleBlockToggle('boys')}
                            className={`p-3 rounded-lg border cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${config.separateBlocks.boys ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                        >
                            <Users size={20} className={config.separateBlocks.boys ? 'text-blue-600' : 'text-gray-400'} />
                            <span className={`text-xs font-bold ${config.separateBlocks.boys ? 'text-blue-900' : 'text-gray-500'}`}>Boys Hostel</span>
                        </div>

                        {/* Girls */}
                        <div
                            onClick={() => handleBlockToggle('girls')}
                            className={`p-3 rounded-lg border cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${config.separateBlocks.girls ? 'bg-pink-50 border-pink-200 ring-1 ring-pink-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                        >
                            <Users size={20} className={config.separateBlocks.girls ? 'text-pink-600' : 'text-gray-400'} />
                            <span className={`text-xs font-bold ${config.separateBlocks.girls ? 'text-pink-900' : 'text-gray-500'}`}>Girls Hostel</span>
                        </div>

                        {/* Staff */}
                        <div
                            onClick={() => handleBlockToggle('staff')}
                            className={`p-3 rounded-lg border cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${config.separateBlocks.staff ? 'bg-purple-50 border-purple-200 ring-1 ring-purple-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                        >
                            <Building size={20} className={config.separateBlocks.staff ? 'text-purple-600' : 'text-gray-400'} />
                            <span className={`text-xs font-bold ${config.separateBlocks.staff ? 'text-purple-900' : 'text-gray-500'}`}>Staff Quarters</span>
                        </div>

                    </div>
                </div>

                <hr className="border-gray-100" />

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Max Buildings</label>
                        <input
                            type="number"
                            value={config.maxHostels}
                            onChange={(e) => handleChange('maxHostels', Number(e.target.value))}
                            disabled={isLocked}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex items-center text-xs text-orange-600 bg-orange-50 p-3 rounded border border-orange-100">
                        <ShieldCheck className="shrink-0 mr-2" size={16} />
                        Configures total independent buildings allowed in this branch.
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HostelAvailabilityPanel;
