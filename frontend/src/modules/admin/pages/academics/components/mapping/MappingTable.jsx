
import React from 'react';
import { UserPlus, Trash2, BookOpen, AlertCircle } from 'lucide-react';

const MappingTable = ({ mappings, onAssignClick, onRemove }) => {

    if (!mappings || mappings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-400 text-sm">
                No subjects found for this class. Please configure subjects first.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-3 font-medium border-b border-gray-100">Subject</th>
                        <th className="px-6 py-3 font-medium border-b border-gray-100">Details</th>
                        <th className="px-6 py-3 font-medium border-b border-gray-100">Assigned Faculty</th>
                        <th className="px-6 py-3 font-medium border-b border-gray-100 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                    {mappings.map((row) => (
                        <tr key={row._id || row.subjectId} className="group hover:bg-gray-50/50 transition-colors">

                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xs bg-indigo-500`}>
                                        {row.subjectName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{row.subjectName}</div>
                                        <div className="text-xs text-gray-400 font-mono">{row.subjectCode}</div>
                                    </div>
                                </div>
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-gray-500 capitalize">{row.type.replace('_', ' + ')}</span>
                                </div>
                            </td>

                            <td className="px-6 py-4">
                                {row.teacherId ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                                            {row.teacherName.charAt(0)}
                                        </div>
                                        <span className="text-gray-900 font-medium">{row.teacherName}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded border border-amber-100 w-fit">
                                        <AlertCircle size={12} /> Pending Assignment
                                    </div>
                                )}
                            </td>

                            <td className="px-6 py-4 text-right">
                                {row.teacherId ? (
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onAssignClick(row)}
                                            className="text-xs text-indigo-600 hover:underline px-2 py-1"
                                        >
                                            Change
                                        </button>
                                        <button
                                            onClick={() => onRemove(row)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Remove Mapping"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => onAssignClick(row)}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors"
                                    >
                                        <UserPlus size={14} /> Assign Teacher
                                    </button>
                                )}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MappingTable;
