
import React from 'react';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import CategoryStatusBadge from './CategoryStatusBadge';

const ExpenseCategoryTable = ({ categories, onSelect, selectedId }) => {

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col font-['Inter']">
            <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/80 backdrop-blur-sm text-xs text-gray-400 uppercase sticky top-0 z-10 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-bold tracking-wider">Category Name</th>
                            <th className="px-6 py-4 font-bold tracking-wider">Type</th>
                            <th className="px-6 py-4 font-bold tracking-wider">Budget Limit</th>
                            <th className="px-6 py-4 font-bold tracking-wider text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {categories.map((cat) => {
                            const cid = cat._id || cat.id;
                            return (
                                <tr
                                    key={cid}
                                    onClick={() => onSelect(cat)}
                                    className={`
                                        cursor-pointer transition-all group
                                        ${selectedId === cid ? 'bg-indigo-50/60' : 'hover:bg-gray-50/80'}
                                    `}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs transition-transform group-hover:scale-110 ${selectedId === cid ? 'bg-indigo-600 text-white shadow-indigo-200 shadow-lg' : 'text-indigo-600 bg-indigo-50 border border-indigo-100'}`}>
                                                {cat.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className={`font-semibold transition-colors flex items-center gap-2 ${selectedId === cid ? 'text-indigo-700' : 'text-gray-900 group-hover:text-indigo-600'}`}>
                                                    {cat.name}
                                                    {selectedId === cid && <ChevronRight size={14} className="text-indigo-400 animate-pulse" />}
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">
                                                    {cat.code}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 font-medium">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border shadow-sm ${cat.type === 'fixed' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                                            {cat.type === 'fixed' ? 'Fixed Cost' : 'Variable'}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        {cat.budgetLimit ? (
                                            <span className="font-mono font-bold text-gray-700 flex items-center gap-0.5">
                                                ₹{(cat.budgetLimit || 0).toLocaleString()}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs italic font-medium">No Limit</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <CategoryStatusBadge isActive={cat.isActive} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {categories.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 text-gray-400 text-sm h-64 bg-gray-50/30">
                    <ArrowUpRight size={24} className="mb-2 opacity-50" />
                    <p className="font-medium">No expense categories found.</p>
                </div>
            )}
        </div>
    );
};

export default ExpenseCategoryTable;
