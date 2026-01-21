
import React, { useState } from 'react';
import { Plus, Download, Filter } from 'lucide-react';

// Components
import InventoryCategoryTable from './components/inventory-categories/InventoryCategoryTable';
import CategoryDetailDrawer from './components/inventory-categories/CategoryDetailDrawer';

const InventoryCategories = () => {

    // Mock Data
    const [categories, setCategories] = useState([
        { id: 1, name: 'IT Assets', code: 'CAT-1001', type: 'Asset', trackingType: 'Item-based', serialRequired: true, depreciation: true, depMethod: 'Straight Line', status: 'Active', assetCount: 145 },
        { id: 2, name: 'Furniture', code: 'CAT-2002', type: 'Asset', trackingType: 'Quantity-based', serialRequired: false, depreciation: true, depMethod: 'Written Down Value', status: 'Active', assetCount: 500 },
        { id: 3, name: 'Office Stationery', code: 'CAT-3005', type: 'Consumable', trackingType: 'Quantity-based', serialRequired: false, depreciation: false, status: 'Active', assetCount: 2000 },
        { id: 4, name: 'Lab Chemicals', code: 'CAT-4010', type: 'Consumable', trackingType: 'Quantity-based', serialRequired: false, depreciation: false, status: 'Inactive', assetCount: 50 },
    ]);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Handlers
    const handleAdd = () => {
        setEditingCategory(null);
        setIsDrawerOpen(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setIsDrawerOpen(true);
    };

    const handleSave = (categoryData) => {
        if (editingCategory) {
            // Update
            setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...categoryData, id: c.id, assetCount: c.assetCount } : c));
        } else {
            // Create
            const newId = Date.now();
            setCategories(prev => [...prev, { ...categoryData, id: newId, assetCount: 0 }]);
        }
        setIsDrawerOpen(false);
    };

    return (
        <div className="h-full flex flex-col pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Inventory Categories</h1>
                    <p className="text-gray-500 text-sm">Define asset classifications, tracking rules, and depreciation policies.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:text-indigo-600 shadow-sm">
                        <Download size={18} />
                    </button>
                    <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:text-indigo-600 shadow-sm">
                        <Filter size={18} />
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg font-medium transition-all"
                    >
                        <Plus size={18} /> Add Category
                    </button>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Total Categories</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{categories.length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Fixed Assets</p>
                    <h3 className="text-2xl font-bold text-indigo-600 mt-1">{categories.filter(c => c.type === 'Asset').length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Consumables</p>
                    <h3 className="text-2xl font-bold text-amber-600 mt-1">{categories.filter(c => c.type === 'Consumable').length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Inactive</p>
                    <h3 className="text-2xl font-bold text-gray-400 mt-1">{categories.filter(c => c.status === 'Inactive').length}</h3>
                </div>
            </div>

            {/* Table */}
            <InventoryCategoryTable
                categories={categories}
                onEdit={handleEdit}
            />

            {/* Drawer */}
            <CategoryDetailDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                category={editingCategory}
                isNew={!editingCategory}
                onSave={handleSave}
            />

        </div>
    );
};

export default InventoryCategories;
