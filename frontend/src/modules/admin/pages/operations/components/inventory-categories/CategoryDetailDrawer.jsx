
import React from 'react';
import { X, Layers } from 'lucide-react';
import InventoryCategoryForm from './InventoryCategoryForm';

const CategoryDetailDrawer = ({ isOpen, onClose, category, isNew, onSave }) => {

    // Slide-over logic handled by parent via isOpen class toggle or simple conditional rendering
    // For this implementation, we will use a fixed overlay

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>

            {/* Drawer */}
            <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            {isNew ? 'Create Category' : 'Edit Category'}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                            {isNew ? 'Define a new inventory classification.' : `Modifying ${category?.name}`}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-hidden">
                    <InventoryCategoryForm
                        category={category}
                        onSave={onSave}
                        onCancel={onClose}
                    />
                </div>

            </div>
        </div>
    );
};

export default CategoryDetailDrawer;
