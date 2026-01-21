
import React, { useState } from 'react';
import { Plus, SlidersHorizontal, AlertCircle } from 'lucide-react';

import ExpenseCategoryTable from './components/expense-categories/ExpenseCategoryTable';
import CategoryDetailDrawer from './components/expense-categories/CategoryDetailDrawer';

const ExpenseCategories = () => {

    // Mock Data
    const [categories, setCategories] = useState([
        { id: 1, name: 'Office Rent', code: 'EXP-1001', type: 'fixed', budgetLimit: 50000, approvalRequired: true, isActive: true },
        { id: 2, name: 'Staff Salaries', code: 'EXP-1002', type: 'fixed', budgetLimit: 1200000, approvalRequired: true, isActive: true },
        { id: 3, name: 'Stationery', code: 'EXP-2005', type: 'variable', budgetLimit: 2000, approvalRequired: false, isActive: true },
        { id: 4, name: 'IT Infrastructure', code: 'EXP-3012', type: 'variable', budgetLimit: 10000, approvalRequired: true, isActive: false }, // Inactive example
    ]);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Handlers
    const handleSelect = (category) => {
        setSelectedCategory(category);
        setIsDrawerOpen(true);
    };

    const handleCreate = () => {
        setSelectedCategory(null);
        setIsDrawerOpen(true);
    };

    const handleSave = (data) => {
        if (selectedCategory) {
            // Edit
            setCategories(prev => prev.map(c => c.id === selectedCategory.id ? { ...data, id: c.id } : c));
        } else {
            // Create
            setCategories(prev => [...prev, { ...data, id: Date.now() }]);
        }
        setIsDrawerOpen(false);
    };

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Expense Categories</h1>
                    <p className="text-gray-500 text-sm">Classify and control institutional expenditures.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 text-gray-500 hover:bg-white border border-gray-200 rounded-lg bg-gray-50">
                        <SlidersHorizontal size={18} />
                    </button>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                    >
                        <Plus size={18} /> Add Category
                    </button>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex flex-1 gap-6 h-[600px] overflow-hidden relative">

                {/* List - Takes full width */}
                <div className="w-full h-full">
                    <ExpenseCategoryTable
                        categories={categories}
                        onSelect={handleSelect}
                        selectedId={selectedCategory?.id}
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
            {categories.length === 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-400">
                    <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No categories defined. Create one to start tracking expenses.</p>
                </div>
            )}

        </div>
    );
};

export default ExpenseCategories;
