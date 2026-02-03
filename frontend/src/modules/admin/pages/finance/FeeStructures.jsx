import React, { useState, useEffect } from 'react';
import { Plus, Settings, Printer, Lock, Download, Loader2 } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

import FeeStructureList from './components/fee-structures/FeeStructureList';
import FeeStructureForm from './components/fee-structures/FeeStructureForm';
import FeeComponentsEditor from './components/fee-structures/FeeComponentsEditor';
import InstallmentScheduler from './components/fee-structures/InstallmentScheduler';
import FeeStructureStatusBadge from './components/fee-structures/FeeStructureStatusBadge';

const FeeStructures = () => {
    const {
        feeStructures, fetchFeeStructures, addFeeStructure, updateFeeStructure,
        academicYears, fetchAcademicYears, branches, fetchBranches
    } = useAdminStore();
    const user = useAppStore(state => state.user);

    const [selectedId, setSelectedId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ year: '', status: '', branchId: '' });

    useEffect(() => {
        const loadInitial = async () => {
            setLoading(true);
            await fetchAcademicYears();
            await fetchBranches();

            // Determine effective branchId for initial fetch
            const effectiveBranchId = user?.branchId || '';
            await fetchFeeStructures(effectiveBranchId);
            setLoading(false);
        };
        loadInitial();
    }, [user, fetchAcademicYears, fetchFeeStructures, fetchBranches]);

    // Derived
    const selectedStructure = feeStructures.find(s => (s._id || s.id) === selectedId);

    const filteredStructures = feeStructures.filter(s => {
        if (filter.year && (s.academicYearId?._id || s.academicYearId) !== filter.year) return false;
        if (filter.status && s.status !== filter.status) return false;
        return true;
    });

    // Handlers
    const handleCreate = async (data) => {
        const result = await addFeeStructure({
            ...data,
            branchId: user?.branchId || 'main',
            status: 'draft'
        });
        if (result) {
            setIsCreating(false);
            setSelectedId(result._id);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilter(prev => ({ ...prev, [key]: value }));
        if (key === 'branchId') {
            fetchFeeStructures(value || user?.branchId || '');
        }
    };

    const handleLock = async () => {
        if (!selectedStructure) return;
        if (window.confirm("Locking this fee structure makes it Active and Immutable. Continue?")) {
            await updateFeeStructure(selectedStructure._id || selectedStructure.id, { status: 'active' });
        }
    };

    // Render Detail View
    const renderDetail = () => {
        if (isCreating) {
            return (
                <FeeStructureForm
                    onSave={handleCreate}
                    onCancel={() => setIsCreating(false)}
                />
            );
        }

        if (!selectedStructure) {
            return (
                <div className="h-full flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-xl text-gray-400">
                    <Settings size={48} className="text-gray-200 mb-4" />
                    <p>Select a fee structure or create a new one.</p>
                </div>
            );
        }

        return (
            <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-['Inter']">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-bold text-gray-900">{selectedStructure.name}</h2>
                            <FeeStructureStatusBadge status={selectedStructure.status} />
                        </div>
                        <p className="text-sm text-gray-500">
                            {selectedStructure.academicYearId?.name || 'N/A'} • {selectedStructure.applicableClasses?.length || 0} Classes • {selectedStructure.applicableCourses?.length || 0} Programs
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {selectedStructure.status === 'draft' && (
                            <button
                                onClick={handleLock}
                                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold uppercase transition-colors hover:bg-indigo-700"
                            >
                                <Lock size={12} /> Lock & Activate
                            </button>
                        )}
                        <button className="p-2 text-gray-500 hover:bg-white rounded border border-transparent hover:border-gray-200">
                            <Printer size={16} />
                        </button>
                        <button className="p-2 text-gray-500 hover:bg-white rounded border border-transparent hover:border-gray-200">
                            <Download size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">

                    {/* Summary Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-center">
                            <span className="block text-xs text-indigo-500 uppercase font-bold tracking-wider">Total Fee</span>
                            <span className="block text-2xl font-bold text-indigo-900 mt-1">₹{(selectedStructure.totalAmount || 0).toLocaleString()}</span>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                            <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider">Components</span>
                            <span className="block text-2xl font-bold text-gray-700 mt-1">{selectedStructure.components?.length || 0}</span>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                            <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider">Installments</span>
                            <span className="block text-2xl font-bold text-gray-700 mt-1">{selectedStructure.installments?.length || 0}</span>
                        </div>
                    </div>

                    {/* Components Read Only */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Fee Components</h3>
                        <FeeComponentsEditor
                            components={selectedStructure.components || []}
                            readOnly={true}
                        />
                    </div>

                    {/* Installments Read Only */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Schedule</h3>
                        <InstallmentScheduler
                            totalAmount={selectedStructure.totalAmount}
                            installments={selectedStructure.installments || []}
                            readOnly={true}
                        />
                    </div>

                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Fee Structures</h1>
                    <p className="text-gray-500 text-sm">Define and manage fee policies for academic sessions.</p>
                </div>
                <div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                    >
                        <Plus size={18} /> New Fee Structure
                    </button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex flex-col lg:flex-row gap-6 h-[600px]">

                {/* Left Panel */}
                <div className="w-full lg:w-1/3 min-w-[320px]">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
                            <Loader2 className="animate-spin text-indigo-500 mb-2" size={24} />
                            <span className="text-sm text-gray-400">Loading schedules...</span>
                        </div>
                    ) : (
                        <FeeStructureList
                            structures={filteredStructures}
                            selectedId={selectedId}
                            onSelect={(item) => { setIsCreating(false); setSelectedId(item._id || item.id); }}
                            onFilterChange={handleFilterChange}
                            academicYears={academicYears}
                            branches={branches}
                        />
                    )}
                </div>

                {/* Right Panel */}
                <div className="flex-1">
                    {renderDetail()}
                </div>

            </div>
        </div>
    );
};

export default FeeStructures;
