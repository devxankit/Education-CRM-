
import React, { useState } from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import PolicyLockBanner from '../academics/components/policies/PolicyLockBanner';

// Components
import ChannelConfigPanel from './components/communication-rules/ChannelConfigPanel';
import RolePermissionPanel from './components/communication-rules/RolePermissionPanel';
import TemplateGovernancePanel from './components/communication-rules/TemplateGovernancePanel';
import ConsentRulesPanel from './components/communication-rules/ConsentRulesPanel';

const CommunicationRules = () => {

    // Global State
    const [isLocked, setIsLocked] = useState(false);

    const handleLock = () => {
        if (window.confirm("Activate and Lock Communication Policy? This will restrict message sending capabilities.")) {
            setIsLocked(true);
        }
    };

    const handleUnlock = () => {
        const reason = prompt("Enter Audit Reason for Unlocking Communication Policy:");
        if (reason) setIsLocked(false);
    };

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Communication Governance</h1>
                    <p className="text-gray-500 text-sm">Control message channels, permissions, and compliance policies.</p>
                </div>
            </div>

            {/* Lock Banner */}
            <div className="mb-6 rounded-lg overflow-hidden">
                <PolicyLockBanner isLocked={isLocked} onLock={handleLock} onUnlock={handleUnlock} />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">

                {/* 1. Channel Config */}
                <div className="lg:col-span-1">
                    <ChannelConfigPanel isLocked={isLocked} />
                </div>

                {/* 2. Role Permissions */}
                <div className="lg:col-span-2">
                    <RolePermissionPanel isLocked={isLocked} />
                </div>

                {/* 3. Template Governance */}
                <div className="lg:col-span-1">
                    <TemplateGovernancePanel isLocked={isLocked} />
                </div>

                {/* 4. Consent & Legal */}
                <div className="lg:col-span-1">
                    <ConsentRulesPanel isLocked={isLocked} />
                </div>

                {/* 5. Audit Stats (Placeholder) */}
                <div className="lg:col-span-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg mb-2">Audit Compliance</h3>
                        <p className="text-gray-400 text-xs">Message logs retention policy.</p>
                    </div>
                    <div className="mt-4">
                        <span className="block text-3xl font-bold text-green-400">6 Months</span>
                        <span className="text-[10px] text-gray-400 uppercase">Active Log Retention</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <button className="text-xs text-blue-300 hover:text-white underline">Download Audit Report</button>
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

export default CommunicationRules;
