
import React, { useState } from 'react';
import { DollarSign, Link, Receipt } from 'lucide-react';

const HostelFeeLinkPanel = ({ isLocked }) => {

    const [config, setConfig] = useState({
        isLinked: true,
        feeBasis: 'room_type', // room_type | flat
        collectionFrequency: 'term' // monthly | term | annual
    });

    const handleChange = (field, value) => {
        if (isLocked) return;
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <DollarSign className="text-green-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Hostel Fees & Billing</h3>
                    <p className="text-xs text-gray-500">Automate residential charges.</p>
                </div>
            </div>

            <div className="p-6 space-y-6">

                {/* Enable Switch */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Auto-Apply Hostel Fees</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={config.isLinked}
                            disabled={isLocked}
                            onChange={(e) => handleChange('isLinked', e.target.checked)}
                        />
                        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} peer-checked:bg-green-600`}></div>
                    </label>
                </div>

                {/* Options */}
                <div className={`space-y-4 transition-opacity ${!config.isLinked ? 'opacity-40 pointer-events-none' : ''}`}>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Fee Calculation Basis</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div
                                onClick={() => handleChange('feeBasis', 'room_type')}
                                className={`p-3 border rounded-lg cursor-pointer flex items-center gap-2 ${config.feeBasis === 'room_type' ? 'bg-green-50 border-green-200 ring-1 ring-green-300' : 'hover:bg-gray-50'}`}
                            >
                                <Receipt size={16} className="text-green-600" />
                                <span className="text-xs font-bold text-gray-700">Room Type</span>
                            </div>
                            <div
                                onClick={() => handleChange('feeBasis', 'flat')}
                                className={`p-3 border rounded-lg cursor-pointer flex items-center gap-2 ${config.feeBasis === 'flat' ? 'bg-green-50 border-green-200 ring-1 ring-green-300' : 'hover:bg-gray-50'}`}
                            >
                                <Receipt size={16} className="text-green-600" />
                                <span className="text-xs font-bold text-gray-700">Flat Rate</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Collection Frequency</label>
                        <select
                            value={config.collectionFrequency}
                            onChange={(e) => handleChange('collectionFrequency', e.target.value)}
                            disabled={isLocked}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white outline-none"
                        >
                            <option value="annual">Annual (Per Session)</option>
                            <option value="term">Per Term / Semester</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>

                    <div className="bg-gray-50 p-3 rounded text-[10px] text-gray-500 italic border border-gray-200">
                        Fees will be added to the student's "Pending Dues" immediately upon room allocation.
                    </div>

                </div>

            </div>
        </div>
    );
};

export default HostelFeeLinkPanel;
