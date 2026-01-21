
import React, { useState } from 'react';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

const StaffDocumentRulesPanel = ({ isLocked }) => {

    const [rules, setRules] = useState([
        { id: 1, name: 'Identity Proof (PAN/Aadhaar)', type: 'all', mandatory: true },
        { id: 2, name: 'Qualification Degrees', type: 'teaching', mandatory: true },
        { id: 3, name: 'Experience Letters', type: 'teaching', mandatory: true },
        { id: 4, name: 'Police Verification', type: 'all', mandatory: false }
    ]);

    const handleRemove = (id) => {
        if (isLocked) return;
        setRules(prev => prev.filter(r => r.id !== id));
    };

    const handleAdd = () => {
        if (isLocked) return;
        setRules([...rules, {
            id: Date.now(),
            name: 'New Document',
            type: 'all',
            mandatory: false
        }]);
    };

    const handleChange = (id, field, value) => {
        if (isLocked) return;
        setRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Briefcase className="text-purple-600" size={20} />
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Staff & HR Requirements</h3>
                        <p className="text-xs text-gray-500">Employment & verification docs.</p>
                    </div>
                </div>
                {!isLocked && (
                    <button onClick={handleAdd} className="p-1.5 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors">
                        <Plus size={16} />
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-4 py-3 border-b">Document Name</th>
                            <th className="px-4 py-3 border-b">Applicable Staff</th>
                            <th className="px-4 py-3 border-b text-center">Mandatory</th>
                            <th className="px-4 py-3 border-b w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {rules.map((rule) => (
                            <tr key={rule.id} className="hover:bg-gray-50 group">
                                <td className="px-4 py-2">
                                    <input
                                        type="text"
                                        value={rule.name}
                                        disabled={isLocked}
                                        onChange={(e) => handleChange(rule.id, 'name', e.target.value)}
                                        className="w-full bg-transparent border-b border-transparent focus:border-purple-500 outline-none text-sm font-medium text-gray-800"
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <select
                                        value={rule.type}
                                        disabled={isLocked}
                                        onChange={(e) => handleChange(rule.id, 'type', e.target.value)}
                                        className="bg-transparent text-xs text-gray-600 border border-gray-200 rounded px-2 py-1 outline-none"
                                    >
                                        <option value="all">All Staff</option>
                                        <option value="teaching">Teaching Only</option>
                                        <option value="non-teaching">Non-Teaching Only</option>
                                        <option value="contractual">Contractual Only</option>
                                    </select>
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <input
                                        type="checkbox"
                                        checked={rule.mandatory}
                                        disabled={isLocked}
                                        onChange={(e) => handleChange(rule.id, 'mandatory', e.target.checked)}
                                        className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                                    />
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {!isLocked && (
                                        <button onClick={() => handleRemove(rule.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffDocumentRulesPanel;
