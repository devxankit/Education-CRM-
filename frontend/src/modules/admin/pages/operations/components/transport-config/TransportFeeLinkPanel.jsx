
import React, { useState } from 'react';
import { DollarSign, Link } from 'lucide-react';

const TransportFeeLinkPanel = ({ isLocked }) => {

    const [config, setConfig] = useState({
        isLinked: true,
        feeType: 'route', // flat | route | distance
        paymentCycle: 'monthly'
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
                    <h3 className="text-sm font-bold text-gray-900">Fee & Account Linkage</h3>
                    <p className="text-xs text-gray-500">Automate transport billing.</p>
                </div>
            </div>

            <div className="p-6 space-y-6">

                {/* Master Switch */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Auto-Apply Transport Fees</span>
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

                {/* Configuration Options - Only visible if Enabled */}
                <div className={`space-y-4 transition-opacity ${!config.isLinked ? 'opacity-40 pointer-events-none' : ''}`}>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Calculation Method</label>
                        <select
                            value={config.feeType}
                            onChange={(e) => handleChange('feeType', e.target.value)}
                            disabled={isLocked}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white outline-none"
                        >
                            <option value="flat">Flat Rate (One Price for All)</option>
                            <option value="route">Route/Stop Based (Varies by Route)</option>
                            <option value="distance">Distance Based (Per Km Slab)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Billing Cycle</label>
                        <select
                            value={config.paymentCycle}
                            onChange={(e) => handleChange('paymentCycle', e.target.value)}
                            disabled={isLocked}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white outline-none"
                        >
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="annual">Annual (One-time)</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded border border-green-100 text-xs text-green-800">
                        <Link size={14} />
                        Linked to 'Transport Fee' component in Fee Structures.
                    </div>

                </div>

            </div>
        </div>
    );
};

export default TransportFeeLinkPanel;
