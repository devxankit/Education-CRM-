
import React, { useState } from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import PolicyLockBanner from '../academics/components/policies/PolicyLockBanner'; // Reuse existing banner

// Components
import TransportAvailabilityPanel from './components/transport-config/TransportAvailabilityPanel';
import RouteRulesPanel from './components/transport-config/RouteRulesPanel';
import CapacityRulesPanel from './components/transport-config/CapacityRulesPanel';
import TransportFeeLinkPanel from './components/transport-config/TransportFeeLinkPanel';

const TransportConfig = () => {

    // Global State
    const [isLocked, setIsLocked] = useState(false);
    const [branch, setBranch] = useState('Main Branch');

    const handleLock = () => {
        if (window.confirm("Activate and Lock Transport Configuration? Changes will impede new route creation.")) {
            setIsLocked(true);
        }
    };

    const handleUnlock = () => {
        const reason = prompt("Enter Audit Reason for Unlocking Transport Config:");
        if (reason) setIsLocked(false);
    };

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Transport Configuration</h1>
                    <p className="text-gray-500 text-sm">Define availability, limits, and fee rules for fleet management.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Branch:</span>
                        <select
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="font-bold text-gray-800 outline-none bg-transparent"
                        >
                            <option>Main Branch</option>
                            <option>City Campus</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Lock Banner */}
            <div className="mb-6 rounded-lg overflow-hidden">
                <PolicyLockBanner isLocked={isLocked} onLock={handleLock} onUnlock={handleUnlock} />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">

                {/* 1. Availability */}
                <div className="lg:col-span-1">
                    <TransportAvailabilityPanel isLocked={isLocked} />
                </div>

                {/* 2. Route Rules */}
                <div className="lg:col-span-1">
                    <RouteRulesPanel isLocked={isLocked} />
                </div>

                {/* 3. Fee Linking */}
                <div className="lg:col-span-1">
                    <TransportFeeLinkPanel isLocked={isLocked} />
                </div>

                {/* 4. Capacity (Full Width or positioned differently?) -> Let's put it in row 2 */}
                <div className="lg:col-span-1">
                    <CapacityRulesPanel isLocked={isLocked} />
                </div>

                {/* Placeholder for future expansion */}
                <div className="lg:col-span-2 bg-gray-50 border border-gray-200 border-dashed rounded-xl flex items-center justify-center text-gray-400 text-sm">
                    <p>Additional maintenance & driver policy settings...</p>
                </div>

            </div>

            {/* Footer Actions */}
            {!isLocked && (
                <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white border-t border-gray-200 p-4 flex justify-between items-center z-10">
                    <div className="flex items-center gap-2 text-amber-600 text-sm">
                        <AlertTriangle size={16} />
                        <span>Unsaved changes in draft.</span>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg font-medium">
                        <Save size={18} /> Save Configuration
                    </button>
                </div>
            )}

        </div>
    );
};

export default TransportConfig;
