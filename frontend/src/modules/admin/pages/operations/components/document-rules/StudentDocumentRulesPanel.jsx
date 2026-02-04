
import React from 'react';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

const StudentDocumentRulesPanel = ({ isLocked, rules, setRules }) => {

    const handleRemove = (index) => {
        if (isLocked) return;
        const newRules = [...rules];
        newRules.splice(index, 1);
        setRules(newRules);
    };

    const handleAdd = () => {
        if (isLocked) return;
        setRules([...rules, {
            name: 'New Document',
            stage: 'admission',
            mandatory: false,
            verifier: 'admin'
        }]);
    };

    const handleChange = (index, field, value) => {
        if (isLocked) return;
        const newRules = [...rules];
        newRules[index] = { ...newRules[index], [field]: value };
        setRules(newRules);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <GraduationCap className="text-indigo-600" size={20} />
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Student Requirements</h3>
                        <p className="text-xs text-gray-500">Docs required for admission & enrollment.</p>
                    </div>
                </div>
                {!isLocked && (
                    <button onClick={handleAdd} className="p-1.5 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors">
                        <Plus size={16} />
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-4 py-3 border-b">Document Name</th>
                            <th className="px-4 py-3 border-b">Required Stage</th>
                            <th className="px-4 py-3 border-b text-center">Mandatory</th>
                            <th className="px-4 py-3 border-b">Verifier Role</th>
                            <th className="px-4 py-3 border-b w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {rules.map((rule, index) => (
                            <tr key={index} className="hover:bg-gray-50 group">
                                <td className="px-4 py-2">
                                    <input
                                        type="text"
                                        value={rule.name}
                                        disabled={isLocked}
                                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                                        className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 outline-none text-sm font-medium text-gray-800"
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <select
                                        value={rule.stage}
                                        disabled={isLocked}
                                        onChange={(e) => handleChange(index, 'stage', e.target.value)}
                                        className="bg-transparent text-xs text-gray-600 border border-gray-200 rounded px-2 py-1 outline-none"
                                    >
                                        <option value="admission">At Admission</option>
                                        <option value="post-admission">Post Admission (30 Days)</option>
                                        <option value="exam">Before Exam</option>
                                    </select>
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <input
                                        type="checkbox"
                                        checked={rule.mandatory}
                                        disabled={isLocked}
                                        onChange={(e) => handleChange(index, 'mandatory', e.target.checked)}
                                        className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <select
                                        value={rule.verifier}
                                        disabled={isLocked}
                                        onChange={(e) => handleChange(index, 'verifier', e.target.value)}
                                        className="bg-transparent text-xs text-blue-600 font-medium border border-blue-100 bg-blue-50 rounded px-2 py-1 outline-none"
                                    >
                                        <option value="admin">Admin Only</option>
                                        <option value="registrar">Registrar</option>
                                        <option value="class-teacher">Class Teacher</option>
                                    </select>
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {!isLocked && (
                                        <button onClick={() => handleRemove(index)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
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

export default StudentDocumentRulesPanel;
