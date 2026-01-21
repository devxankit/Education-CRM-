
import React, { useState } from 'react';
import { DollarSign, Plus, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const SalaryHeadsPanel = ({ isLocked }) => {

    // Mock Data
    const [heads, setHeads] = useState([
        { id: 1, name: 'Basic Salary', type: 'earning', calculation: 'fixed', value: 0, isDefault: true },
        { id: 2, name: 'HRA (House Rent)', type: 'earning', calculation: 'percentage', value: 40, base: 'basic' },
        { id: 3, name: 'Transport Allowance', type: 'earning', calculation: 'fixed', value: 2000 },
        { id: 4, name: 'Provident Fund (PF)', type: 'deduction', calculation: 'percentage', value: 12, base: 'basic' },
        { id: 5, name: 'Professional Tax', type: 'deduction', calculation: 'fixed', value: 200 }
    ]);

    const [newHead, setNewHead] = useState({ name: '', type: 'earning', calculation: 'fixed', value: '' });

    const handleAdd = () => {
        if (newHead.name && newHead.value) {
            setHeads([...heads, { ...newHead, id: Date.now(), value: Number(newHead.value) }]);
            setNewHead({ name: '', type: 'earning', calculation: 'fixed', value: '' });
        }
    };

    const handleRemove = (id) => {
        setHeads(heads.filter(h => h.id !== id));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <DollarSign className="text-emerald-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Salary Components (Heads)</h3>
                    <p className="text-xs text-gray-500">Define global earnings and deductions structures.</p>
                </div>
            </div>

            <div className="p-6">

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-100 mb-6">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-4 py-3 border-b">Head Name</th>
                                <th className="px-4 py-3 border-b">Type</th>
                                <th className="px-4 py-3 border-b">Calculation</th>
                                <th className="px-4 py-3 border-b text-right">Default Value</th>
                                {!isLocked && <th className="px-4 py-3 border-b w-10"></th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {heads.map((head) => (
                                <tr key={head.id} className="hover:bg-gray-50 group">
                                    <td className="px-4 py-3 font-medium text-gray-900">{head.name}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${head.type === 'earning' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                            {head.type === 'earning' ? <ArrowUpCircle size={10} /> : <ArrowDownCircle size={10} />}
                                            {head.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 text-xs">
                                        {head.calculation === 'percentage'
                                            ? `${head.value}% of ${head.base?.toUpperCase() || 'BASIC'}`
                                            : 'Flat Amount'
                                        }
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-gray-700">
                                        {head.calculation === 'fixed' && head.value > 0 ? `$${head.value}` : '-'}
                                        {head.calculation === 'percentage' && `${head.value}%`}
                                        {head.value === 0 && <span className="text-gray-400 text-xs italic">User Defined</span>}
                                    </td>
                                    {!isLocked && (
                                        <td className="px-4 py-3 text-right">
                                            {!head.isDefault && (
                                                <button onClick={() => handleRemove(head.id)} className="text-gray-300 hover:text-red-600 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add New */}
                {!isLocked && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Head Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Medical Allowance"
                                value={newHead.name}
                                onChange={(e) => setNewHead({ ...newHead, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div className="w-[120px]">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
                            <select
                                value={newHead.type}
                                onChange={(e) => setNewHead({ ...newHead, type: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white outline-none"
                            >
                                <option value="earning">Earning</option>
                                <option value="deduction">Deduction</option>
                            </select>
                        </div>
                        <div className="w-[140px]">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Calculation</label>
                            <select
                                value={newHead.calculation}
                                onChange={(e) => setNewHead({ ...newHead, calculation: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white outline-none"
                            >
                                <option value="fixed">Fixed Amount</option>
                                <option value="percentage">% of Basic</option>
                            </select>
                        </div>
                        <div className="w-[100px]">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Value</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={newHead.value}
                                onChange={(e) => setNewHead({ ...newHead, value: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-indigo-500"
                            />
                        </div>
                        <button
                            onClick={handleAdd}
                            disabled={!newHead.name || !newHead.value}
                            className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalaryHeadsPanel;
