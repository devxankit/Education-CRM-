
import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, Loader2 } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';
import PolicyLockBanner from '../academics/components/policies/PolicyLockBanner';

// Components
import DocumentCategoryPanel from './components/document-rules/DocumentCategoryPanel';
import StudentDocumentRulesPanel from './components/document-rules/StudentDocumentRulesPanel';
import StaffDocumentRulesPanel from './components/document-rules/StaffDocumentRulesPanel';
import VerificationWorkflowPanel from './components/document-rules/VerificationWorkflowPanel';

const DocumentRules = () => {
    const { user } = useAppStore();
    const { fetchDocumentRule, saveDocumentRule, toggleDocumentLock } = useAdminStore();

    // Global State
    const [loading, setLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(false);
    const [branch, setBranch] = useState('Global Policy');
    const [policyId, setPolicyId] = useState(null);

    // Form State
    const [categories, setCategories] = useState([]);
    const [workflow, setWorkflow] = useState({
        verificationLevel: 'single',
        autoReject: false,
        retentionYears: 5,
        autoArchive: true,
        expiryAction: 'Archive'
    });
    const [studentRules, setStudentRules] = useState([]);
    const [staffRules, setStaffRules] = useState([]);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        const loadPolicy = async () => {
            setLoading(true);
            const branchId = user?.branchId || 'main'; // This might need adjustment if 'main' is not valid
            const data = await fetchDocumentRule(branchId);
            if (data) {
                setPolicyId(data._id);
                setIsLocked(data.isLocked || false);
                setCategories(data.categories || []);
                setWorkflow(data.workflow || {
                    verificationLevel: 'single',
                    autoReject: false,
                    retentionYears: 5,
                    autoArchive: true,
                    expiryAction: 'Archive'
                });
                setStudentRules(data.studentRules || []);
                setStaffRules(data.staffRules || []);
            }
            setLoading(false);
            setIsDirty(false);
        };
        loadPolicy();
    }, [user, fetchDocumentRule]);

    const handleLock = async () => {
        if (!policyId) {
            alert("Please save the policy first before locking.");
            return;
        }
        if (window.confirm("Activate and Lock Document Rules? This will mandate uploads for all new entries.")) {
            const updated = await toggleDocumentLock(policyId, { isLocked: true });
            if (updated) setIsLocked(true);
        }
    };

    const handleUnlock = async () => {
        const reason = prompt("Enter Audit Reason for Unlocking Document Config:");
        if (reason) {
            const updated = await toggleDocumentLock(policyId, { isLocked: false, unlockReason: reason });
            if (updated) setIsLocked(false);
        }
    };

    const handleSave = async () => {
        const branchId = user?.branchId || 'main';
        const payload = {
            branchId,
            categories,
            workflow,
            studentRules,
            staffRules
        };
        const saved = await saveDocumentRule(payload);
        if (saved) {
            setPolicyId(saved._id);
            setIsDirty(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500 mb-2" size={32} />
                <p className="text-gray-500 text-sm font-medium italic">Loading document policies...</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Document & Compliance Rules</h1>
                    <p className="text-gray-500 text-sm">Configure mandatory documents, verification workflows, and retention policies.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Scope:</span>
                        <select
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="font-bold text-gray-800 outline-none bg-transparent"
                        >
                            <option>Global Policy</option>
                            <option>Branch Specific</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Lock Banner */}
            <div className="mb-6 rounded-lg overflow-hidden">
                <PolicyLockBanner isLocked={isLocked} onLock={handleLock} onUnlock={handleUnlock} />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">

                {/* 1. Categories */}
                <div className="lg:col-span-1">
                    <DocumentCategoryPanel
                        isLocked={isLocked}
                        categories={categories}
                        setCategories={(newCats) => {
                            setCategories(newCats);
                            setIsDirty(true);
                        }}
                    />
                </div>

                {/* 2. Verification & Retention */}
                <div className="lg:col-span-1">
                    <VerificationWorkflowPanel
                        isLocked={isLocked}
                        workflow={workflow}
                        setWorkflow={(newWf) => {
                            setWorkflow(newWf);
                            setIsDirty(true);
                        }}
                    />
                </div>

                {/* 3. Placeholder or Stats */}
                <div className="lg:col-span-1 bg-indigo-900 rounded-xl p-6 text-white flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg mb-2">Compliance Status</h3>
                        <p className="text-indigo-200 text-xs">System-wide adherence to document policies.</p>
                    </div>
                    <div className="mt-6 flex gap-4">
                        <div>
                            <span className="block text-2xl font-bold">98%</span>
                            <span className="text-[10px] text-indigo-300 uppercase">Student Compliance</span>
                        </div>
                        <div className="w-px bg-indigo-700"></div>
                        <div>
                            <span className="block text-2xl font-bold">85%</span>
                            <span className="text-[10px] text-indigo-300 uppercase">Staff Verification</span>
                        </div>
                    </div>
                </div>

                {/* 4. Student Rules (Full Width) */}
                <div className="lg:col-span-3">
                    <StudentDocumentRulesPanel
                        isLocked={isLocked}
                        rules={studentRules}
                        setRules={(newRules) => {
                            setStudentRules(newRules);
                            setIsDirty(true);
                        }}
                    />
                </div>

                {/* 5. Staff Rules (Full Width) */}
                <div className="lg:col-span-3">
                    <StaffDocumentRulesPanel
                        isLocked={isLocked}
                        rules={staffRules}
                        setRules={(newRules) => {
                            setStaffRules(newRules);
                            setIsDirty(true);
                        }}
                    />
                </div>

            </div>

            {/* Footer Actions */}
            {!isLocked && isDirty && (
                <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white border-t border-gray-200 p-4 flex justify-between items-center z-10">
                    <div className="flex items-center gap-2 text-amber-600 text-sm">
                        <AlertTriangle size={16} />
                        <span>Unsaved changes in draft.</span>
                    </div>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg font-medium"
                    >
                        <Save size={18} /> Save Policy
                    </button>
                </div>
            )}

        </div>
    );
};

export default DocumentRules;
