
import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, Loader2 } from 'lucide-react';
import PolicyLockBanner from '../academics/components/policies/PolicyLockBanner';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

// Components
import SupportChannelPanel from './components/support-rules/SupportChannelPanel';
import TicketCategoryPanel from './components/support-rules/TicketCategoryPanel';
import SLARulesPanel from './components/support-rules/SLARulesPanel';
import EscalationMatrixPanel from './components/support-rules/EscalationMatrixPanel';

const SupportRules = () => {
    const { fetchBranches, branches, fetchSupportRule, saveSupportRule, toggleSupportLock } = useAdminStore();
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
        if (branches.length > 0 && branchId === 'main') {
            // setBranchId(branches[0]._id);
        }
    }, [branches, branchId]);

    useEffect(() => {
        const loadPolicy = async () => {
            if (!branchId) return;
            setLoading(true);
            const data = await fetchSupportRule(branchId);
            if (data) {
                setPolicy(data);
                setIsLocked(data.isLocked || false);
            }
            setLoading(false);
            setIsDirty(false);
        };
        loadPolicy();
    }, [branchId, fetchSupportRule]);

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
        const result = await saveSupportRule(dataToSave);
        if (result) {
            setPolicy(result);
            setIsLocked(result.isLocked);
            setIsDirty(false);
        }
        setIsSaving(false);
    };

    const handleLock = async () => {
        if (window.confirm("Activate and Lock Support Policy? This will enforce SLA timers and assignment workflows.")) {
            setIsSaving(true);
            const result = await saveSupportRule({ ...policy, branchId, isLocked: true });
            if (result) {
                setPolicy(result);
                setIsLocked(true);
                setIsDirty(false);
            }
            setIsSaving(false);
        }
    };

    const handleUnlock = async () => {
        const reason = prompt("Enter Audit Reason for Unlocking Support Policy:");
        if (reason) {
            setIsSaving(true);
            const result = await toggleSupportLock(policy._id, { isLocked: false, unlockReason: reason });
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
                <p className="text-gray-500 text-sm">Loading support policies...</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Support & Ticketing Rules</h1>
                    <p className="text-gray-500 text-sm">Configure helpdesk SLA, categories, and escalation workflows.</p>
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">

                    {/* 1. Left Column: Channels & Categories */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <SupportChannelPanel
                            isLocked={isLocked}
                            channels={policy.channels}
                            onChange={(val) => handlePolicyChange('channels', val)}
                        />
                        <TicketCategoryPanel
                            isLocked={isLocked}
                            categories={policy.categories}
                            onChange={(val) => handlePolicyChange('categories', val)}
                        />
                    </div>

                    {/* 2. Middle Column: SLA */}
                    <div className="lg:col-span-1">
                        <SLARulesPanel
                            isLocked={isLocked}
                            sla={policy.sla}
                            onChange={(val) => handlePolicyChange('sla', val)}
                        />
                    </div>

                    {/* 3. Right Column: Escalation & Stats */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <EscalationMatrixPanel
                            isLocked={isLocked}
                            escalation={policy.escalation}
                            onChange={(val) => handlePolicyChange('escalation', val)}
                        />

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
            ) : (
                <div className="p-12 text-center text-gray-400">
                    No policy metadata found for this branch.
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
                        {isSaving ? 'Saving...' : 'Save Policy'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SupportRules;
