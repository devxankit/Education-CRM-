
import React, { useState } from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import PolicyLockBanner from '../academics/components/policies/PolicyLockBanner';

// Components
import HostelAvailabilityPanel from './components/hostel-config/HostelAvailabilityPanel';
import RoomRulesPanel from './components/hostel-config/RoomRulesPanel';
import HostelFeeLinkPanel from './components/hostel-config/HostelFeeLinkPanel';
import SafetyRulesPanel from './components/hostel-config/SafetyRulesPanel';

const HostelConfig = () => {

    // Global State
    const [isLocked, setIsLocked] = useState(false);
    const [branch, setBranch] = useState('Main Campus');

    const handleLock = () => {
        if (window.confirm("Activate and Lock Hostel Configuration? Make sure infrastructure details are accurate.")) {
            setIsLocked(true);
        }
    };

    const handleUnlock = () => {
        const reason = prompt("Enter Audit Reason for Unlocking Hostel Config:");
        if (reason) setIsLocked(false);
    };

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Hostel Configuration</h1>
                    <p className="text-gray-500 text-sm">Manage residential policies, room structures, and safety protocols.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Branch:</span>
                        <select
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="font-bold text-gray-800 outline-none bg-transparent"
                        >
                            <option>Main Campus</option>
                            <option>North Wing</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Lock Banner */}
            <div className="mb-6 rounded-lg overflow-hidden">
                <PolicyLockBanner isLocked={isLocked} onLock={handleLock} onUnlock={handleUnlock} />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">

                {/* 1. Availability */}
                <div className="lg:col-span-1">
                    <HostelAvailabilityPanel isLocked={isLocked} />
                </div>

                {/* 2. Room Rules */}
                <div className="lg:col-span-1">
                    <RoomRulesPanel isLocked={isLocked} />
                </div>

                {/* 3. Safety Rules */}
                <div className="lg:col-span-1">
                    <SafetyRulesPanel isLocked={isLocked} />
                </div>

                {/* 4. Fee Linking */}
                <div className="lg:col-span-1">
                    <HostelFeeLinkPanel isLocked={isLocked} />
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

export default HostelConfig;
