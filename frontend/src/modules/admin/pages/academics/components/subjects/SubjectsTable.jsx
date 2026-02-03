
import React from 'react';
import { Book, Edit, Ban, FileText } from 'lucide-react';
import SubjectStatusBadge from './SubjectStatusBadge';

const SubjectsTable = ({ subjects, onEdit, onDeactivate }) => {

    if (!subjects || subjects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <Book className="text-gray-400" size={32} />
                </div>
                <h3 className="text-gray-900 font-medium">No Subjects Defined</h3>
                <p className="text-gray-500 text-sm mt-1">Create subjects to build your curriculum.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-medium border-b border-gray-100">Code & Name</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-100">Type</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-100">Assigned Classes</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-100">Status</th>
                            <th className="px-6 py-4 border-b border-gray-100"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {subjects.map((sub) => (
                            <tr key={sub._id || sub.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900">{sub.name}</span>
                                        <span className="text-xs text-gray-400 font-mono">{sub.code}</span>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs capitalize">
                                        {sub.type?.replace('_', ' + ') || 'Theory'}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1 max-w-xs">
                                        {(sub.classIds || sub.assignedClasses) && (sub.classIds || sub.assignedClasses).length > 0 ? (
                                            (sub.classIds || sub.assignedClasses).slice(0, 3).map((cls, idx) => (
                                                <span key={idx} className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] border border-blue-100">
                                                    {cls.name || cls}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">Unassigned</span>
                                        )}
                                        {(sub.classIds || sub.assignedClasses) && (sub.classIds || sub.assignedClasses).length > 3 && (
                                            <span className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                                                +{(sub.classIds || sub.assignedClasses).length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <SubjectStatusBadge status={sub.status} />
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(sub)}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Edit Details"
                                        >
                                            <Edit size={16} />
                                        </button>

                                        {sub.status === 'active' && (
                                            <button
                                                onClick={() => onDeactivate(sub)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Deactivate Subject"
                                            >
                                                <Ban size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex justify-between">
                <span>Total {subjects.length} Subjects</span>
                <span className="flex items-center gap-1"><FileText size={12} /> Curriculum Master</span>
            </div>
        </div>
    );
};

export default SubjectsTable;
