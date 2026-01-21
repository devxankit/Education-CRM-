
import React, { useState } from 'react';
import { Tag, Check, Plus, Trash2 } from 'lucide-react';

const DiscountRulesPanel = ({ isLocked }) => {

    // Default system discounts
    const [discounts, setDiscounts] = useState([
        { id: 1, name: 'Sibling Discount', type: 'percentage', value: 10, approvalRequired: false },
        { id: 2, name: 'Staff Ward', type: 'percentage', value: 50, approvalRequired: true },
        { id: 3, name: 'Merit Scholarship', type: 'flat', value: 5000, approvalRequired: true },
    ]);

    const handleAdd = () => {
        if (isLocked) return;
        const newD = { id: Date.now(), name: 'New Discount', type: 'flat', value: 0, approvalRequired: true };
        setDiscounts([...discounts, newD]);
    };

    const handleChange = (id, field, val) => {
        if (isLocked) return;
        setDiscounts(prev => prev.map(d => d.id === id ? { ...d, [field]: val } : d));
    };

    const handleRemove = (id) => {
        if (isLocked) return;
        setDiscounts(prev => prev.filter(d => d.id !== id));
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <Tag className="text-green-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Discounts & Scholarships</h3>
                    <p className="text-xs text-gray-500">Authorized fee concession categories.</p>
                </div>
            </div>

            <div className="p-4">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-3 py-2 border-b">Category Name</th>
                            <th className="px-3 py-2 border-b">Type</th>
                            <th className="px-3 py-2 border-b">Value</th>
                            <th className="px-3 py-2 border-b text-center">Approval?</th>
                            <th className="px-3 py-2 border-b w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {discounts.map((d) => (
                            <tr key={d.id} className="hover:bg-gray-50">
                                <td className="px-3 py-2">
                                    <input
                                        type="text" value={d.name}
                                        disabled={isLocked}
                                        onChange={(e) => handleChange(d.id, 'name', e.target.value)}
                                        className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 hover:border-gray-300 outline-none transition-colors"
                                    />
                                </td>
                                <td className="px-3 py-2">
                                    <select
                                        value={d.type}
                                        disabled={isLocked}
                                        onChange={(e) => handleChange(d.id, 'type', e.target.value)}
                                        className="bg-transparent text-gray-600 text-xs outline-none"
                                    >
                                        <option value="flat">Amount ($)</option>
                                        <option value="percentage">Percentage (%)</option>
                                    </select>
                                </td>
                                <td className="px-3 py-2 font-mono font-medium text-gray-800">
                                    <input
                                        type="number" value={d.value}
                                        disabled={isLocked}
                                        onChange={(e) => handleChange(d.id, 'value', e.target.value)}
                                        className="w-20 bg-transparent border-b border-transparent focus:border-indigo-500 hover:border-gray-300 outline-none transition-colors"
                                    />
                                </td>
                                <td className="px-3 py-2 text-center">
                                    <button
                                        disabled={isLocked}
                                        onClick={() => handleChange(d.id, 'approvalRequired', !d.approvalRequired)}
                                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${d.approvalRequired ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}
                                    >
                                        {d.approvalRequired ? 'Mandatory' : 'Auto'}
                                    </button>
                                </td>
                                <td className="px-3 py-2 text-center text-gray-400">
                                    {!isLocked && (
                                        <button onClick={() => handleRemove(d.id)} className="hover:text-red-600">
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!isLocked && (
                    <button
                        onClick={handleAdd}
                        className="mt-4 flex items-center gap-1 text-xs text-indigo-600 font-medium hover:underline"
                    >
                        <Plus size={14} /> Add Category
                    </button>
                )}
            </div>
        </div>
    );
};

export default DiscountRulesPanel;
