
import React, { useState } from 'react';
import { Package, Hash, AlertTriangle, CheckCircle2, XCircle, Plus, X } from 'lucide-react';
import { useAdminStore } from '../../../../../../store/adminStore';

const AssetCategoryPanel = ({ isLocked, branchId }) => {
    const { assetCategories, addAssetCategory, updateAssetCategory } = useAdminStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newCat, setNewCat] = useState({
        name: '',
        code: '',
        type: 'Asset',
        trackingType: 'Item-based',
        serialRequired: false,
        depreciation: false
    });

    const toggleStatus = async (id, currentStatus) => {
        if (isLocked) return;
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        await updateAssetCategory(id, { status: newStatus });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const payload = {
            ...newCat,
            branchId
        };
        const result = await addAssetCategory(payload);
        if (result) {
            setIsAdding(false);
            setNewCat({
                name: '',
                code: '',
                type: 'Asset',
                trackingType: 'Item-based',
                serialRequired: false,
                depreciation: false
            });
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full flex flex-col">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Package className="text-blue-600" size={20} />
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Asset Classifications</h3>
                        <p className="text-xs text-gray-500">Define & activate resource types.</p>
                    </div>
                </div>
                {!isLocked && (
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        {isAdding ? <X size={16} /> : <Plus size={16} />}
                    </button>
                )}
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3">
                {isAdding && (
                    <form onSubmit={handleAdd} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3 mb-4">
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                placeholder="Name"
                                value={newCat.name}
                                onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                                required
                                className="px-2 py-1.5 text-xs border rounded-md outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <input
                                placeholder="Code"
                                value={newCat.code}
                                onChange={(e) => setNewCat({ ...newCat, code: e.target.value.toUpperCase() })}
                                required
                                className="px-2 py-1.5 text-xs border rounded-md outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={newCat.type}
                                onChange={(e) => setNewCat({ ...newCat, type: e.target.value })}
                                className="flex-1 px-2 py-1.5 text-xs border rounded-md outline-none"
                            >
                                <option value="Asset">Asset</option>
                                <option value="Consumable">Consumable</option>
                            </select>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newCat.serialRequired}
                                    onChange={(e) => setNewCat({ ...newCat, serialRequired: e.target.checked })}
                                    className="w-3 h-3 text-blue-600 rounded"
                                />
                                <span className="text-[10px] font-medium text-gray-600">Track Serial</span>
                            </label>
                        </div>
                        <button type="submit" className="w-full py-1.5 bg-blue-600 text-white text-xs font-bold rounded-md hover:bg-blue-700">
                            Save Category
                        </button>
                    </form>
                )}

                {assetCategories.length === 0 && !isAdding && (
                    <div className="text-center py-6 text-gray-400 italic text-sm">
                        No categories defined.
                    </div>
                )}

                {assetCategories.map((cat) => (
                    <div key={cat._id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <span className={`p-2 rounded-lg ${cat.status === 'Active' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                <Package size={16} />
                            </span>
                            <div>
                                <p className={`text-sm font-bold ${cat.status === 'Active' ? 'text-gray-800' : 'text-gray-400'}`}>{cat.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 border px-1 rounded bg-white">
                                        {cat.type}
                                    </span>
                                    {cat.serialRequired && (
                                        <span className="text-[10px] flex items-center gap-0.5 text-orange-600" title="Serial Number Tracking">
                                            <Hash size={10} /> Tracked
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleStatus(cat._id, cat.status)}
                            disabled={isLocked}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-colors ${cat.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            {cat.status === 'Active' ? (
                                <>
                                    <CheckCircle2 size={12} /> Active
                                </>
                            ) : (
                                <>
                                    <XCircle size={12} /> Inactive
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {!isLocked && (
                <div className="p-3 mx-4 mb-4 bg-orange-50 text-orange-800 text-[10px] rounded border border-orange-100 flex items-start gap-2 mt-auto">
                    <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                    <span>Deactivating a category will hide all associated assets from allocation panels.</span>
                </div>
            )}
        </div>
    );
};

export default AssetCategoryPanel;
