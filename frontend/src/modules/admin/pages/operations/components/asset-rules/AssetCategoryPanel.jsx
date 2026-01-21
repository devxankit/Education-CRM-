
import React, { useState } from 'react';
import { Package, Hash, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const AssetCategoryPanel = ({ isLocked }) => {

    // Mock Categories
    const [categories, setCategories] = useState([
        { id: 1, name: 'IT Assets', trackSerial: true, depreciation: true, type: 'non-consumable', active: true },
        { id: 2, name: 'Furniture', trackSerial: true, depreciation: true, type: 'non-consumable', active: true },
        { id: 3, name: 'Lab Equipment', trackSerial: true, depreciation: true, type: 'non-consumable', active: true },
        { id: 4, name: 'Vehicles', trackSerial: true, depreciation: true, type: 'non-consumable', active: true },
        { id: 5, name: 'Stationery', trackSerial: false, depreciation: false, type: 'consumable', active: true },
        { id: 6, name: 'Library Books', trackSerial: true, depreciation: false, type: 'non-consumable', active: false },
    ]);

    const toggleStatus = (id) => {
        if (isLocked) return;
        setCategories(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <Package className="text-blue-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Asset Classifications</h3>
                    <p className="text-xs text-gray-500">Define & activate resource types.</p>
                </div>
            </div>

            <div className="p-4 space-y-3">
                {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <span className={`p-2 rounded-lg ${cat.active ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                <Package size={16} />
                            </span>
                            <div>
                                <p className={`text-sm font-bold ${cat.active ? 'text-gray-800' : 'text-gray-400'}`}>{cat.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 border px-1 rounded bg-white">
                                        {cat.type}
                                    </span>
                                    {cat.trackSerial && (
                                        <span className="text-[10px] flex items-center gap-0.5 text-orange-600" title="Serial Number Tracking">
                                            <Hash size={10} /> Tracked
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleStatus(cat.id)}
                            disabled={isLocked}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-colors ${cat.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            {cat.active ? (
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
                <div className="p-3 mx-4 mb-4 bg-orange-50 text-orange-800 text-[10px] rounded border border-orange-100 flex items-start gap-2">
                    <AlertTriangle size={12} className="mt-0.5" />
                    <span>Deactivating a category will hide all associated assets from allocation panels.</span>
                </div>
            )}
        </div>
    );
};

export default AssetCategoryPanel;
