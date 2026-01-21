
import React, { useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

const FeeComponentsEditor = ({ components, onChange, readOnly }) => {

    const [newComponent, setNewComponent] = useState({
        name: '',
        amount: '',
        frequency: 'Annual',
        isMandatory: true
    });

    const handleAdd = () => {
        if (!newComponent.name || !newComponent.amount) return;
        onChange([...components, { ...newComponent, id: Date.now(), amount: Number(newComponent.amount) }]);
        setNewComponent({ name: '', amount: '', frequency: 'Annual', isMandatory: true });
    };

    const handleRemove = (id) => {
        onChange(components.filter(c => c.id !== id));
    };

    const totalCalculated = components.reduce((sum, c) => sum + c.amount, 0);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <h4 className="text-sm font-bold text-gray-700">Fee Components Breakdown</h4>
                <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                    Total: ${totalCalculated.toLocaleString()}
                </span>
            </div>

            {/* Add New Line */}
            {!readOnly && (
                <div className="flex flex-wrap gap-2 items-end bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-[10px] text-gray-500 mb-1">Fee Head / Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Tuition Fee"
                            value={newComponent.name}
                            onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div className="w-[100px]">
                        <label className="block text-[10px] text-gray-500 mb-1">Amount</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={newComponent.amount}
                            onChange={(e) => setNewComponent({ ...newComponent, amount: e.target.value })}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div className="w-[120px]">
                        <label className="block text-[10px] text-gray-500 mb-1">Frequency</label>
                        <select
                            value={newComponent.frequency}
                            onChange={(e) => setNewComponent({ ...newComponent, frequency: e.target.value })}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white outline-none"
                        >
                            <option value="Annual">Annual (One-time)</option>
                            <option value="Term">Term-wise</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 pb-2 px-2">
                        <input
                            type="checkbox"
                            checked={newComponent.isMandatory}
                            onChange={(e) => setNewComponent({ ...newComponent, isMandatory: e.target.checked })}
                            className="w-4 h-4 text-indigo-600 rounded"
                            title="Is Mandatory?"
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={!newComponent.name || !newComponent.amount}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-4 py-2 border-b">Component</th>
                            <th className="px-4 py-2 border-b">Frequency</th>
                            <th className="px-4 py-2 border-b">Mandatory</th>
                            <th className="px-4 py-2 border-b text-right">Amount</th>
                            {!readOnly && <th className="px-4 py-2 border-b w-10"></th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {components.map((comp) => (
                            <tr key={comp.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 font-medium text-gray-800">{comp.name}</td>
                                <td className="px-4 py-2 text-gray-500 text-xs">{comp.frequency}</td>
                                <td className="px-4 py-2">
                                    {comp.isMandatory ?
                                        <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100 uppercase font-bold">Yes</span> :
                                        <span className="text-[10px] text-gray-400">Optional</span>
                                    }
                                </td>
                                <td className="px-4 py-2 text-right font-mono font-medium">${comp.amount.toLocaleString()}</td>
                                {!readOnly && (
                                    <td className="px-4 py-2 text-right">
                                        <button onClick={() => handleRemove(comp.id)} className="text-gray-400 hover:text-red-600">
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {components.length === 0 && (
                            <tr>
                                <td colSpan={readOnly ? 4 : 5} className="text-center py-4 text-gray-400 italic text-xs">
                                    No fee components added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {readOnly && (
                <div className="flex gap-2 items-start bg-blue-50 p-3 rounded text-xs text-blue-700">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <p>These components are locked and will be applied to all student accounts linked to this fee structure.</p>
                </div>
            )}
        </div>
    );
};

export default FeeComponentsEditor;
