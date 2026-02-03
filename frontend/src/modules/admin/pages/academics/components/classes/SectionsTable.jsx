
import React from 'react';
import { Users, User, Edit, Ban } from 'lucide-react';

const SectionsTable = ({ sections, className, onAdd, onEdit, onDeactivate }) => {

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
        <div className="h-full flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3 font-medium border-b border-gray-100">Section</th>
                            <th className="px-6 py-3 font-medium border-b border-gray-100">Capacity</th>
                            <th className="px-6 py-3 font-medium border-b border-gray-100">Class Teacher</th>
                            <th className="px-6 py-3 font-medium border-b border-gray-100">Status</th>
                            <th className="px-6 py-3 border-b border-gray-100"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm bg-white">
                        {sections.map((sec) => (
                            <tr key={sec._id || sec.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                            {sec.name}
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-gray-600">
                                    <span className="font-mono">{sec.capacity}</span> Students
                                </td>

                                <td className="px-6 py-4">
                                    {(sec.teacherId?.name || sec.teacherName) ? (
                                        <div className="flex items-center gap-2 text-gray-700 text-xs bg-gray-50 px-2 py-1 rounded w-fit border border-gray-200">
                                            <User size={12} /> {sec.teacherId?.name || sec.teacherName}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Unassigned</span>
                                    )}
                                </td>

                                <td className="px-6 py-4">
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

                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(sec)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                            title="Edit Section"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        {sec.status === 'active' && (
                                            <button
                                                onClick={() => onDeactivate(sec)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                title="Deactivate Section"
                                            >
                                                <Ban size={14} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SectionsTable;
