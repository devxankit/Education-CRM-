
import React, { useState } from 'react';
import { UserCheck, Plus, Trash2 } from 'lucide-react';

const EligibilityRulesPanel = ({ isLocked }) => {

    // Mock Criterion
    const [criteria, setCriteria] = useState([
        { id: 1, class: 'Class 1', minAge: 5, maxAge: 7, prevClassRequired: false },
        { id: 2, class: 'Class 6', minAge: 10, maxAge: 12, prevClassRequired: true },
        { id: 3, class: 'Class 10', minAge: 14, maxAge: 16, prevClassRequired: true },
    ]);

    const handleChange = (id, field, value) => {
        if (isLocked) return;
        setCriteria(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const handleRemove = (id) => {
        if (isLocked) return;
        setCriteria(prev => prev.filter(c => c.id !== id));
    };

    const handleAdd = () => {
        if (isLocked) return;
        setCriteria([...criteria, { id: Date.now(), class: 'New Class', minAge: 0, maxAge: 0, prevClassRequired: false }]);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <UserCheck className="text-blue-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Eligibility Criteria</h3>
                    <p className="text-xs text-gray-500">Age and qualification limits per academic level.</p>
                </div>
            </div>

            <div className="p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-3 py-2 border-b">Class / Program</th>
                                <th className="px-3 py-2 border-b w-32">Min Age</th>
                                <th className="px-3 py-2 border-b w-32">Max Age</th>
                                <th className="px-3 py-2 border-b text-center">Prev. Transfer Cert?</th>
                                <th className="px-3 py-2 border-b w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {criteria.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">
                                        <input
                                            type="text" value={c.class}
                                            disabled={isLocked}
                                            onChange={(e) => handleChange(c.id, 'class', e.target.value)}
                                            className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 hover:border-gray-300 outline-none transition-colors"
                                        />
                                    </td>
                                    <td className="px-3 py-2">
                                        <input
                                            type="number" value={c.minAge}
                                            disabled={isLocked}
                                            onChange={(e) => handleChange(c.id, 'minAge', Number(e.target.value))}
                                            className="w-full px-2 py-1 border border-gray-200 rounded text-center"
                                        />
                                    </td>
                                    <td className="px-3 py-2">
                                        <input
                                            type="number" value={c.maxAge}
                                            disabled={isLocked}
                                            onChange={(e) => handleChange(c.id, 'maxAge', Number(e.target.value))}
                                            className="w-full px-2 py-1 border border-gray-200 rounded text-center"
                                        />
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <button
                                            disabled={isLocked}
                                            onClick={() => handleChange(c.id, 'prevClassRequired', !c.prevClassRequired)}
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${c.prevClassRequired ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}
                                        >
                                            {c.prevClassRequired ? 'Mandatory' : 'Optional'}
                                        </button>
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        {!isLocked && (
                                            <button onClick={() => handleRemove(c.id)} className="text-gray-400 hover:text-red-600">
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!isLocked && (
                    <button
                        onClick={handleAdd}
                        className="mt-4 flex items-center gap-1 text-xs text-indigo-600 font-medium hover:underline"
                    >
                        <Plus size={14} /> Add Criterion
                    </button>
                )}
            </div>
        </div>
    );
};

export default EligibilityRulesPanel;
