import React from 'react';
import { X } from 'lucide-react';
import ExpenseCategoryForm from './ExpenseCategoryForm';

const CategoryFormModal = ({ isOpen, onClose, category, onSave, branches = [], selectedBranchId = '' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                className="absolute inset-0"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                    <h2 className="text-lg font-bold text-gray-900">
                        {category ? 'Edit Category' : 'Add Category'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        type="button"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <ExpenseCategoryForm
                        category={category}
                        onSave={onSave}
                        onCancel={onClose}
                        branches={branches}
                        defaultBranchId={selectedBranchId}
                    />
                </div>
            </div>
        </div>
    );
};

export default CategoryFormModal;
