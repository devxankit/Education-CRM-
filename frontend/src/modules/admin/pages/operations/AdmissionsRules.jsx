
import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, Loader2 } from 'lucide-react';
import PolicyLockBanner from '../academics/components/policies/PolicyLockBanner';
import { useAdminStore } from '../../../../store/adminStore';

// Components
import AdmissionWindowPanel from './components/admissions-rules/AdmissionWindowPanel';
import EligibilityRulesPanel from './components/admissions-rules/EligibilityRulesPanel';
import SeatCapacityPanel from './components/admissions-rules/SeatCapacityPanel';
import AdmissionWorkflowPanel from './components/admissions-rules/AdmissionWorkflowPanel';

const AdmissionRules = () => {
    const { academicYears, fetchAcademicYears, fetchAdmissionRule, saveAdmissionRule } = useAdminStore();

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
        if (academicYears.length > 0 && !academicYearId) {
            setAcademicYearId(academicYears[0]._id);
        }
    }, [academicYears, academicYearId]);

    useEffect(() => {
        const loadPolicy = async () => {
            if (!academicYearId) return;
            setLoading(true);
            const data = await fetchAdmissionRule(academicYearId);
            if (data) {
                const merged = {
                    window: { isOpen: true, startDate: null, endDate: null, allowLate: false, ...data.window },
                    seatCapacity: { strictCapacity: true, waitlistEnabled: true, autoPromoteWaitlist: false, ...data.seatCapacity },
                    workflow: { requireFee: true, requireDocs: true, approval: 'admin', ...data.workflow },
                    eligibility: Array.isArray(data.eligibility) ? data.eligibility : [],
                    isLocked: data.isLocked ?? false
                };
                setPolicy({ ...data, ...merged });
                setIsLocked(merged.isLocked);
            }
            setLoading(false);
            setIsDirty(false);
        };
        loadPolicy();
    }, [academicYearId, fetchAdmissionRule]);

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
        const result = await saveAdmissionRule(dataToSave);
        if (result) {
            setPolicy(result);
            setIsLocked(result.isLocked);
            setIsDirty(false);
        }
        setIsSaving(false);
    };

    const handleLock = async () => {
        if (!window.confirm("Activate and Lock Admission Rules? This will prevent further edits during the active cycle.")) return;
        setIsSaving(true);
        const result = await saveAdmissionRule({ ...policy, academicYearId, isLocked: true });
        if (result) {
            setPolicy(result);
            setIsLocked(true);
            setIsDirty(false);
        }
        setIsSaving(false);
    };

    const handleUnlock = () => {
        const reason = prompt("Enter Audit Reason for Unlocking Admission Rules:");
        if (reason) {
            setPolicy(prev => ({ ...prev, isLocked: false, unlockReason: reason }));
            setIsLocked(false);
            setIsDirty(true);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 className="animate-spin text-indigo-500 mb-3" size={36} />
                <p className="text-gray-500 text-sm font-medium">Loading admission policies...</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admission Policy & Rules</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Define eligibility, timelines, and workflows for new student intake.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                        <label htmlFor="ay-select" className="text-gray-500 text-sm">Academic Year</label>
                        <select
                            id="ay-select"
                            value={academicYearId}
                            onChange={(e) => setAcademicYearId(e.target.value)}
                            className="font-semibold text-gray-800 outline-none bg-transparent cursor-pointer"
                        >
                            {academicYears.map(year => (
                                <option key={year._id} value={year._id}>{year.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Lock Banner */}
            <div className="mb-6 rounded-xl overflow-hidden shadow-sm">
                <PolicyLockBanner isLocked={isLocked} onLock={handleLock} onUnlock={handleUnlock} />
            </div>

            {policy ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-24">
                    {/* 1. Window & Dates */}
                    <div className="lg:col-span-1">
                        <AdmissionWindowPanel
                            isLocked={isLocked}
                            data={policy.window}
                            onChange={(val) => handlePolicyChange('window', val)}
                        />
                    </div>

                    {/* 2. Seat Capacity */}
                    <div className="lg:col-span-1">
                        <SeatCapacityPanel
                            isLocked={isLocked}
                            data={policy.seatCapacity}
                            onChange={(val) => handlePolicyChange('seatCapacity', val)}
                        />
                    </div>

                    {/* 3. Workflow (Full Width) */}
                    <div className="lg:col-span-2">
                        <AdmissionWorkflowPanel
                            isLocked={isLocked}
                            data={policy.workflow}
                            onChange={(val) => handlePolicyChange('workflow', val)}
                        />
                    </div>

                    {/* 4. Eligibility (Full Width) */}
                    <div className="lg:col-span-2">
                        <EligibilityRulesPanel
                            isLocked={isLocked}
                            data={policy.eligibility}
                            onChange={(val) => handlePolicyChange('eligibility', val)}
                        />
                    </div>
                </div>
            ) : (
                <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
                    No policy metadata found for this year. Select an academic year to configure.
                </div>
            )}

            {/* Footer Actions */}
            {!isLocked && isDirty && (
                <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white/95 backdrop-blur border-t border-gray-200 p-4 flex justify-between items-center z-10 shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.08)]">
                    <div className="flex items-center gap-2 text-amber-700 text-sm font-medium">
                        <AlertTriangle size={18} />
                        <span>You have unsaved policy changes</span>
                    </div>
                    <button
                        onClick={() => handleSave()}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {isSaving ? 'Saving...' : 'Save Policy Changes'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdmissionRules;
