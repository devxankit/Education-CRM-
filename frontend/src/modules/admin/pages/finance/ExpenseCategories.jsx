import React, { useState, useEffect } from 'react';
import { Plus, SlidersHorizontal, AlertCircle, Loader2 } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

import ExpenseCategoryTable from './components/expense-categories/ExpenseCategoryTable';
import CategoryDetailDrawer from './components/expense-categories/CategoryDetailDrawer';

const ExpenseCategories = () => {
    const { user } = useAppStore();
    const {
        expenseCategories,
        fetchExpenseCategories,
        addExpenseCategory,
        updateExpenseCategory
    } = useAdminStore();

    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const loadCategories = async () => {
            setLoading(true);
            const branchId = user?.branchId || 'main';
            await fetchExpenseCategories(branchId);
            setLoading(false);
        };
        loadCategories();
    }, [user, fetchExpenseCategories]);

    // Handlers
    const handleSelect = (category) => {
        setSelectedCategory(category);
        setIsDrawerOpen(true);
    };

    const handleCreate = () => {
        setSelectedCategory(null);
        setIsDrawerOpen(true);
    };

    const handleSave = async (data) => {
        const branchId = user?.branchId || 'main';
        if (selectedCategory && (selectedCategory._id || selectedCategory.id)) {
            // Edit
            await updateExpenseCategory(selectedCategory._id || selectedCategory.id, data);
        } else {
            // Create
            await addExpenseCategory({ ...data, branchId });
        }
        setIsDrawerOpen(false);
        setSelectedCategory(null);
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500 mb-2" size={32} />
                <p className="text-gray-500 text-sm font-medium italic">Loading expense categories...</p>
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

                <div className="flex items-center gap-3">
                    <button className="p-2.5 text-gray-500 hover:bg-white border border-gray-200 rounded-lg bg-gray-50 shadow-sm transition-all hover:shadow-md active:scale-95">
                        <SlidersHorizontal size={18} />
                    </button>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:shadow-lg transition-all font-bold text-sm shadow-md active:scale-95"
                    >
                        <Plus size={18} /> Add Category
                    </button>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex flex-1 gap-6 h-[600px] overflow-hidden relative rounded-xl bg-white border border-gray-100 shadow-sm">

                {/* List - Takes full width */}
                <div className="w-full h-full">
                    <ExpenseCategoryTable
                        categories={expenseCategories}
                        onSelect={handleSelect}
                        selectedId={selectedCategory?._id || selectedCategory?.id}
                    />
                </div>

                {/* Drawer Detail View */}
                <CategoryDetailDrawer
                    isOpen={isDrawerOpen}
                    category={selectedCategory}
                    onSave={handleSave}
                    onClose={() => { setIsDrawerOpen(false); setSelectedCategory(null); }}
                />
            </div>

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
