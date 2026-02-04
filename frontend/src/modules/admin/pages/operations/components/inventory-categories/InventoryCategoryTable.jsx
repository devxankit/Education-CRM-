
import React from 'react';
import { MoreVertical, Layers, Hash, DollarSign } from 'lucide-react';
import CategoryStatusBadge from './CategoryStatusBadge';

const InventoryCategoryTable = ({ categories, onEdit, onDelete }) => {

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Category Name</th>
                            <th className="px-6 py-4 font-semibold">Code</th>
                            <th className="px-6 py-4 font-semibold">Type</th>
                            <th className="px-6 py-4 font-semibold">Tracking</th>
                            <th className="px-6 py-4 font-semibold">Financials</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((cat) => (
                            <tr key={cat._id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-xs">
                                            {cat.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{cat.name}</p>
                                            <p className="text-xs text-gray-500">{cat.assetCount || 0} items</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-gray-600 text-xs">
                                    {cat.code}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${cat.type === 'Asset' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'}`}>
                                        <Layers size={12} /> {cat.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-gray-800 font-medium">{cat.trackingType}</span>
                                        {cat.serialRequired && (
                                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                                <Hash size={10} /> Serial Req.
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {cat.depreciation ? (
                                        <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                                            <DollarSign size={12} /> {cat.depMethod}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">N/A</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <CategoryStatusBadge status={cat.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(cat)}
                                            className="text-gray-400 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                            title="Edit Category"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(cat._id)}
                                            className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                                            title="Delete Category"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {categories.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">
                    No categories found. Click "Add Category" to start.
                </div>
            )}
        </div>
    );
};

export default InventoryCategoryTable;
