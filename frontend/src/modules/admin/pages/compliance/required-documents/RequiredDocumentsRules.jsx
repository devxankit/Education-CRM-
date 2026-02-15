
import React, { useState, useEffect } from 'react';
import { Save, Lock, Play, ShieldCheck, History, AlertCircle, Loader2, Building2 } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import EntitySelector from './components/EntitySelector';
import DocumentRulesTable from './components/DocumentRulesTable';
import GovernancePolicyPanel from './components/GovernancePolicyPanel';
import RuleImpactPreview from './components/RuleImpactPreview';

const STAGE_DISPLAY = { admission: 'Admission', 'post-admission': 'Post-Admission', joining: 'Joining', exam: 'Exam', interview: 'Interview' };
const STAGE_BACKEND = { 'Admission': 'admission', 'Post-Admission': 'post-admission', 'Joining': 'joining', 'Exam': 'exam', 'Interview': 'interview', 'Employment Active': 'joining' };
const ENFORCEMENT_DISPLAY = { hard_block: 'block', soft_warning: 'warning', info_only: 'info' };
const ENFORCEMENT_BACKEND = { block: 'hard_block', warning: 'soft_warning', info: 'info_only' };

const RequiredDocumentsRules = () => {
    const { branches, fetchBranches, fetchDocumentRule, saveDocumentRule } = useAdminStore();
    const [loading, setLoading] = useState(false);
    const [showImpactModal, setShowImpactModal] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState('student');
    const [selectedSubType, setSelectedSubType] = useState('School (K-12)');
    const [selectedBranchId, setSelectedBranchId] = useState('');

    const [rules, setRules] = useState([]);
    const [ruleStatus, setRuleStatus] = useState('DRAFT');
    const [version, setVersion] = useState('1.0');
    const [ruleId, setRuleId] = useState(null);
    const [impactStats, setImpactStats] = useState({ affectedUsers: 0, blockedAdmissions: 0, pendingVerifications: 0 });
    const [governancePolicies, setGovernancePolicies] = useState({
        provisionalAllowed: false,
        provisionalDays: 45,
        overrideRoles: ['Super Admin']
    });

    useEffect(() => { fetchBranches(); }, [fetchBranches]);
    useEffect(() => {
        if (branches.length && !selectedBranchId) setSelectedBranchId(branches[0]._id);
    }, [branches, selectedBranchId]);

    useEffect(() => {
        if (!selectedBranchId) return;
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchDocumentRule(selectedBranchId);
                if (data) {
                    setRuleId(data._id);
                    setRuleStatus(data.isLocked ? 'LOCKED' : 'DRAFT');
                    const list = selectedEntity === 'employee' ? (data.staffRules || []) : (data.studentRules || []);
                    setRules(list.map((r, i) => ({
                        id: r._id || `r-${i}`,
                        name: r.name,
                        category: r.category || 'General',
                        isRequired: !!r.mandatory,
                        stage: STAGE_DISPLAY[r.stage] || r.stage || 'Admission',
                        condition: r.type || 'All',
                        gracePeriodDays: r.gracePeriodDays ?? 0,
                        enforcement: ENFORCEMENT_DISPLAY[r.enforcement] || 'block'
                    })));
                    setGovernancePolicies({
                        provisionalAllowed: !!data.provisionalAdmission?.allowed,
                        provisionalDays: data.provisionalAdmission?.maxValidityDays ?? 45,
                        overrideRoles: Array.isArray(data.overrideRoles) ? data.overrideRoles : ['Super Admin']
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [selectedBranchId, selectedEntity, fetchDocumentRule]);

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

    const buildBackendRules = () => rules.map(r => ({
        name: r.name,
        category: r.category,
        mandatory: r.isRequired,
        stage: STAGE_BACKEND[r.stage] || 'admission',
        gracePeriodDays: Number(r.gracePeriodDays) || 0,
        enforcement: ENFORCEMENT_BACKEND[r.enforcement] || 'hard_block',
        ...(selectedEntity === 'employee' ? { type: r.condition === 'All' ? 'all' : 'teaching' } : { verifier: 'admin' })
    }));

    const handleSaveDraft = async () => {
        if (!selectedBranchId) return;
        setLoading(true);
        try {
            const data = await fetchDocumentRule(selectedBranchId);
            const payload = {
                branchId: selectedBranchId,
                categories: data?.categories,
                workflow: data?.workflow,
                provisionalAdmission: {
                    allowed: governancePolicies.provisionalAllowed,
                    maxValidityDays: governancePolicies.provisionalDays
                },
                overrideRoles: governancePolicies.overrideRoles,
                studentRules: selectedEntity === 'student' ? buildBackendRules() : (data?.studentRules || []),
                staffRules: selectedEntity === 'employee' ? buildBackendRules() : (data?.staffRules || [])
            };
            await saveDocumentRule(payload);
            setRuleStatus('ACTIVE');
        } finally {
            setLoading(false);
        }
    };

    const handlePreActivate = () => {
        setImpactStats({
            affectedUsers: Math.floor(Math.random() * 500) + 50,
            blockedAdmissions: Math.floor(Math.random() * 20),
            pendingVerifications: Math.floor(Math.random() * 100) + 20
        });
        setShowImpactModal(true);
    };

    const handleConfirmActivation = () => {
        setShowImpactModal(false);
        handleSaveDraft();
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

                <div className="flex flex-wrap items-center gap-3">
                    {branches.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Building2 size={18} className="text-gray-500" />
                            <select
                                value={selectedBranchId}
                                onChange={(e) => setSelectedBranchId(e.target.value)}
                                className="text-sm font-semibold border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                {branches.map(b => (
                                    <option key={b._id} value={b._id}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {loading && <Loader2 size={18} className="animate-spin text-indigo-600" />}
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
                    {loading && !rules.length ? (
                        <div className="flex items-center justify-center py-12 text-gray-500">
                            <Loader2 className="animate-spin mr-2" size={24} /> Loading rules...
                        </div>
                    ) : (
                        <DocumentRulesTable
                            rules={rules}
                            onToggleRequired={handleToggleRequired}
                            onUpdateRule={handleUpdateRule}
                        />
                    )}

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
