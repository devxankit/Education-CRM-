
import React from 'react';
import { MoreVertical, Eye, Phone, Mail, Users } from 'lucide-react';
import ParentStatusBadge from './ParentStatusBadge';

const ParentsTable = ({ parents, onView }) => {

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6 hidden md:block">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Parent Name</th>
                            <th className="px-6 py-4 font-semibold">Relationship</th>
                            <th className="px-6 py-4 font-semibold">Contact Info</th>
                            <th className="px-6 py-4 font-semibold">Linked Students</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {parents.map((parent) => (
                            <tr key={parent.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                                            {parent.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{parent.name}</p>
                                            <p className="text-xs text-gray-500 font-mono">{parent.code}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-700 font-medium text-xs bg-gray-100 px-2 py-1 rounded">{parent.relationship}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-gray-600 flex items-center gap-1">
                                            <Phone size={10} /> {parent.mobile}
                                        </span>
                                        {parent.email && (
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <Mail size={10} /> {parent.email}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <Users size={14} />
                                        <span className="font-bold text-xs">{parent.studentCount}</span>
                                        <span className="text-[10px] text-gray-400">Students</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <ParentStatusBadge status={parent.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onView(parent)}
                                        className="text-gray-400 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {parents.length === 0 && (
                <div className="p-10 text-center text-gray-400 text-sm">
                    No parents found.
                </div>
            )}
        </div>
    );
};

export default ParentsTable;
