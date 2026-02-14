import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Trash2 } from 'lucide-react';
import { useAdminStore } from '../../../../../../store/adminStore';

const getId = (c) => c._id || c.id;

const EligibilityRulesPanel = ({ isLocked, data, onChange }) => {
    const criteria = Array.isArray(data) ? data : [];
    const { branches, fetchBranches, fetchClasses, fetchCourses, classes = [], courses = [] } = useAdminStore();
    const [branchId, setBranchId] = useState('');

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        if (branches.length > 0 && !branchId) {
            setBranchId(branches[0]._id);
        }
    }, [branches, branchId]);

    useEffect(() => {
        if (branchId) {
            fetchClasses(branchId);
            fetchCourses(branchId);
        } else {
            fetchClasses();
            fetchCourses();
        }
    }, [branchId, fetchClasses, fetchCourses]);

    const handleChange = (id, field, value) => {
        if (isLocked) return;
        const updated = criteria.map(c => getId(c) === id ? { ...c, [field]: value } : c);
        onChange(updated);
    };

    const handleRemove = (id) => {
        if (isLocked) return;
        const updated = criteria.filter(c => getId(c) !== id);
        onChange(updated);
    };

    const handleAdd = () => {
        if (isLocked) return;
        const newItem = { id: `new-${Date.now()}`, class: '', minAge: 0, maxAge: 0, prevClassRequired: false };
        onChange([...criteria, newItem]);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-r from-sky-50/50 to-white px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-100">
                    <UserCheck className="text-sky-600" size={20} />
                </div>
                <div>
                    <h3 className="text-base font-bold text-gray-900">Eligibility Criteria</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Age and qualification limits per academic level.</p>
                </div>
            </div>

            <div className="p-4">
                {/* Branch & options */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Branch</label>
                        <select
                            value={branchId}
                            onChange={(e) => setBranchId(e.target.value)}
                            disabled={isLocked}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            {branches.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                    <span className="text-xs text-gray-400">Select class or program from dropdown</span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-100">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/80 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="px-4 py-3 border-b border-gray-200">Class / Program</th>
                                <th className="px-4 py-3 border-b border-gray-200 w-28">Min Age</th>
                                <th className="px-4 py-3 border-b border-gray-200 w-28">Max Age</th>
                                <th className="px-4 py-3 border-b border-gray-200 text-center">Prev. Cert.</th>
                                <th className="px-3 py-3 border-b border-gray-200 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {criteria.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">
                                        No eligibility criteria defined. Click "Add Criterion" below.
                                    </td>
                                </tr>
                            ) : criteria.map((c) => {
                                const rowId = getId(c);
                                return (
                                    <tr key={rowId} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-3 py-2.5">
                                            <select
                                                value={c.class ?? ''}
                                                disabled={isLocked}
                                                onChange={(e) => handleChange(rowId, 'class', e.target.value)}
                                                className="w-full min-w-[160px] px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                                            >
                                                <option value="">-- Select Class / Program --</option>
                                                {classes.length > 0 && (
                                                    <optgroup label="Classes">
                                                        {classes.map(cl => (
                                                            <option key={cl._id} value={cl.name}>{cl.name}</option>
                                                        ))}
                                                    </optgroup>
                                                )}
                                                {courses.length > 0 && (
                                                    <optgroup label="Programs / Courses">
                                                        {courses.map(co => (
                                                            <option key={co._id} value={co.name}>{co.name}{co.code ? ` (${co.code})` : ''}</option>
                                                        ))}
                                                    </optgroup>
                                                )}
                                                {((c.class || '').trim() && ![...classes.map(cl => cl.name), ...courses.map(co => co.name)].includes((c.class || '').trim())) && (
                                                    <option value={c.class}>{c.class} (saved)</option>
                                                )}
                                            </select>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <input
                                                type="number"
                                                value={c.minAge ?? ''}
                                                disabled={isLocked}
                                                onChange={(e) => handleChange(rowId, 'minAge', Number(e.target.value) || 0)}
                                                min={0}
                                                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                            />
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <input
                                                type="number"
                                                value={c.maxAge ?? ''}
                                                disabled={isLocked}
                                                onChange={(e) => handleChange(rowId, 'maxAge', Number(e.target.value) || 0)}
                                                min={0}
                                                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                            />
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            <button
                                                disabled={isLocked}
                                                onClick={() => handleChange(rowId, 'prevClassRequired', !c.prevClassRequired)}
                                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${c.prevClassRequired ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}
                                            >
                                                {c.prevClassRequired ? 'Mandatory' : 'Optional'}
                                            </button>
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            {!isLocked && (
                                                <button onClick={() => handleRemove(rowId)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {!isLocked && (
                    <button
                        onClick={handleAdd}
                        className="mt-4 flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                        <Plus size={16} /> Add Criterion
                    </button>
                )}
            </div>
        </div>
    );
};

export default EligibilityRulesPanel;
