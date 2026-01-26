
import React, { useState, useEffect } from 'react';
import { Save, Lock, Play, RotateCcw, ShieldCheck, History, AlertCircle } from 'lucide-react';
import EntitySelector from './components/EntitySelector';
import DocumentRulesTable from './components/DocumentRulesTable';
import GovernancePolicyPanel from './components/GovernancePolicyPanel';
import RuleImpactPreview from './components/RuleImpactPreview';

const RequiredDocumentsRules = () => {
    // UI State
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('rules'); // rules, history
    const [showImpactModal, setShowImpactModal] = useState(false);

    // Filter State
    const [selectedEntity, setSelectedEntity] = useState('student'); // student, employee, parent
    const [selectedSubType, setSelectedSubType] = useState('School (K-12)');

    // Rule State (Mock)
    const [rules, setRules] = useState([]);
    const [ruleStatus, setRuleStatus] = useState('DRAFT'); // DRAFT, ACTIVE, LOCKED
    const [version, setVersion] = useState('1.0');

    // Stats for Impact Preview
    const [impactStats, setImpactStats] = useState({
        affectedUsers: 0,
        blockedAdmissions: 0,
        pendingVerifications: 0
    });

    // Governance Policy State
    const [governancePolicies, setGovernancePolicies] = useState({
        provisionalAllowed: true,
        provisionalDays: 45,
        overrideRoles: ['Super Admin']
    });

    // Mock Data Loader
    useEffect(() => {
        // Simulate API fetch based on entity
        setLoading(true);
        setTimeout(() => {
            const mockRules = getMockRules(selectedEntity);
            setRules(mockRules);
            setRuleStatus('DRAFT'); // Reset to draft on switch for demo
            setVersion((Math.random() * 2 + 1).toFixed(1));
            setLoading(false);
        }, 600);
    }, [selectedEntity, selectedSubType]);

    // Data Helpers
    const getMockRules = (entity) => {
        const common = [
            { id: 1, name: 'Aadhar Card / ID Proof', category: 'Identity', isRequired: true, stage: 'Admission', condition: 'All', gracePeriodDays: 7, enforcement: 'block' },
            { id: 2, name: 'Residence Proof', category: 'Address', isRequired: true, stage: 'Admission', condition: 'All', gracePeriodDays: 15, enforcement: 'warning' },
        ];

        if (entity === 'student') return [
            ...common,
            { id: 3, name: 'Transfer Certificate (TC)', category: 'Academic', isRequired: true, stage: 'Admission', condition: 'New Admission', gracePeriodDays: 30, enforcement: 'block' },
            { id: 4, name: 'Previous Marksheets', category: 'Academic', isRequired: true, stage: 'Admission', condition: 'All', gracePeriodDays: 0, enforcement: 'block' },
            { id: 5, name: 'Transport Application', category: 'Optional', isRequired: false, stage: 'Post-Admission', condition: 'Transport Users', gracePeriodDays: 5, enforcement: 'info' },
            { id: 6, name: 'Medical Fitness Certificate', category: 'Health', isRequired: false, stage: 'Joining', condition: 'Sports Quote', gracePeriodDays: 10, enforcement: 'warning' },
        ];

        if (entity === 'employee') return [
            ...common,
            { id: 10, name: 'Police Verification', category: 'Legal', isRequired: true, stage: 'Joining', condition: 'All Staff', gracePeriodDays: 45, enforcement: 'block' },
            { id: 11, name: 'Experience Certificate', category: 'Professional', isRequired: true, stage: 'Interview', condition: 'Experienced', gracePeriodDays: 0, enforcement: 'warning' },
            { id: 12, name: 'Bank Passbook Copy', category: 'Financial', isRequired: true, stage: 'Joining', condition: 'Payroll', gracePeriodDays: 7, enforcement: 'block' },
        ];

        if (entity === 'parent') return [
            { id: 20, name: 'Father ID Proof', category: 'Identity', isRequired: true, stage: 'Admission', condition: 'All', gracePeriodDays: 10, enforcement: 'block' },
            { id: 21, name: 'Mother ID Proof', category: 'Identity', isRequired: true, stage: 'Admission', condition: 'All', gracePeriodDays: 10, enforcement: 'block' },
            { id: 22, name: 'Income Certificate', category: 'Financial', isRequired: false, stage: 'Admission', condition: 'Scholarship Applicants', gracePeriodDays: 30, enforcement: 'warning' },
        ];

        return [];
    };

    // Handlers
    const handleToggleRequired = (id) => {
        if (ruleStatus === 'LOCKED') return;
        setRules(prev => prev.map(r => r.id === id ? { ...r, isRequired: !r.isRequired } : r));
    };

    const handleUpdateRule = (id, field, value) => {
        if (ruleStatus === 'LOCKED') return;
        setRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const handleUpdatePolicy = (field, value) => {
        if (ruleStatus === 'LOCKED') return;
        setGovernancePolicies(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveDraft = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert("Draft Saved Successfully!");
        }, 500);
    };

    const handlePreActivate = () => {
        // Calculate mock impact
        setImpactStats({
            affectedUsers: Math.floor(Math.random() * 500) + 50,
            blockedAdmissions: Math.floor(Math.random() * 20),
            pendingVerifications: Math.floor(Math.random() * 100) + 20
        });
        setShowImpactModal(true);
    };

    const handleConfirmActivation = () => {
        setShowImpactModal(false);
        setLoading(true);
        setTimeout(() => {
            setRuleStatus('ACTIVE');
            setLoading(false);
            // alert("Rules Activated Successfully!");
        }, 1000);
    };

    const handleLock = () => {
        if (window.confirm("Locking rules prevents further editing and creates a compliance snapshot. Continue?")) {
            setRuleStatus('LOCKED');
        }
    };

    return (
        <div className="pb-20 relative">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Required Documents Rules</h1>
                    <p className="text-gray-500 text-sm">Define and enforce mandatory documentation policies across the institution.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${ruleStatus === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200' :
                        ruleStatus === 'LOCKED' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            'bg-yellow-100 text-yellow-700 border-yellow-200'
                        }`}>
                        STATUS: {ruleStatus}
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-gray-100 text-gray-600 border border-gray-200">
                        v{version}
                    </div>
                </div>
            </div>

            {/* Entity Selector */}
            <EntitySelector
                selectedEntity={selectedEntity}
                selectedSubType={selectedSubType}
                onEntityChange={setSelectedEntity}
                onSubTypeChange={setSelectedSubType}
            />

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Left: Rules Table (3 cols) */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Toolbar */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <ShieldCheck className="text-indigo-600" />
                            Configuration Rules
                        </h2>
                        <div className="text-sm text-gray-500">
                            {rules.filter(r => r.isRequired).length} Mandatory Documents Configured
                        </div>
                    </div>

                    {/* Table */}
                    <DocumentRulesTable
                        rules={rules}
                        onToggleRequired={handleToggleRequired}
                        onUpdateRule={handleUpdateRule}
                    />

                    {/* Governance & Policy Panel (Section 5) */}
                    <GovernancePolicyPanel
                        policies={governancePolicies}
                        onUpdate={handleUpdatePolicy}
                    />

                    {/* Disclaimer */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-sm text-blue-800">
                        <AlertCircle className="shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="font-semibold">Compliance Note:</p>
                            <p>For 'Hard Block' enforcement, the system will strictly prevent the specified action (e.g., Admission Form Submission) until the document is uploaded and verified by a localized staff member.</p>
                        </div>
                    </div>

                </div>

                {/* Right: Actions & Meta (1 col) */}
                <div className="space-y-6">

                    {/* Action Card */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-24">
                        <h3 className="font-bold text-gray-900 mb-4">Rule Actions</h3>

                        <div className="space-y-3">
                            <button
                                onClick={handleSaveDraft}
                                disabled={ruleStatus === 'LOCKED' || loading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                <Save size={18} />
                                Save Draft
                            </button>

                            <button
                                onClick={handlePreActivate}
                                disabled={ruleStatus === 'LOCKED' || loading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : (
                                    <>
                                        <Play size={18} />
                                        Activate Rules
                                    </>
                                )}
                            </button>

                            {ruleStatus === 'ACTIVE' && (
                                <button
                                    onClick={handleLock}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 border border-purple-200 font-medium rounded-lg hover:bg-purple-100 transition-colors"
                                >
                                    <Lock size={18} />
                                    Lock Version
                                </button>
                            )}

                            {ruleStatus === 'LOCKED' && (
                                <div className="text-center p-3 bg-gray-100 rounded text-xs text-gray-500">
                                    Rules are currently locked for compliance audit.
                                    <br />
                                    <strong>Contact Super Admin to unlock.</strong>
                                </div>
                            )}
                        </div>

                        <hr className="my-6 border-gray-200" />

                        <div className="space-y-4">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase">Audit Trail</h4>
                            <div className="text-xs space-y-3">
                                <div className="flex gap-2">
                                    <History size={14} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-gray-700 font-medium">Draft Created</p>
                                        <p className="text-gray-400">Today, 10:30 AM by You</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <History size={14} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-gray-700 font-medium">Version 1.0 Locked</p>
                                        <p className="text-gray-400">Yesterday by Super Admin</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            {/* Impact Modal */}
            <RuleImpactPreview
                isOpen={showImpactModal}
                onClose={() => setShowImpactModal(false)}
                onConfirm={handleConfirmActivation}
                stats={impactStats}
            />

        </div>
    );
};

export default RequiredDocumentsRules;
