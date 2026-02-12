import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, Loader2 } from 'lucide-react';
import PolicyLockBanner from '../academics/components/policies/PolicyLockBanner';
import { useAdminStore } from '../../../../store/adminStore';

// Components
import SalaryHeadsPanel from './components/payroll-rules/SalaryHeadsPanel';
import LeaveDeductionPanel from './components/payroll-rules/LeaveDeductionPanel';
import PayrollSchedulePanel from './components/payroll-rules/PayrollSchedulePanel';

const PayrollRules = () => {
    const { fetchPayrollRule, savePayrollRule, academicYears, fetchAcademicYears } = useAdminStore();

    // Global State
    const [financialYear, setFinancialYear] = useState('');
    const [rule, setRule] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch academic years on mount
    useEffect(() => {
        const loadAcademicYears = async () => {
            await fetchAcademicYears();
        };
        loadAcademicYears();
    }, [fetchAcademicYears]);

    // Set default financial year when academic years are loaded
    useEffect(() => {
        if (academicYears.length > 0 && !financialYear) {
            const activeYear = academicYears.find(ay => ay.status === 'active') || academicYears[0];
            if (activeYear?.name) {
                setFinancialYear(activeYear.name);
            }
        } else if (!financialYear && academicYears.length === 0) {
            // Fallback if no academic years
            setFinancialYear('2025-26');
        }
    }, [academicYears, financialYear]);

    useEffect(() => {
        if (!financialYear) return; // Don't fetch if financial year is not set
        
        const loadRule = async () => {
            setLoading(true);
            const data = await fetchPayrollRule(financialYear);
            if (data) {
                setRule(data);
                setIsLocked(data.isLocked || false);
            }
            setLoading(false);
            setIsDirty(false);
        };
        loadRule();
    }, [financialYear, fetchPayrollRule]);

    const handleRuleChange = (field, value) => {
        if (isLocked) return;
        setRule(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleSave = async (unlockReason = '') => {
        setIsSaving(true);
        const dataToSave = {
            ...rule,
            financialYear,
            unlockReason
        };
        const result = await savePayrollRule(dataToSave);
        if (result) {
            setRule(result);
            setIsLocked(result.isLocked);
            setIsDirty(false);
        }
        setIsSaving(false);
    };

    const handleLock = () => {
        if (window.confirm("Lock Payroll Rules? This will affect all salary calculations for this financial year.")) {
            setRule(prev => ({ ...prev, isLocked: true }));
            setIsDirty(true);
            // We can call handleSave() directly if we want to commit immediately
            // But let's let the user click "Save" to be consistent
        }
    };

    const handleUnlock = () => {
        const reason = prompt("Enter Audit Reason for Unlocking Payroll Rules:");
        if (reason) {
            setRule(prev => ({ ...prev, isLocked: false, unlockReason: reason }));
            setIsLocked(false);
            setIsDirty(true);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500 mb-2" size={32} />
                <p className="text-gray-500 text-sm font-medium">Loading payroll rules...</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col relative pb-10 font-['Inter']">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins'] tracking-tight">Payroll Rules & Configuration</h1>
                    <p className="text-gray-500 text-sm">Define salary structures, taxation, and payout schedules.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500">
                        <span className="text-gray-500 font-medium">Financial Year:</span>
                        <select
                            value={financialYear}
                            onChange={(e) => setFinancialYear(e.target.value)}
                            className="font-bold text-gray-800 outline-none bg-transparent cursor-pointer min-w-[120px]"
                        >
                            {academicYears.length > 0 ? (
                                academicYears.map(ay => (
                                    <option key={ay._id || ay.id} value={ay.name}>
                                        {ay.name} {ay.status === 'active' ? '(Active)' : ''}
                                    </option>
                                ))
                            ) : (
                                <>
                                    <option value="2025-26">2025-26</option>
                                    <option value="2024-25">2024-25</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>
            </div>

            {/* Lock Banner */}
            <div className="mb-6 rounded-lg overflow-hidden shadow-sm">
                <PolicyLockBanner isLocked={isLocked} onLock={handleLock} onUnlock={handleUnlock} />
            </div>

            {rule ? (
                /* Content Rules Grid */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">

                    {/* 1. Schedule */}
                    <div className="lg:col-span-2">
                        <PayrollSchedulePanel
                            isLocked={isLocked}
                            data={rule.schedule}
                            onChange={(val) => handleRuleChange('schedule', val)}
                        />
                    </div>

                    {/* 2. Salary Components (Variable Height) */}
                    <div className="lg:col-span-2">
                        <SalaryHeadsPanel
                            isLocked={isLocked}
                            data={rule.salaryHeads}
                            onChange={(val) => handleRuleChange('salaryHeads', val)}
                        />
                    </div>

                    {/* 3. Leave Rules */}
                    <div className="lg:col-span-2">
                        <LeaveDeductionPanel
                            isLocked={isLocked}
                            data={rule.leaveRules}
                            onChange={(val) => handleRuleChange('leaveRules', val)}
                        />
                    </div>

                </div>
            ) : (
                <div className="p-12 text-center text-gray-400 font-medium">
                    No payroll data found for this financial year.
                </div>
            )}

            {/* Footer Actions */}
            {!isLocked && isDirty && (
                <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white border-t border-gray-200 p-4 flex justify-between items-center z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-all animate-slide-up">
                    <div className="flex items-center gap-2 text-amber-600 text-sm font-semibold">
                        <AlertTriangle size={16} />
                        <span>You have unsaved payroll configuration changes.</span>
                    </div>
                    <button
                        onClick={() => handleSave()}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg font-bold transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {isSaving ? 'Processing...' : 'Save Payroll Configuration'}
                    </button>
                </div>
            )}

        </div>
    );
};

export default PayrollRules;
