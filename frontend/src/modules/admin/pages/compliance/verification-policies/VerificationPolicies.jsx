
import React, { useState, useEffect } from 'react';
import { Save, Lock, Play, Shield, History, Info } from 'lucide-react';
import EntityPolicySelector from './components/EntityPolicySelector';
import PolicyCard from './components/PolicyCard';

const VerificationPolicies = () => {

    // UI State
    const [loading, setLoading] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState('student');
    const [policyStatus, setPolicyStatus] = useState('DRAFT'); // DRAFT, MOVING_TO_ACTIVE, ACTIVE
    const [expandedPolicyId, setExpandedPolicyId] = useState(null);

    // Data State (Mock)
    const [policies, setPolicies] = useState([]);

    // Mock Loader
    useEffect(() => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setPolicies(getMockPolicies(selectedEntity));
            setLoading(false);
            setExpandedPolicyId(1); // Auto expand first
        }, 600);
    }, [selectedEntity]);

    const getMockPolicies = (entity) => {
        // Base structure
        const common = [
            {
                id: 1,
                documentName: 'Aadhar Card',
                category: 'Identity Proof',
                mode: 'manual', // none, manual, multi
                levels: [
                    { id: 101, role: 'Compliance Officer', slaHours: 24, canReject: true }
                ]
            }
        ];

        if (entity === 'student') return [
            ...common,
            {
                id: 2,
                documentName: 'Transfer Certificate',
                category: 'Academic',
                mode: 'multi',
                levels: [
                    { id: 201, role: 'Clerk', slaHours: 4, canReject: true },
                    { id: 202, role: 'Principal', slaHours: 48, canReject: true }
                ]
            },
            {
                id: 3,
                documentName: 'Medical Certificate',
                category: 'Health',
                mode: 'none',
                levels: []
            }
        ];

        return common;
    };

    // Handlers
    const handleUpdateMode = (id, newMode) => {
        setPolicies(prev => prev.map(p => {
            if (p.id !== id) return p;

            // Handle Mode Logic
            let newLevels = [...p.levels];
            if (newMode === 'none') newLevels = [];
            if (newMode === 'manual' && p.levels.length === 0) newLevels = [{ id: Date.now(), role: 'Admin', slaHours: 24, canReject: true }];
            if (newMode === 'multi' && p.levels.length < 2) newLevels = [...newLevels, { id: Date.now() + 1, role: 'Admin', slaHours: 24, canReject: true }];

            return { ...p, mode: newMode, levels: newLevels };
        }));
    };

    const handleUpdateLevels = (id, newLevels) => {
        setPolicies(prev => prev.map(p => p.id === id ? { ...p, levels: newLevels } : p));
    };

    const handleExpandToggle = (id) => {
        setExpandedPolicyId(prev => prev === id ? null : id);
    };

    const handleActivate = () => {
        if (window.confirm("Activate Verification Policies? This will impact all new uploads immediately.")) {
            setLoading(true);
            setTimeout(() => {
                setPolicyStatus('ACTIVE');
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <div className="pb-20 relative">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Verification Policies</h1>
                    <p className="text-gray-500 text-sm">Configure workflow levels, SLAs, and approval authorities for document verification.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${policyStatus === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                        }`}>
                        STATUS: {policyStatus}
                    </div>
                </div>
            </div>

            {/* Context Selector */}
            <div className="mb-6">
                <EntityPolicySelector
                    selectedEntity={selectedEntity}
                    onEntityChange={setSelectedEntity}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Available Policies List */}
                <div className="lg:col-span-8 space-y-4">
                    {loading ? (
                        <div className="py-20 text-center text-gray-400">Loading Policies...</div>
                    ) : (
                        policies.map(policy => (
                            <PolicyCard
                                key={policy.id}
                                policy={policy}
                                isExpanded={expandedPolicyId === policy.id}
                                onToggleExpand={() => handleExpandToggle(policy.id)}
                                onUpdateMode={handleUpdateMode}
                                onUpdateLevels={handleUpdateLevels}
                            />
                        ))
                    )}
                </div>

                {/* Sidebar Actions */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Action Panel */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-24">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield size={18} className="text-indigo-600" />
                            Control Center
                        </h3>

                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                                <Save size={18} />
                                Save Draft
                            </button>
                            <button
                                onClick={handleActivate}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md transition-colors"
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
