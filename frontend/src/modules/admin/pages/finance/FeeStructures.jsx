import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Settings, Printer, Lock, Download, Loader2, Copy, Trash2, Archive, TrendingUp, FileText, Calendar, Percent } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

import FeeStructureList from './components/fee-structures/FeeStructureList';
import FeeStructureForm from './components/fee-structures/FeeStructureForm';
import FeeComponentsEditor from './components/fee-structures/FeeComponentsEditor';
import InstallmentScheduler from './components/fee-structures/InstallmentScheduler';
import FeeStructureStatusBadge from './components/fee-structures/FeeStructureStatusBadge';

const FeeStructures = () => {
    const {
        feeStructures, fetchFeeStructures, addFeeStructure, updateFeeStructure, deleteFeeStructure,
        academicYears, fetchAcademicYears, branches, fetchBranches,
        taxes, fetchTaxes
    } = useAdminStore();
    const user = useAppStore(state => state.user);

    const [selectedId, setSelectedId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ year: '', status: '', branchId: '', search: '' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [structureToDelete, setStructureToDelete] = useState(null);

    // Fetch academic years and branches on mount
    useEffect(() => {
        const loadInitial = async () => {
            setLoading(true);
            await fetchAcademicYears();
            await fetchBranches();
            setLoading(false);
        };
        loadInitial();
    }, [fetchAcademicYears, fetchBranches]);

    // Fetch fee structures when branches are loaded
    useEffect(() => {
        if (branches.length === 0) return; // Wait for branches to load
        
        const loadFeeStructures = async () => {
            // Determine effective branchId - use user's branch or first available branch
            let effectiveBranchId = user?.branchId || '';
            
            // Validate branchId format
            if (effectiveBranchId && !/^[0-9a-fA-F]{24}$/.test(effectiveBranchId)) {
                effectiveBranchId = '';
            }
            
            // If user branchId is invalid or missing, use first branch
            if (!effectiveBranchId) {
                const firstBranch = branches.find(b => b._id);
                if (firstBranch) {
                    effectiveBranchId = firstBranch._id;
                }
            }
            
            // Set filter branchId if not already set
            if (effectiveBranchId && !filter.branchId) {
                setFilter(prev => ({ ...prev, branchId: effectiveBranchId }));
            }
            
            // Only fetch if we have a valid branchId
            if (effectiveBranchId && /^[0-9a-fA-F]{24}$/.test(effectiveBranchId)) {
                setLoading(true);
                await fetchFeeStructures(effectiveBranchId);
                setLoading(false);
            }
        };
        
        loadFeeStructures();
    }, [branches, user?.branchId, fetchFeeStructures]);

    // Derived
    const selectedStructure = feeStructures.find(s => (s._id || s.id) === selectedId);

    useEffect(() => {
        const branchId = selectedStructure?.branchId?._id || selectedStructure?.branchId || filter.branchId;
        if (branchId && branchId.length === 24) fetchTaxes(branchId);
    }, [selectedStructure?.branchId, filter.branchId, fetchTaxes]);

    const applicableTaxes = useMemo(() =>
        (taxes || []).filter(t => t.isActive !== false && (t.applicableOn === 'fee' || t.applicableOn === 'admission')),
        [taxes]
    );

    const selectedTaxCalc = useMemo(() => {
        const base = selectedStructure?.totalAmount || 0;
        if (base <= 0) return { taxAmount: 0, details: [], totalWithTax: base };
        let taxAmount = 0;
        const details = [];
        applicableTaxes.forEach(t => {
            const amt = t.type === 'percentage' ? (base * (Number(t.rate) || 0)) / 100 : Number(t.rate) || 0;
            taxAmount += amt;
            details.push({ name: t.name, rate: t.rate, type: t.type, amount: amt });
        });
        return { taxAmount, details, totalWithTax: base + taxAmount };
    }, [selectedStructure?.totalAmount, applicableTaxes]);

    const filteredStructures = feeStructures.filter(s => {
        if (filter.year && (s.academicYearId?._id || s.academicYearId) !== filter.year) return false;
        if (filter.status && s.status !== filter.status) return false;
        if (filter.search) {
            const searchLower = filter.search.toLowerCase();
            const nameMatch = s.name?.toLowerCase().includes(searchLower);
            const yearMatch = s.academicYearId?.name?.toLowerCase().includes(searchLower);
            if (!nameMatch && !yearMatch) return false;
        }
        return true;
    });

    // Statistics
    const stats = {
        total: feeStructures.length,
        active: feeStructures.filter(s => s.status === 'active').length,
        draft: feeStructures.filter(s => s.status === 'draft').length,
        totalAmount: feeStructures.reduce((sum, s) => sum + (s.totalAmount || 0), 0)
    };

    // Handlers
    const handleCreate = async (data) => {
        // Ensure branchId is valid - use from data if provided, otherwise from user, otherwise first branch
        let effectiveBranchId = data.branchId || user?.branchId;
        if (!effectiveBranchId && branches.length > 0) {
            effectiveBranchId = branches[0]._id;
        }
        
        if (!effectiveBranchId) {
            alert('Please select a branch first');
            return;
        }

        const result = await addFeeStructure({
            ...data,
            branchId: effectiveBranchId,
            status: 'active' // Directly publish/activate new structures
        });
        if (result) {
            setIsCreating(false);
            setSelectedId(result._id);
            // Refresh the list to ensure new structure appears
            if (effectiveBranchId && /^[0-9a-fA-F]{24}$/.test(effectiveBranchId)) {
                await fetchFeeStructures(effectiveBranchId);
            }
        }
    };

    const handleFilterChange = (key, value) => {
        setFilter(prev => ({ ...prev, [key]: value }));
        if (key === 'branchId') {
            const branchIdToUse = value || user?.branchId || (branches.length > 0 ? branches[0]._id : '');
            if (branchIdToUse && /^[0-9a-fA-F]{24}$/.test(branchIdToUse)) {
                setLoading(true);
                fetchFeeStructures(branchIdToUse).finally(() => setLoading(false));
            }
        }
    };

    const handleLock = async () => {
        if (!selectedStructure) return;
        if (window.confirm("Locking this fee structure makes it Active and Immutable. Continue?")) {
            const result = await updateFeeStructure(selectedStructure._id || selectedStructure.id, { status: 'active' });
            if (result) {
                setSelectedId(result._id || result.id);
            }
        }
    };

    const handleDuplicate = async () => {
        if (!selectedStructure) return;
        const duplicateData = {
            ...selectedStructure,
            name: `${selectedStructure.name} (Copy)`,
            status: 'draft',
            branchId: selectedStructure.branchId?._id || selectedStructure.branchId,
            academicYearId: selectedStructure.academicYearId?._id || selectedStructure.academicYearId,
            applicableClasses: selectedStructure.applicableClasses?.map(c => c._id || c) || [],
            applicableCourses: selectedStructure.applicableCourses?.map(c => c._id || c) || []
        };
        delete duplicateData._id;
        delete duplicateData.id;
        delete duplicateData.createdAt;
        delete duplicateData.updatedAt;
        
        const result = await addFeeStructure(duplicateData);
        if (result) {
            setSelectedId(result._id);
            setIsCreating(false);
        }
    };

    const handleDelete = async () => {
        if (!structureToDelete) return;
        const result = await deleteFeeStructure(structureToDelete._id || structureToDelete.id);
        if (result) {
            setShowDeleteModal(false);
            setStructureToDelete(null);
            if (selectedId === (structureToDelete._id || structureToDelete.id)) {
                setSelectedId(null);
            }
        }
    };

    const handleArchive = async () => {
        if (!selectedStructure) return;
        if (window.confirm("Archive this fee structure? It will be hidden from active lists.")) {
            await updateFeeStructure(selectedStructure._id || selectedStructure.id, { status: 'archived' });
        }
    };

    const handleUpdate = async (data) => {
        if (!selectedStructure) return;
        const result = await updateFeeStructure(selectedStructure._id || selectedStructure.id, data);
        if (result) {
            setSelectedId(result._id || result.id);
            // Refresh the list to ensure updated structure appears
            const branchId = data.branchId || selectedStructure.branchId?._id || selectedStructure.branchId || filter.branchId || user?.branchId;
            if (branchId && /^[0-9a-fA-F]{24}$/.test(branchId)) {
                await fetchFeeStructures(branchId);
            }
        }
    };

    // Render Detail View
    const renderDetail = () => {
        if (isCreating) {
            return (
                <FeeStructureForm
                    key="create-form" // Force re-render for create mode
                    onSave={handleCreate}
                    onCancel={() => setIsCreating(false)}
                    existingStructures={feeStructures}
                />
            );
        }

        // Allow editing draft and active structures
        if (selectedStructure && (selectedStructure.status === 'draft' || selectedStructure.status === 'active')) {
            return (
                <FeeStructureForm
                    key={selectedStructure._id || selectedStructure.id} // Force re-render when structure changes
                    initialData={selectedStructure}
                    onSave={handleUpdate}
                    onCancel={() => setSelectedId(null)}
                    existingStructures={feeStructures}
                />
            );
        }

        if (!selectedStructure) {
            return (
                <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border border-dashed border-gray-300 rounded-xl text-gray-400">
                    <div className="bg-white p-6 rounded-full mb-4 shadow-sm">
                        <Settings size={48} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-medium mb-1">No Structure Selected</p>
                    <p className="text-xs text-gray-400">Select a fee structure from the list or create a new one</p>
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
                            <>
                                <button
                                    onClick={handleLock}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase transition-all hover:bg-indigo-700 shadow-sm"
                                >
                                    <Lock size={12} /> Activate
                                </button>
                                <button
                                    onClick={handleDuplicate}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold uppercase transition-all hover:bg-gray-200"
                                    title="Duplicate Structure"
                                >
                                    <Copy size={12} />
                                </button>
                            </>
                        )}
                        {selectedStructure.status === 'active' && (
                            <button
                                onClick={handleArchive}
                                className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold uppercase transition-all hover:bg-amber-200"
                            >
                                <Archive size={12} /> Archive
                            </button>
                        )}
                        <button 
                            onClick={() => {
                                setStructureToDelete(selectedStructure);
                                setShowDeleteModal(true);
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-all"
                            title="Delete Structure"
                        >
                            <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-transparent hover:border-gray-200 transition-all" title="Print">
                            <Printer size={16} />
                        </button>
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-transparent hover:border-gray-200 transition-all" title="Export">
                            <Download size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl border border-indigo-200 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-indigo-600 uppercase font-bold tracking-wider">Total Fee</span>
                                <TrendingUp size={16} className="text-indigo-400" />
                            </div>
                            <span className="block text-2xl font-bold text-indigo-900">₹{(selectedStructure.totalAmount || 0).toLocaleString()}</span>
                            {selectedTaxCalc.details.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-indigo-200 space-y-0.5 text-xs">
                                    {selectedTaxCalc.details.map((d, i) => (
                                        <div key={i} className="flex justify-between text-indigo-700">
                                            <span>{d.name} {d.type === 'percentage' ? `(${d.rate}%)` : ''}</span>
                                            <span>+ ₹{d.amount.toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between font-bold text-indigo-900 pt-1">
                                        <span className="flex items-center gap-1"><Percent size={10} /> Incl. tax</span>
                                        <span>₹{selectedTaxCalc.totalWithTax.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Components</span>
                                <FileText size={16} className="text-gray-400" />
                            </div>
                            <span className="block text-2xl font-bold text-gray-700">{selectedStructure.components?.length || 0}</span>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Installments</span>
                                <Calendar size={16} className="text-gray-400" />
                            </div>
                            <span className="block text-2xl font-bold text-gray-700">{selectedStructure.installments?.length || 0}</span>
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
                        onClick={() => { setIsCreating(true); setSelectedId(null); }}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium text-sm shadow-md hover:shadow-lg active:scale-95"
                    >
                        <Plus size={18} /> New Fee Structure
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Total Structures</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm">
                    <div className="text-xs text-green-600 uppercase font-bold mb-1">Active</div>
                    <div className="text-2xl font-bold text-green-700">{stats.active}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-xs text-gray-600 uppercase font-bold mb-1">Draft</div>
                    <div className="text-2xl font-bold text-gray-700">{stats.draft}</div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 shadow-sm">
                    <div className="text-xs text-indigo-600 uppercase font-bold mb-1">Total Value</div>
                    <div className="text-2xl font-bold text-indigo-700">₹{(stats.totalAmount / 100000).toFixed(1)}L</div>
                </div>
            </div>

            {/* Split View */}
            <div className="flex flex-col lg:flex-row gap-6 h-[600px] animate-in fade-in duration-300">

                {/* Left Panel */}
                <div className="w-full lg:w-1/3 min-w-[320px]">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
                            <Loader2 className="animate-spin text-indigo-500 mb-2" size={24} />
                            <span className="text-sm text-gray-400">Loading fee structures...</span>
                        </div>
                    ) : (
                        <FeeStructureList
                            structures={filteredStructures}
                            selectedId={selectedId}
                            onSelect={(item) => { setIsCreating(false); setSelectedId(item._id || item.id); }}
                            onFilterChange={handleFilterChange}
                            academicYears={academicYears}
                            branches={branches}
                            searchValue={filter.search}
                            selectedBranchId={filter.branchId}
                            applicableTaxes={applicableTaxes}
                        />
                    )}
                </div>

                {/* Right Panel */}
                <div className="flex-1">
                    {renderDetail()}
                </div>

            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && structureToDelete && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Delete Fee Structure</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{structureToDelete.name}</strong>? 
                            {structureToDelete.status === 'active' && ' Active structures cannot be deleted. Please archive it instead.'}
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => { setShowDeleteModal(false); setStructureToDelete(null); }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={structureToDelete.status === 'active'}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeStructures;
