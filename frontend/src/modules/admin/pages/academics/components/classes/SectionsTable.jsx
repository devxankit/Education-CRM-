
import React from 'react';
import { Users, User, Edit, Ban, ArchiveRestore } from 'lucide-react';

const SectionsTable = ({ sections, className, onAdd, onEdit, onDeactivate, onReactivate }) => {

    if (!sections || sections.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 h-full text-center">
                <div className="bg-white p-4 rounded-full mb-4 shadow-sm border border-gray-100">
                    <Users className="text-indigo-200" size={40} />
                </div>
                <h3 className="text-gray-900 font-medium">No Sections Found</h3>
                <p className="text-gray-500 text-sm mt-1 max-w-xs">{`Class '${className}' has no sections defined. Add Section A to begin.`}</p>
                <button
                    onClick={onAdd}
                    className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors"
                >
                    + Add First Section
                </button>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="sticky top-0 z-10 bg-gray-100 border-b-2 border-gray-200 shadow-sm">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Section</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Capacity</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Class Teacher</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm bg-white">
                    {sections.map((sec) => (
                        <tr key={sec._id || sec.id} className="group hover:bg-indigo-50/50 transition-colors">
                                <td className="px-6 py-4 align-middle">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                            {sec.name}
                                        </div>
                                        <span className="font-semibold text-gray-900">{sec.name}</span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 align-middle">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-800">{sec.studentCount ?? 0} / {sec.capacity ?? 40}</span>
                                        {sec.capacity > 0 && (
                                            <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${((sec.studentCount || 0) / sec.capacity) > 0.9 ? 'bg-red-500' :
                                                            ((sec.studentCount || 0) / sec.capacity) > 0.7 ? 'bg-amber-500' : 'bg-green-500'
                                                        }`}
                                                    style={{ width: `${Math.min(((sec.studentCount || 0) / sec.capacity) * 100, 100)}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </td>

                                <td className="px-6 py-4 align-middle">
                                    {(sec.teacherId?.name || sec.teacherName) ? (
                                        <div className="flex items-center gap-2 text-gray-700 text-xs bg-gray-50 px-2 py-1 rounded w-fit border border-gray-200">
                                            <User size={12} /> {sec.teacherId?.name || sec.teacherName}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Unassigned</span>
                                    )}
                                </td>

                                <td className="px-6 py-4 align-middle">
                                    {sec.status === 'active' ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-50 text-green-700 border border-green-100">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500 border border-gray-200">
                                            Inactive
                                        </span>
                                    )}
                                </td>

                                <td className="px-6 py-4 text-right align-middle">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation?.(); onEdit(sec); }}
                                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Edit Section"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        {sec.status === 'active' ? (
                                            onDeactivate && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation?.(); onDeactivate(sec); }}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Deactivate Section"
                                                >
                                                    <Ban size={16} />
                                                </button>
                                            )
                                        ) : (
                                            onReactivate && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation?.(); onReactivate(sec); }}
                                                    className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                    title="Reactivate Section"
                                                >
                                                    <ArchiveRestore size={16} />
                                                </button>
                                            )
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    );
};

export default SectionsTable;
