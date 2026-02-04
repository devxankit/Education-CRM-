import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, Loader2 } from 'lucide-react';
import PolicyLockBanner from '../academics/components/policies/PolicyLockBanner';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

// Components
import HostelAvailabilityPanel from './components/hostel-config/HostelAvailabilityPanel';
import RoomRulesPanel from './components/hostel-config/RoomRulesPanel';
import HostelFeeLinkPanel from './components/hostel-config/HostelFeeLinkPanel';
import SafetyRulesPanel from './components/hostel-config/SafetyRulesPanel';

const HostelConfig = () => {
    const { fetchBranches, branches, fetchHostelConfig, saveHostelConfig, toggleHostelLock } = useAdminStore();
    const user = useAppStore(state => state.user);
    const [branchId, setBranchId] = useState(user?.branchId || 'main');

    // Global State
    const [policy, setPolicy] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        const loadPolicy = async () => {
            if (!branchId) return;
            setLoading(true);
            const data = await fetchHostelConfig(branchId);
            if (data) {
                setPolicy(data);
                setIsLocked(data.isLocked || false);
            }
            setLoading(false);
            setIsDirty(false);
        };
        loadPolicy();
    }, [branchId, fetchHostelConfig]);

    const handlePolicyChange = (field, value) => {
        if (isLocked) return;
        setPolicy(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleSave = async (unlockReason = null) => {
        setIsSaving(true);
        const dataToSave = {
            ...policy,
            branchId,
            unlockReason
        };
        const result = await saveHostelConfig(dataToSave);
        if (result) {
            setPolicy(result);
            setIsLocked(result.isLocked);
            setIsDirty(false);
        }
        setIsSaving(false);
    };

    const handleLock = async () => {
        if (window.confirm("Activate and Lock Hostel Configuration? This will be used as the source of truth for hostel admissions.")) {
            setIsSaving(true);
            const result = await saveHostelConfig({ ...policy, branchId, isLocked: true });
            if (result) {
                setPolicy(result);
                setIsLocked(true);
                setIsDirty(false);
            }
            setIsSaving(false);
        }
    };

    const handleUnlock = async () => {
        const reason = prompt("Enter Audit Reason for Unlocking Hostel Configuration:");
        if (reason) {
            setIsSaving(true);
            const result = await toggleHostelLock(policy._id, { isLocked: false, unlockReason: reason });
            if (result) {
                setPolicy(result);
                setIsLocked(false);
                setIsDirty(false);
            }
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500 mb-2" size={32} />
                <p className="text-gray-500 text-sm">Loading hostel configuration...</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Hostel & Housing Setup</h1>
                    <p className="text-gray-500 text-sm">Configure residential blocks, room rules, and medical safety policies.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm shadow-sm">
                        <span className="text-gray-500">Branch:</span>
                        <select
                            value={branchId}
                            onChange={(e) => setBranchId(e.target.value)}
                            className="font-bold text-gray-800 outline-none bg-transparent cursor-pointer"
                        >
                            <option value="main">System Default (All)</option>
                            {branches.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Lock Banner */}
            <div className="mb-6 rounded-lg overflow-hidden shadow-sm">
                <PolicyLockBanner isLocked={isLocked} onLock={handleLock} onUnlock={handleUnlock} />
            </div>

            {policy ? (
                /* Content Grid */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                    <HostelAvailabilityPanel
                        isLocked={isLocked}
                        data={policy.availability}
                        onChange={(val) => handlePolicyChange('availability', val)}
                    />
                    <RoomRulesPanel
                        isLocked={isLocked}
                        data={policy.roomRules}
                        onChange={(val) => handlePolicyChange('roomRules', val)}
                    />
                    <HostelFeeLinkPanel
                        isLocked={isLocked}
                        data={policy.feeLink}
                        onChange={(val) => handlePolicyChange('feeLink', val)}
                    />
                    <SafetyRulesPanel
                        isLocked={isLocked}
                        data={policy.safetyRules}
                        onChange={(val) => handlePolicyChange('safetyRules', val)}
                    />
                </div>
            ) : (
                <div className="p-12 text-center text-gray-400">
                    No configuration found for this branch.
                </div>
            )}

            {/* Footer Actions */}
            {!isLocked && isDirty && (
                <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white border-t border-gray-200 p-4 flex justify-between items-center z-10 shadow-lg animate-slide-up">
                    <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                        <AlertTriangle size={16} />
                        <span>Unsaved policy changes.</span>
                    </div>
                    <button
                        onClick={() => handleSave()}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg font-bold transition-all disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {isSaving ? 'Saving...' : 'Save Config'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default HostelConfig;
