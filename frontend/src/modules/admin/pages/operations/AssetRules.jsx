
import React, { useState, useEffect, useCallback } from 'react';
import { Save, AlertTriangle, Loader2 } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';
import PolicyLockBanner from '../academics/components/policies/PolicyLockBanner';

// Components
import AssetCategoryPanel from './components/asset-rules/AssetCategoryPanel';
import InventoryRulesPanel from './components/asset-rules/InventoryRulesPanel';
import AssignmentRulesPanel from './components/asset-rules/AssignmentRulesPanel';
import AuditRulesPanel from './components/asset-rules/AuditRulesPanel';

const AssetRules = () => {
    const { fetchAssetRule, saveAssetRule, toggleAssetLock, fetchAssetCategories } = useAdminStore();
    const user = useAppStore(state => state.user);
    const branchId = user?.branchId || 'main';

    // Global State
    const [loading, setLoading] = useState(true);
    const [policyId, setPolicyId] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const [inventoryRules, setInventoryRules] = useState({
        trackingEnabled: true,
        lowStockThreshold: 10,
        autoBlockIssue: true
    });

    const [assignmentRules, setAssignmentRules] = useState({
        allowStaff: true,
        allowDepartment: true,
        allowLocation: true,
        approvalRequired: true,
        mandatoryReturn: true,
    });

    const [auditRules, setAuditRules] = useState({
        periodicAudit: true,
        frequency: 'quarterly',
        physicalVerification: true,
        retentionYears: 5
    });

    // Load Data
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const rule = await fetchAssetRule(branchId);
            if (rule) {
                setPolicyId(rule._id);
                setIsLocked(rule.isLocked || false);
                if (rule.inventory) setInventoryRules(rule.inventory);
                if (rule.assignment) setAssignmentRules(rule.assignment);
                if (rule.audit) setAuditRules(rule.audit);
            }
            await fetchAssetCategories(branchId);
        } catch (error) {
            console.error("Error loading asset policy:", error);
        } finally {
            setLoading(false);
            setIsDirty(false);
        }
    }, [branchId, fetchAssetRule, fetchAssetCategories]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSave = async () => {
        const payload = {
            branchId,
            inventory: inventoryRules,
            assignment: assignmentRules,
            audit: auditRules,
        };

        const result = await saveAssetRule(payload);
        if (result) {
            setPolicyId(result._id);
            setIsDirty(false);
        }
    };

    const handleLock = async () => {
        if (!policyId) {
            alert("Please save the policy first before locking.");
            return;
        }
        if (window.confirm("Activate and Lock Asset Governance Policy? This will enforce assignment rules.")) {
            const result = await toggleAssetLock(policyId, { isLocked: true });
            if (result) setIsLocked(true);
        }
    };

    const handleUnlock = async () => {
        const reason = prompt("Enter Audit Reason for Unlocking Asset Policy:");
        if (reason) {
            const result = await toggleAssetLock(policyId, { isLocked: false, unlockReason: reason });
            if (result) setIsLocked(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Asset & Inventory Rules</h1>
                    <p className="text-gray-500 text-sm">Manage asset categories, allocation policies, and audit schedules.</p>
                </div>
            </div>

            {/* Lock Banner */}
            <div className="mb-6 rounded-lg overflow-hidden">
                <PolicyLockBanner isLocked={isLocked} onLock={handleLock} onUnlock={handleUnlock} />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">

                {/* 1. Classification (Full Column) */}
                <div className="lg:col-span-1">
                    <AssetCategoryPanel isLocked={isLocked} branchId={branchId} />
                </div>

                {/* 2. Middle Column: Assignment & Inventory */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <InventoryRulesPanel
                        isLocked={isLocked}
                        policy={inventoryRules}
                        setPolicy={(val) => { setInventoryRules(val); setIsDirty(true); }}
                    />
                    <AssignmentRulesPanel
                        isLocked={isLocked}
                        rules={assignmentRules}
                        setRules={(val) => { setAssignmentRules(val); setIsDirty(true); }}
                    />
                </div>

                {/* 3. Right Column: Audit & Stats */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <AuditRulesPanel
                        isLocked={isLocked}
                        policy={auditRules}
                        setPolicy={(val) => { setAuditRules(val); setIsDirty(true); }}
                    />

                    {/* Stats */}
                    <div className="bg-slate-800 rounded-xl p-6 text-white flex-1">
                        <div>
                            <h3 className="font-bold text-lg mb-2">Audit Readiness</h3>
                            <p className="text-slate-400 text-xs">Compliance score based on active policies.</p>
                        </div>
                        <div className="mt-6 flex items-end gap-2">
                            <span className="text-4xl font-bold text-emerald-400">100%</span>
                            <span className="text-sm text-slate-400 mb-1.5">Compliant</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 mb-6">
                            <div className="bg-emerald-400 h-1.5 rounded-full w-full"></div>
                        </div>
                        <p className="text-[10px] text-slate-500">
                            Last System Scan: Today, 09:00 AM
                        </p>
                    </div>

                </div>

            </div>

            {/* Footer Actions */}
            {!isLocked && isDirty && (
                <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white border-t border-gray-200 p-4 flex justify-between items-center z-10 transition-all">
                    <div className="flex items-center gap-2 text-amber-600 text-sm">
                        <AlertTriangle size={16} />
                        <span>Unsaved changes in draft.</span>
                    </div>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg font-medium"
                    >
                        <Save size={18} /> Save Policy
                    </button>
                </div>
            )}

        </div>
    );
};

export default AssetRules;
