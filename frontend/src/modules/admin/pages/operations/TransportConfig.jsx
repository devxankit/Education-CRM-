
import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, Loader2 } from 'lucide-react';
import PolicyLockBanner from '../academics/components/policies/PolicyLockBanner';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

// Components
import TransportAvailabilityPanel from './components/transport-config/TransportAvailabilityPanel';
import RouteRulesPanel from './components/transport-config/RouteRulesPanel';
import CapacityRulesPanel from './components/transport-config/CapacityRulesPanel';
import TransportFeeLinkPanel from './components/transport-config/TransportFeeLinkPanel';

const TransportConfig = () => {
    const { branches, fetchBranches, fetchTransportConfig, saveTransportConfig, toggleTransportLock } = useAdminStore();
    const user = useAppStore(state => state.user);

    // Global State
    const [branchId, setBranchId] = useState(user?.branchId || 'main');
    const [config, setConfig] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        if (branches.length > 0 && branchId === 'main') {
            // keep it main for now if that's what we want, or set to first branch
        }
    }, [branches, branchId]);

    useEffect(() => {
        const loadConfig = async () => {
            if (!branchId) return;
            setLoading(true);
            const data = await fetchTransportConfig(branchId);
            if (data) {
                setConfig(data);
                setIsLocked(data.isLocked || false);
            }
            setLoading(false);
            setIsDirty(false);
        };
        loadConfig();
    }, [branchId, fetchTransportConfig]);

    const handleConfigChange = (field, value) => {
        if (isLocked) return;
        setConfig(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleSave = async (unlockReason = null) => {
        setIsSaving(true);
        const dataToSave = {
            ...config,
            branchId,
            unlockReason
        };
        const result = await saveTransportConfig(dataToSave);
        if (result) {
            setConfig(result);
            setIsLocked(result.isLocked);
            setIsDirty(false);
        }
        setIsSaving(false);
    };

    const handleLock = async () => {
        if (window.confirm("Activate and Lock Transport Configuration? Changes will impede new route creation.")) {
            setIsSaving(true);
            const result = await saveTransportConfig({ ...config, branchId, isLocked: true });
            if (result) {
                setConfig(result);
                setIsLocked(true);
                setIsDirty(false);
            }
            setIsSaving(false);
        }
    };

    const handleUnlock = async () => {
        const reason = prompt("Enter Audit Reason for Unlocking Transport Config:");
        if (reason) {
            setIsSaving(true);
            const result = await toggleTransportLock(config._id, { isLocked: false, unlockReason: reason });
            if (result) {
                setConfig(result);
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
                <p className="text-gray-500 text-sm">Loading transport configuration...</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Transport Configuration</h1>
                    <p className="text-gray-500 text-sm">Define availability, limits, and fee rules for fleet management.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500">
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

            {config ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
                    <div className="lg:col-span-1">
                        <TransportAvailabilityPanel
                            isLocked={isLocked}
                            data={config.availability}
                            onChange={(val) => handleConfigChange('availability', val)}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <RouteRulesPanel
                            isLocked={isLocked}
                            data={config.routeRules}
                            onChange={(val) => handleConfigChange('routeRules', val)}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <TransportFeeLinkPanel
                            isLocked={isLocked}
                            data={config.feeLink}
                            onChange={(val) => handleConfigChange('feeLink', val)}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <CapacityRulesPanel
                            isLocked={isLocked}
                            data={config.capacityRules}
                            onChange={(val) => handleConfigChange('capacityRules', val)}
                        />
                    </div>

                    <div className="lg:col-span-2 bg-gray-50 border border-gray-200 border-dashed rounded-xl flex items-center justify-center text-gray-400 text-sm">
                        <p>Additional maintenance & driver policy settings coming soon...</p>
                    </div>
                </div>
            ) : (
                <div className="p-12 text-center text-gray-400">
                    No configuration found for this branch.
                </div>
            )}

            {/* Footer Actions */}
            {!isLocked && isDirty && (
                <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white border-t border-gray-200 p-4 flex justify-between items-center z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-all animate-slide-up">
                    <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                        <AlertTriangle size={16} />
                        <span>Unsaved changes in draft.</span>
                    </div>
                    <button
                        onClick={() => handleSave()}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md font-bold transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {isSaving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransportConfig;
