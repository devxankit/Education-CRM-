
import React from 'react';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import CategoryStatusBadge from './CategoryStatusBadge';

const ExpenseCategoryTable = ({ categories, onSelect, selectedId }) => {

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="overflow-y-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-6 py-3 font-medium border-b border-gray-100">Category Name</th>
                            <th className="px-6 py-3 font-medium border-b border-gray-100">Type</th>
                            <th className="px-6 py-3 font-medium border-b border-gray-100">Budget</th>
                            <th className="px-6 py-3 font-medium border-b border-gray-100 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {categories.map((cat) => (
                            <tr
                                key={cat.id}
                                onClick={() => onSelect(cat)}
                                className={`
                                    cursor-pointer transition-colors group
                                    ${selectedId === cat.id ? 'bg-indigo-50/50' : 'hover:bg-gray-50'}
                                `}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded flex items-center justify-center text-indigo-600 bg-indigo-50 font-bold text-xs`}>
                                            {cat.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                                                {cat.name}
                                                {selectedId === cat.id && <ChevronRight size={14} />}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                                                {cat.code}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs border ${cat.type === 'fixed' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                                        {cat.type === 'fixed' ? 'Fixed Cost' : 'Variable'}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    {cat.budgetLimit ? (
                                        <span className="font-mono font-medium text-gray-700">${cat.budgetLimit.toLocaleString()}</span>
                                    ) : (
                                        <span className="text-gray-400 text-xs italic">No Limit</span>
                                    )}
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <CategoryStatusBadge isActive={cat.isActive} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {categories.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-gray-400 text-sm h-64">
                    <ArrowUpRight size={24} className="mb-2 opacity-50" />
                    <p>No expense categories found.</p>
                </div>
            )}
        </div>
    );
};

export default ExpenseCategoryTable;
