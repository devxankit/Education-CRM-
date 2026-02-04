
import React, { useState, useEffect } from 'react';
import { Plus, Download, Filter, Loader2 } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

// Components
import InventoryCategoryTable from './components/inventory-categories/InventoryCategoryTable';
import CategoryDetailDrawer from './components/inventory-categories/CategoryDetailDrawer';

const InventoryCategories = () => {
    const { assetCategories, fetchAssetCategories, addAssetCategory, updateAssetCategory, deleteAssetCategory } = useAdminStore();
    const user = useAppStore(state => state.user);
    const branchId = user?.branchId || 'main';

    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await fetchAssetCategories(branchId);
            setLoading(false);
        };
        load();
    }, [branchId, fetchAssetCategories]);

    // Handlers
    const handleAdd = () => {
        setEditingCategory(null);
        setIsDrawerOpen(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setIsDrawerOpen(true);
    };

    const handleSave = async (categoryData) => {
        if (editingCategory) {
            // Update
            await updateAssetCategory(editingCategory._id, categoryData);
        } else {
            // Create
            await addAssetCategory({ ...categoryData, branchId });
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category? This might affect existing assets.")) {
            await deleteAssetCategory(id);
        }
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
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{assetCategories.length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Fixed Assets</p>
                    <h3 className="text-2xl font-bold text-indigo-600 mt-1">{assetCategories.filter(c => c.type === 'Asset').length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Consumables</p>
                    <h3 className="text-2xl font-bold text-amber-600 mt-1">{assetCategories.filter(c => c.type === 'Consumable').length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Inactive</p>
                    <h3 className="text-2xl font-bold text-gray-400 mt-1">{assetCategories.filter(c => c.status === 'Inactive').length}</h3>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                </div>
            ) : (
                <InventoryCategoryTable
                    categories={assetCategories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

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
