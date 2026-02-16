import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, Loader2 } from 'lucide-react';
import PolicyLockBanner from '../academics/components/policies/PolicyLockBanner';
import { useAdminStore, selectAcademicYearsForSelect } from '../../../../store/adminStore';

// Components
import InstallmentRulesPanel from './components/fee-policies/InstallmentRulesPanel';
import LateFeeRulesPanel from './components/fee-policies/LateFeeRulesPanel';
import DiscountRulesPanel from './components/fee-policies/DiscountRulesPanel';
import RefundRulesPanel from './components/fee-policies/RefundRulesPanel';

const FeePolicies = () => {
    const academicYears = useAdminStore(selectAcademicYearsForSelect);
    const { fetchAcademicYears, fetchFeePolicy, saveFeePolicy } = useAdminStore();

    // Global State
    const [academicYearId, setAcademicYearId] = useState('');
    const [policy, setPolicy] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchAcademicYears();
    }, [fetchAcademicYears]);

    useEffect(() => {
        const active = academicYears.find(ay => ay.status === 'active') || academicYears[0];
        if (academicYears.length > 0 && !academicYearId && active) {
            setAcademicYearId(active._id);
        }
    }, [academicYears, academicYearId]);

    useEffect(() => {
        const loadPolicy = async () => {
            if (!academicYearId) return;
            setLoading(true);
            const data = await fetchFeePolicy(academicYearId);
            if (data) {
                setPolicy(data);
                setIsLocked(data.isLocked || false);
            }
            setLoading(false);
            setIsDirty(false);
        };
        loadPolicy();
    }, [academicYearId, fetchFeePolicy]);

    const handlePolicyChange = (field, value) => {
        if (isLocked) return;
        setPolicy(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleSave = async (lockReason) => {
        setIsSaving(true);
        const dataToSave = {
            ...policy,
            academicYearId,
            unlockReason: lockReason
        };
        const result = await saveFeePolicy(dataToSave);
        if (result) {
            setPolicy(result);
            setIsLocked(result.isLocked);
            setIsDirty(false);
        }
        setIsSaving(false);
    };

    const handleLock = () => {
        if (window.confirm("Lock Fee Policies for the year? This action requires Admin privileges to undo.")) {
            handleSave(); // Backend will set isLocked: true if we add it to the state
            // Or better, we explicitly set it
            setPolicy(prev => ({ ...prev, isLocked: true }));
            setIsDirty(true);
        }
    };

    const handleUnlock = () => {
        const reason = prompt("Enter Audit Reason for Unlocking Policies:");
        if (reason) {
            setPolicy(prev => ({ ...prev, isLocked: false, unlockReason: reason }));
            setIsLocked(false);
            setIsDirty(true);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500 mb-2" size={32} />
                <p className="text-gray-500 text-sm">Loading policies...</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col relative pb-10 font-['Inter']">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Fee Policies & Rules</h1>
                    <p className="text-gray-500 text-sm">Configure financial behavior for payments, fines, and concessions.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500">
                        <span className="text-gray-500">Academic Year:</span>
                        <select
                            value={academicYearId}
                            onChange={(e) => setAcademicYearId(e.target.value)}
                            className="font-bold text-gray-800 outline-none bg-transparent cursor-pointer"
                        >
                            {academicYears.map(year => (
                                <option key={year._id} value={year._id}>{year.name}</option>
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
                /* Content Rules Grid */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">

                    {/* 1. Installments */}
                    <InstallmentRulesPanel
                        isLocked={isLocked}
                        data={policy.installmentRules}
                        onChange={(val) => handlePolicyChange('installmentRules', val)}
                    />

                    {/* 2. Refund Rules */}
                    <RefundRulesPanel
                        isLocked={isLocked}
                        data={policy.refundRules}
                        onChange={(val) => handlePolicyChange('refundRules', val)}
                    />

                    {/* 3. Late Fees (Full Width) */}
                    <div className="lg:col-span-2">
                        <LateFeeRulesPanel
                            isLocked={isLocked}
                            data={policy.lateFeeRules}
                            onChange={(val) => handlePolicyChange('lateFeeRules', val)}
                        />
                    </div>

                    {/* 4. Discounts (Full Width) */}
                    <div className="lg:col-span-2">
                        <DiscountRulesPanel
                            isLocked={isLocked}
                            data={policy.discountRules}
                            onChange={(val) => handlePolicyChange('discountRules', val)}
                        />
                    </div>

                </div>
            ) : (
                <div className="p-12 text-center text-gray-400">
                    No policy metadata found for this year.
                </div>
            )}

            {/* Footer Actions */}
            {!isLocked && isDirty && (
                <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white border-t border-gray-200 p-4 flex justify-between items-center z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-all animate-slide-up">
                    <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                        <AlertTriangle size={16} />
                        <span>You have unsaved policy changes.</span>
                    </div>
                    <button
                        onClick={() => handleSave()}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md font-bold transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {isSaving ? 'Saving...' : 'Save Policy Configuration'}
                    </button>
                </div>
            )}

        </div>
    );
};

export default FeePolicies;
