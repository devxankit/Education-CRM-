import React, { useState, useEffect } from 'react';
import { Save, Lock, Play, Shield, History, Info } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import EntityPolicySelector from './components/EntityPolicySelector';
import PolicyCard from './components/PolicyCard';

const VerificationPolicies = () => {
    const { branches, fetchBranches, fetchVerificationPolicies, saveVerificationPolicies } = useAdminStore();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [selectedEntity, setSelectedEntity] = useState('student');
    const [policyStatus, setPolicyStatus] = useState('DRAFT');
    const [expandedPolicyId, setExpandedPolicyId] = useState(null);
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        if (branches.length && !selectedBranchId) setSelectedBranchId(branches[0]._id);
    }, [branches, selectedBranchId]);

    useEffect(() => {
        if (!selectedBranchId) return;
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchVerificationPolicies(selectedBranchId, selectedEntity);
                const normalized = (Array.isArray(data) ? data : []).map((p) => ({
                    ...p,
                    id: p._id || p.id,
                    levels: (p.levels || []).map((l, i) => ({ ...l, id: l.id || `${p._id}-${i}` })),
                }));
                setPolicies(normalized);
                if (normalized[0]) setExpandedPolicyId(normalized[0].id);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [selectedBranchId, selectedEntity, fetchVerificationPolicies]);

    const handleUpdateMode = (id, newMode) => {
        setPolicies((prev) =>
            prev.map((p) => {
                if ((p.id || p._id) !== id) return p;
                let newLevels = [...(p.levels || [])];
                if (newMode === 'none') newLevels = [];
                if (newMode === 'manual' && newLevels.length === 0)
                    newLevels = [{ id: Date.now(), role: 'Admin', slaHours: 24, canReject: true }];
                if (newMode === 'multi' && newLevels.length < 2)
                    newLevels = [...newLevels, { id: Date.now() + 1, role: 'Admin', slaHours: 24, canReject: true }];
                return { ...p, mode: newMode, levels: newLevels };
            })
        );
    };

    const handleUpdateLevels = (id, newLevels) => {
        setPolicies((prev) =>
            prev.map((p) => ((p.id || p._id) === id ? { ...p, levels: newLevels } : p))
        );
    };

    const handleExpandToggle = (id) => {
        setExpandedPolicyId((prev) => (prev === id ? null : id));
    };

    const handleSaveDraft = async () => {
        if (!selectedBranchId) return;
        setSaving(true);
        try {
            const payload = policies.map((p) => ({
                documentName: p.documentName,
                category: p.category || 'General',
                mode: p.mode || 'manual',
                levels: (p.levels || []).map(({ role, slaHours, canReject }) => ({ role, slaHours, canReject })),
            }));
            await saveVerificationPolicies(selectedBranchId, selectedEntity, payload);
            const data = await fetchVerificationPolicies(selectedBranchId, selectedEntity);
            const normalized = (Array.isArray(data) ? data : []).map((p) => ({
                ...p,
                id: p._id || p.id,
                levels: (p.levels || []).map((l, i) => ({ ...l, id: l.id || `${p._id}-${i}` })),
            }));
            setPolicies(normalized);
        } finally {
            setSaving(false);
        }
    };

    const handleActivate = async () => {
        if (!window.confirm('Activate Verification Policies? This will impact all new uploads immediately.')) return;
        await handleSaveDraft();
        setPolicyStatus('ACTIVE');
    };

    return (
        <div className="pb-20 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Verification Policies</h1>
                    <p className="text-gray-500 text-sm">Configure workflow levels, SLAs, and approval authorities for document verification.</p>
                </div>
                <div className="flex items-center gap-3">
                    {branches.length > 1 && (
                        <select
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                        >
                            {branches.map((b) => (
                                <option key={b._id} value={b._id}>{b.name || b.branchName || b._id}</option>
                            ))}
                        </select>
                    )}
                    <div
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${policyStatus === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}
                    >
                        STATUS: {policyStatus}
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <EntityPolicySelector
                    selectedEntity={selectedEntity}
                    onEntityChange={setSelectedEntity}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-4">
                    {loading ? (
                        <div className="py-20 text-center text-gray-400">Loading Policies...</div>
                    ) : (
                        policies.map((policy) => (
                            <PolicyCard
                                key={policy.id || policy._id}
                                policy={policy}
                                isExpanded={expandedPolicyId === (policy.id || policy._id)}
                                onToggleExpand={() => handleExpandToggle(policy.id || policy._id)}
                                onUpdateMode={handleUpdateMode}
                                onUpdateLevels={handleUpdateLevels}
                            />
                        ))
                    )}
                    {!loading && policies.length === 0 && (
                        <div className="py-12 text-center text-gray-500 bg-white border border-gray-200 rounded-xl">
                            No verification policies for this branch/entity. Save a draft after adding policies below (e.g. from Required Documents rules).
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-24">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield size={18} className="text-indigo-600" />
                            Control Center
                        </h3>
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => {
                                    const newId = `new-${Date.now()}`;
                                    setPolicies((prev) => [
                                        ...prev,
                                        {
                                            id: newId,
                                            documentName: 'New Document',
                                            category: 'General',
                                            mode: 'manual',
                                            levels: [{ id: Date.now(), role: 'Admin', slaHours: 24, canReject: true }],
                                        },
                                    ]);
                                    setExpandedPolicyId(newId);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                + Add Policy
                            </button>
                            <button
                                onClick={handleSaveDraft}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                <Save size={18} />
                                {saving ? 'Saving...' : 'Save Draft'}
                            </button>
                            <button
                                onClick={handleActivate}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md transition-colors disabled:opacity-50"
                            >
                                <Play size={18} />
                                Activate Policies
                            </button>
                        </div>
                        <hr className="my-6 border-gray-200" />
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-800 space-y-2">
                            <div className="flex items-start gap-2">
                                <Info size={14} className="mt-0.5 shrink-0" />
                                <p><strong>Audit Log:</strong> All changes to verification workflows are logged with version history.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationPolicies;
