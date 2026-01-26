import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Settings, Info } from 'lucide-react';

// Sub Components
import SettingsSection from './components/SettingsSection';
import InstitutionIdentityForm from './components/InstitutionIdentityForm';
import AcademicDefaultsForm from './components/AcademicDefaultsForm';
import RegionalSettingsForm from './components/RegionalSettingsForm';
import SystemDefaultsForm from './components/SystemDefaultsForm';
import SecurityBaselineForm from './components/SecurityBaselineForm';
import ChangeSummaryModal from './components/ChangeSummaryModal';

const GeneralSettings = () => {

    // Initial State (Mock DB State)
    const initialState = {
        // Identity
        institutionName: 'Springfield High School',
        email: 'admin@springfield.edu',
        phone: '+91 98765 43210',
        address: '123 Education Lane, Knowledge Park',
        logoPreview: null,

        // Academic
        academicYear: '2024-2025',
        structure: 'Annual',
        startMonth: 'April',
        defaultTerm: 'Term 1',

        // Regional
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        currency: 'INR',
        language: 'en-US',

        // System
        dashboardStudent: 'Dashboard',
        dashboardTeacher: 'Dashboard',
        dashboardAdmin: 'Dashboard',
        themeMode: 'light',
        paginationLimit: '25',
        sessionTimeout: 30,

        // Security
        forceProfileCompletion: true,
        forcePasswordChange: true,
        minPasswordLength: 8,
        passwordComplexity: 'alphanumeric'
    };

    const [values, setValues] = useState(initialState);
    const [originalValues, setOriginalValues] = useState(initialState);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingChanges, setPendingChanges] = useState([]);
    const [loading, setLoading] = useState(false);

    // Track Changes
    const handleChange = (key, value) => {
        setValues(prev => ({ ...prev, [key]: value }));
    };

    // Calculate Diff for Confirm Modal
    const handlePreSave = () => {
        const changes = [];
        Object.keys(values).forEach(key => {
            if (values[key] !== originalValues[key]) {
                // Formatting labels for better UI
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                changes.push({
                    key,
                    label,
                    oldVal: originalValues[key],
                    newVal: values[key]
                });
            }
        });

        if (changes.length === 0) {
            alert("No changes detected.");
            return;
        }

        setPendingChanges(changes);
        setShowConfirm(true);
    };

    const handleApplyChanges = () => {
        setLoading(true);
        // Simulate API Call
        setTimeout(() => {
            console.log(`[AUDIT] System Settings Updated | User: Admin | Changes:`, pendingChanges);
            setOriginalValues(values); // Commit changes locally
            setShowConfirm(false);
            setLoading(false);
            alert("System settings updated successfully.");
        }, 1500);
    };

    const handleReset = () => {
        if (window.confirm("Discard all unsaved changes and reload?")) {
            setValues(originalValues);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-50 border-t border-gray-200 -mt-6 -mx-8 relative">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">General Settings</h1>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        System Configuration • Global Defaults
                        <Info size={14} className="text-gray-400" />
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReset}
                        disabled={JSON.stringify(values) === JSON.stringify(originalValues)}
                        className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-red-600 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                        Discard Changes
                    </button>
                    <button
                        onClick={handlePreSave}
                        disabled={JSON.stringify(values) === JSON.stringify(originalValues)}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 text-sm font-medium transition-transform active:scale-95 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                        <Save size={18} /> Apply Changes
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                <div className="max-w-5xl mx-auto space-y-8 pb-10">

                    <SettingsSection
                        title="Institution Identity"
                        description="Core details displayed on reports, certificates, and the login page."
                        isDirty={values.institutionName !== originalValues.institutionName || values.email !== originalValues.email}
                    >
                        <InstitutionIdentityForm values={values} onChange={handleChange} />
                    </SettingsSection>

                    <SettingsSection
                        title="Academic Defaults"
                        description="Configure the academic calendar, terms, and session cycles."
                        isDirty={values.academicYear !== originalValues.academicYear}
                    >
                        <AcademicDefaultsForm values={values} onChange={handleChange} />
                    </SettingsSection>

                    <SettingsSection
                        title="Regional & Localization"
                        description="Set global formats for dates, time, currency, and language."
                        isDirty={values.timezone !== originalValues.timezone || values.currency !== originalValues.currency}
                    >
                        <RegionalSettingsForm values={values} onChange={handleChange} />
                    </SettingsSection>

                    <SettingsSection
                        title="System Behavior"
                        description="Control UI themes, pagination limits, and default landing pages."
                        isDirty={values.themeMode !== originalValues.themeMode}
                    >
                        <SystemDefaultsForm values={values} onChange={handleChange} />
                    </SettingsSection>

                    <SettingsSection
                        title="Security Baseline"
                        description="Enforce minimum security standards for all user accounts."
                        isDirty={values.forcePasswordChange !== originalValues.forcePasswordChange}
                    >
                        <SecurityBaselineForm values={values} onChange={handleChange} />
                    </SettingsSection>

                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <ChangeSummaryModal
                    changes={pendingChanges}
                    onConfirm={handleApplyChanges}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 font-semibold text-gray-700">Applying changes globally...</p>
                </div>
            )}

        </div>
    );
};

export default GeneralSettings;
