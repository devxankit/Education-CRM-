import React, { useState } from 'react';
import { Save, Info, RefreshCw } from 'lucide-react';

// Sub Components
import ConfigSection from './components/ConfigSection';
import ModuleToggleSection from './components/ModuleToggleSection';
import WorkflowConfigPanel from './components/WorkflowConfigPanel';
import FinanceConfigPanel from './components/FinanceConfigPanel';
import UserAccessConfigPanel from './components/UserAccessConfigPanel';
import MobileBehaviorConfigPanel from './components/MobileBehaviorConfigPanel';
import ConfigImpactPreview from './components/ConfigImpactPreview';
import ConfigVersionBadge from './components/ConfigVersionBadge';

const AppConfiguration = () => {

    // Initial State (Mock DB)
    const initialState = {
        // Core Modules
        module_admissions: true,
        module_attendance: true,
        module_exams: true,
        module_fees: true,
        module_hostel: false,
        module_transport: true,
        module_hr: true,
        module_compliance: true,
        module_support: false,
        module_reports: true,
        module_custom_reports: true,

        // Academic Workflow
        attendanceMode: 'daily',
        attendanceLocking: 'end_of_day',
        evaluationMode: 'marks',
        resultPublishing: 'manual',

        // Finance Workflow
        feeStructure: 'monthly',
        enableLateFee: true,
        lateFeeMethod: 'fixed',
        lateFeeValue: 50,
        feeGracePeriod: 5,

        // Access Rule
        allowMultiSession: true,
        forceLogoutOnPassChange: true,
        strictRoleDashboards: false,

        // Mobile
        enableMobileApp: true,
        mobileLiteReports: true,
        mobileBottomNav: true
    };

    const [values, setValues] = useState(initialState);
    const [originalValues, setOriginalValues] = useState(initialState);
    const [showPreview, setShowPreview] = useState(false);
    const [pendingChanges, setPendingChanges] = useState([]);
    const [loading, setLoading] = useState(false);

    // Track Changes
    const handleChange = (key, value) => {
        setValues(prev => ({ ...prev, [key]: value }));
    };

    // Pre-Save Logic
    const handlePreSave = () => {
        const changes = [];
        Object.keys(values).forEach(key => {
            if (values[key] !== originalValues[key]) {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^module_/, 'Module: ').replace(/^./, str => str.toUpperCase());
                changes.push({
                    key,
                    label,
                    oldVal: originalValues[key],
                    newVal: values[key]
                });
            }
        });

        if (changes.length === 0) {
            alert("No changes to apply.");
            return;
        }

        setPendingChanges(changes);
        setShowPreview(true);
    };

    const handleApply = () => {
        setLoading(true);
        setTimeout(() => {
            console.log(`[AUDIT] App Config Updated | User: Admin`, pendingChanges);
            setOriginalValues(values);
            setShowPreview(false);
            setLoading(false);
            alert("Configuration settings applied successfully.");
        }, 1500);
    };

    const handleDiscard = () => {
        if (window.confirm("Discard all unsaved changes and reload?")) {
            setValues(originalValues);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-50 border-t border-gray-200 -mt-6 -mx-8 relative">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">App Configuration</h1>
                        <ConfigVersionBadge version="1.0" lastUpdated="2 days ago" />
                    </div>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        Feature Flags • Workflow Engines • System Core
                        <Info size={14} className="text-gray-400" />
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDiscard}
                        disabled={JSON.stringify(values) === JSON.stringify(originalValues)}
                        className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-red-600 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handlePreSave}
                        disabled={JSON.stringify(values) === JSON.stringify(originalValues)}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 text-sm font-medium transition-transform active:scale-95 disabled:bg-indigo-300 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                        <Save size={18} /> Apply Configuration
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                <div className="max-w-6xl mx-auto space-y-8 pb-10">

                    <ConfigSection
                        title="Module Management"
                        description="Enable or disable specific system modules. Disabling a module hides it from all users immediately."
                        isDirty={Object.keys(values).some(k => k.startsWith('module_') && values[k] !== originalValues[k])}
                    >
                        <ModuleToggleSection values={values} onChange={handleChange} />
                    </ConfigSection>

                    <ConfigSection
                        title="Academic Workflow Engine"
                        description="Configure how attendance, exams, and results are processed."
                        isDirty={['attendanceMode', 'attendanceLocking', 'evaluationMode', 'resultPublishing'].some(k => values[k] !== originalValues[k])}
                    >
                        <WorkflowConfigPanel values={values} onChange={handleChange} />
                    </ConfigSection>

                    <ConfigSection
                        title="Fees & Finance Policy"
                        description="Set global rules for fee collection, tax structures, and penalties."
                        isDirty={['feeStructure', 'enableLateFee', 'lateFeeMethod', 'lateFeeValue', 'feeGracePeriod'].some(k => values[k] !== originalValues[k])}
                    >
                        <FinanceConfigPanel values={values} onChange={handleChange} />
                    </ConfigSection>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ConfigSection
                            title="User Access Control"
                            description="Session policies and security constraints."
                            isDirty={['allowMultiSession', 'forceLogoutOnPassChange', 'strictRoleDashboards'].some(k => values[k] !== originalValues[k])}
                        >
                            <UserAccessConfigPanel values={values} onChange={handleChange} />
                        </ConfigSection>

                        <ConfigSection
                            title="Mobile Experience"
                            description="Configure behavior for the companion mobile apps."
                            isDirty={['enableMobileApp', 'mobileLiteReports', 'mobileBottomNav'].some(k => values[k] !== originalValues[k])}
                        >
                            <MobileBehaviorConfigPanel values={values} onChange={handleChange} />
                        </ConfigSection>
                    </div>

                </div>
            </div>

            {/* Modals & Overlays */}
            {showPreview && (
                <ConfigImpactPreview
                    changes={pendingChanges}
                    onConfirm={handleApply}
                    onCancel={() => setShowPreview(false)}
                />
            )}

            {loading && (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 font-semibold text-gray-700">Reconfiguring system modules...</p>
                </div>
            )}

        </div>
    );
};

export default AppConfiguration;
