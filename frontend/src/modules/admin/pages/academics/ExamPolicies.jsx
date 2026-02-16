
import React, { useState, useEffect } from 'react';
import { Settings, Save, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import { useExamPolicyStore } from '../../../../store/examPolicyStore';
import { useAdminStore, selectAcademicYearsForSelect } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

import PolicyLockBanner from './components/policies/PolicyLockBanner';
import ExamTypesConfig from './components/policies/ExamTypesConfig';
import GradingSystemConfig from './components/policies/GradingSystemConfig';
import PromotionRulesConfig from './components/policies/PromotionRulesConfig';
import VisibilityConfig from './components/policies/VisibilityConfig';

const ExamPolicies = () => {
    const { policy, isFetching, fetchPolicy, unlockPolicy, lockPolicy, savePolicy, isProcessing } = useExamPolicyStore();
    const academicYears = useAdminStore(selectAcademicYearsForSelect);
    const { fetchAcademicYears } = useAdminStore();
    const user = useAppStore((s) => s.user);
    const isAdmin = ['admin', 'super_admin', 'institute'].includes(user?.role);

    const [activeTab, setActiveTab] = useState('types');
    const [selectedYear, setSelectedYear] = useState('');

    useEffect(() => {
        fetchAcademicYears();
    }, [fetchAcademicYears]);

    useEffect(() => {
        if (academicYears.length > 0 && !selectedYear) {
            const currentYear = academicYears.find(y => y.status === 'active') || academicYears[0];
            if (currentYear) setSelectedYear(currentYear._id);
        }
    }, [academicYears, selectedYear]);

    useEffect(() => {
        if (selectedYear) {
            fetchPolicy(selectedYear);
        }
    }, [selectedYear, fetchPolicy]);

    const handleUnlock = async () => {
        const reason = isAdmin ? "Admin direct unlock" : prompt("Please provide a reason for Unlocking the Policy (Mandatory for Audit):");
        if (reason && reason.length >= 5) {
            const result = await unlockPolicy(selectedYear, reason);
            if (!result.success) alert(result.message);
        } else if (reason !== null && !isAdmin) {
            alert("Valid reason (min 5 chars) required.");
        }
    };

    const handleLock = async () => {
        if (window.confirm("Lock this policy? Changes will apply immediately.")) {
            const result = await lockPolicy(selectedYear);
            if (!result.success) alert(result.message);
        }
    };

    const handleSave = async () => {
        const result = await savePolicy(policy);
        if (result.success) {
            alert("Policy saved successfully!");
        } else {
            alert(result.message);
        }
    };

    const isLocked = policy?.isLocked ?? true;

    const steps = [
        { id: 'types', label: '1. Exam Types & Weightage' },
        { id: 'grading', label: '2. Grading & Marks' },
        { id: 'promotion', label: '3. Promotion Rules' },
        { id: 'visibility', label: '4. Visibility & Publish' }
    ];

    return (
        <div className="h-full flex flex-col relative pb-10">

            {/* Header */}
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Exam Rules & Policies</h1>
                    <p className="text-gray-500 text-sm">Configure the academic evaluation framework.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Academic Year</label>
                        <select 
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            {academicYears.map(year => (
                                <option key={year._id} value={year._id}>{year.name}</option>
                            ))}
                        </select>
                    </div>

                    {!isLocked && (
                        <button 
                            onClick={handleSave}
                            disabled={isProcessing}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm disabled:opacity-50"
                        >
                            {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Save Changes
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col relative">
                {isFetching && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center">
                        <Loader2 size={40} className="text-indigo-600 animate-spin" />
                    </div>
                )}

                {/* Lock Status Banner */}
                <PolicyLockBanner
                    isLocked={isLocked}
                    onLock={handleLock}
                    onUnlock={handleUnlock}
                    isAdmin={isAdmin}
                />

                <div className="flex flex-1">

                    {/* Left Sidebar Steps */}
                    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 shrink-0">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Configuration Steps</h3>
                        <nav className="space-y-1">
                            {steps.map((step) => (
                                <button
                                    key={step.id}
                                    onClick={() => setActiveTab(step.id)}
                                    className={`
                                        w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group
                                        ${activeTab === step.id
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-gray-600 hover:bg-white hover:text-gray-900'
                                        }
                                    `}
                                >
                                    {step.label}
                                    {activeTab === step.id && <ChevronRight size={14} />}
                                </button>
                            ))}
                        </nav>

                        <div className="mt-8 p-4 bg-indigo-900 rounded-lg text-indigo-100 text-xs shadow-inner">
                            <strong className="block mb-1 text-white">Active Policy</strong>
                            <div className="flex justify-between mt-2">
                                <span>Year:</span> <span className="font-mono text-white">{academicYears.find(y => y._id === selectedYear)?.name || '...'}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span>Version:</span> <span className="font-mono text-white">v{policy?.version || '1.0'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 p-8 bg-white overflow-y-auto">

                        {activeTab === 'types' && <ExamTypesConfig isLocked={isLocked} />}
                        {activeTab === 'grading' && <GradingSystemConfig isLocked={isLocked} />}
                        {activeTab === 'promotion' && <PromotionRulesConfig isLocked={isLocked} />}
                        {activeTab === 'visibility' && <VisibilityConfig isLocked={isLocked} />}

                    </div>

                </div>

            </div>
        </div>
    );
};

export default ExamPolicies;
