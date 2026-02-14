import React, { useState, useEffect } from 'react';
import { Plus, SlidersHorizontal, AlertCircle, Loader2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

import ExpenseCategoryTable from './components/expense-categories/ExpenseCategoryTable';
import CategoryFormModal from './components/expense-categories/CategoryFormModal';

const isValidBranchId = (id) => id && /^[0-9a-fA-F]{24}$/.test(id);

const ExpenseCategories = () => {
    const { user } = useAppStore();
    const {
        expenseCategories,
        fetchExpenseCategories,
        addExpenseCategory,
        updateExpenseCategory,
        deleteExpenseCategory,
        branches,
        fetchBranches
    } = useAdminStore();

    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBranchId, setSelectedBranchId] = useState('');

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        if (branches.length > 0 && !selectedBranchId) {
            const userBranch = user?.branchId;
            const fallback = isValidBranchId(userBranch) ? userBranch : branches[0]?._id;
            setSelectedBranchId(fallback || '');
        }
    }, [branches, user?.branchId, selectedBranchId]);

    useEffect(() => {
        if (!isValidBranchId(selectedBranchId)) return;
        const loadCategories = async () => {
            setLoading(true);
            await fetchExpenseCategories(selectedBranchId);
            setLoading(false);
        };
        loadCategories();
    }, [selectedBranchId, fetchExpenseCategories]);

    // Handlers
    const handleSelect = (category) => {
        setSelectedCategory(category);
        setIsDrawerOpen(true);
    };

    const handleCreate = () => {
        if (!isValidBranchId(selectedBranchId)) {
            toast.error('Please select a valid branch first');
            return;
        }
        setSelectedCategory(null);
        setIsDrawerOpen(true);
    };

    const handlePaid = async (category, e) => {
        e?.stopPropagation?.();
        const id = category._id || category.id;
        if (category.markedPaidAt) return;
        await updateExpenseCategory(id, { markedPaidAt: new Date().toISOString() });
        toast.success(`${category?.name || 'Category'} marked as paid`);
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setIsDrawerOpen(true);
    };

    const handleDelete = async (category) => {
        const name = category?.name || 'this category';
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
        const id = category._id || category.id;
        await deleteExpenseCategory(id);
        if (selectedCategory?._id === id || selectedCategory?.id === id) {
            setIsDrawerOpen(false);
            setSelectedCategory(null);
        }
    };

    const handleSave = async (data) => {
        const branchId = data.branchId || selectedBranchId || user?.branchId;
        if (!isValidBranchId(branchId)) {
            toast.error('Valid branch is required');
            return;
        }
        if (selectedCategory && (selectedCategory._id || selectedCategory.id)) {
            await updateExpenseCategory(selectedCategory._id || selectedCategory.id, data);
        } else {
            await addExpenseCategory({ ...data, branchId });
        }
        setIsDrawerOpen(false);
        setSelectedCategory(null);
    };

    if (loading && branches.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500 mb-2" size={32} />
                <p className="text-gray-500 text-sm font-medium italic">Loading...</p>
            </div>
        );
    }

    if (branches.length === 0 && !loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <AlertCircle size={48} className="text-amber-400 mb-4" />
                <p className="font-bold text-gray-900">No branches found</p>
                <p className="text-sm text-gray-500 mt-1">Create branches in Institution → Branches first.</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col relative pb-10 font-['Inter']">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 transition-all duration-300">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins'] tracking-tight">Expense Categories</h1>
                    <p className="text-gray-500 text-sm">Classify and control institutional expenditures.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <select
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        >
                            <option value="">Select Branch</option>
                            {branches.map((b) => (
                                <option key={b._id} value={b._id}>{b.name || b.code || b._id}</option>
                            ))}
                        </select>
                    </div>
                    <button className="p-2.5 text-gray-500 hover:bg-white border border-gray-200 rounded-lg bg-gray-50 shadow-sm transition-all hover:shadow-md active:scale-95">
                        <SlidersHorizontal size={18} />
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={!isValidBranchId(selectedBranchId)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:shadow-lg transition-all font-bold text-sm shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={18} /> Add Category
                    </button>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex flex-1 gap-6 h-[600px] overflow-hidden relative rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="w-full h-full">
                    <ExpenseCategoryTable
                        categories={expenseCategories}
                        onSelect={handleSelect}
                        onPaid={handlePaid}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        selectedId={selectedCategory?._id || selectedCategory?.id}
                    />
                </div>
            </div>

            {/* Form Modal */}
            <CategoryFormModal
                isOpen={isDrawerOpen}
                category={selectedCategory}
                onSave={handleSave}
                onClose={() => { setIsDrawerOpen(false); setSelectedCategory(null); }}
                branches={branches}
                selectedBranchId={selectedBranchId}
            />

            {/* Info Banner if List Empty */}
            {expenseCategories.length === 0 && !loading && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-400 p-8 rounded-2xl bg-gray-50/50 border border-dashed border-gray-200 w-full max-w-md animate-pulse">
                    <AlertCircle size={48} className="mx-auto mb-4 opacity-50 text-indigo-300" />
                    <p className="font-medium text-sm">No expense categories defined.</p>
                    <p className="text-xs mt-1">Create your first category to start tracking institutional spending.</p>
                </div>
            )}

        </div>
    );
};

export default ExpenseCategories;
