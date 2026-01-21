
import React, { useState } from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import PolicyLockBanner from '../academics/components/policies/PolicyLockBanner';

// Components
import SupportChannelPanel from './components/support-rules/SupportChannelPanel';
import TicketCategoryPanel from './components/support-rules/TicketCategoryPanel';
import SLARulesPanel from './components/support-rules/SLARulesPanel';
import EscalationMatrixPanel from './components/support-rules/EscalationMatrixPanel';

const SupportRules = () => {

    // Global State
    const [isLocked, setIsLocked] = useState(false);

    const handleLock = () => {
        if (window.confirm("Activate and Lock Support Policy? This will enforce SLA timers and assignment workflows.")) {
            setIsLocked(true);
        }
    };

    const handleUnlock = () => {
        const reason = prompt("Enter Audit Reason for Unlocking Support Policy:");
        if (reason) setIsLocked(false);
    };

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Support & Ticketing Rules</h1>
                    <p className="text-gray-500 text-sm">Configure helpdesk SLA, categories, and escalation workflows.</p>
                </div>
            </div>

            {/* Lock Banner */}
            <div className="mb-6 rounded-lg overflow-hidden">
                <PolicyLockBanner isLocked={isLocked} onLock={handleLock} onUnlock={handleUnlock} />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">

                {/* 1. Left Column: Channels & Categories */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <SupportChannelPanel isLocked={isLocked} />
                    <TicketCategoryPanel isLocked={isLocked} />
                </div>

                {/* 2. Middle Column: SLA */}
                <div className="lg:col-span-1">
                    <SLARulesPanel isLocked={isLocked} />
                </div>

                {/* 3. Right Column: Escalation & Stats */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <EscalationMatrixPanel isLocked={isLocked} />

                    {/* Stats */}
                    <div className="bg-indigo-900 rounded-xl p-6 text-white flex-1">
                        <div>
                            <h3 className="font-bold text-lg mb-2">Service Health</h3>
                            <p className="text-indigo-300 text-xs">Simulated performance based on current SLA.</p>
                        </div>
                        <div className="mt-6 flex flex-col gap-4">
                            <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
                                <span className="text-xs text-indigo-200">Proj. Avg Response</span>
                                <span className="text-sm font-bold font-mono">2h 14m</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
                                <span className="text-xs text-indigo-200">Proj. Satisfaction</span>
                                <span className="text-sm font-bold font-mono text-green-300">4.8 / 5.0</span>
                            </div>
                        </div>
                    </div>

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
                        <Save size={18} /> Save Policy
                    </button>
                </div>
            )}

        </div>
    );
};

export default SupportRules;
