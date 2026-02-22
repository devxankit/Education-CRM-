
import React from 'react';
import { Eye, Phone, Mail, Users, UserPlus } from 'lucide-react';
import ParentStatusBadge from './ParentStatusBadge';

const ParentsTable = ({ parents, onView }) => {
    const ParentRow = ({ parent }) => {
        const parentId = parent._id || parent.id;
        const linked = parent.linkedStudents || [];
        return (
            <tr
                key={parentId}
                onClick={() => onView(parent)}
                className="hover:bg-indigo-50/30 transition-all group cursor-pointer"
            >
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
                            {(parent.name || 'P').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm group-hover:text-teal-700 transition-colors">{parent.name || 'N/A'}</p>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">{parent.code || 'N/A'}</p>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                        {parent.relationship || 'N/A'}
                    </span>
                </td>
                <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-700 flex items-center gap-1.5">
                            <Phone size={12} className="text-gray-400" /> {parent.mobile || 'N/A'}
                        </span>
                        {parent.email && (
                            <span className="text-xs text-gray-500 flex items-center gap-1.5 truncate max-w-[180px]">
                                <Mail size={11} className="text-gray-400 shrink-0" /> {parent.email}
                            </span>
                        )}
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-teal-50 w-fit px-3 py-1.5 rounded-lg border border-teal-200">
                            <Users size={14} className="text-teal-600" />
                            <span className="text-xs font-bold text-teal-700">{parent.studentCount ?? 0}</span>
                        </div>
                        {linked.length > 0 && (
                            <span className="text-[10px] text-gray-400 truncate max-w-[100px]" title={linked.map(s => s.studentName).join(', ')}>
                                {linked[0]?.studentName}
                                {linked.length > 1 && ` +${linked.length - 1}`}
                            </span>
                        )}
                    </div>
                </td>
                <td className="px-6 py-4">
                    <ParentStatusBadge status={parent.status || 'Active'} />
                </td>
                <td className="px-6 py-4 text-right">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(parent);
                        }}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-teal-600 px-3 py-2 rounded-lg hover:bg-teal-50 transition-all"
                        title="View Details"
                    >
                        <Eye size={18} />
                        <span className="text-xs font-medium hidden lg:inline">View</span>
                    </button>
                </td>
            </tr>
        );
    };

    const ParentCard = ({ parent }) => (
        <div
            key={parent._id || parent.id}
            onClick={() => onView(parent)}
            className="md:hidden p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-teal-200 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {(parent.name || 'P').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900 truncate">{parent.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500 font-mono">{parent.code || 'N/A'}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <ParentStatusBadge status={parent.status || 'Active'} />
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{parent.relationship || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(parent);
                    }}
                    className="p-2 text-gray-400 hover:text-teal-600 rounded-lg hover:bg-teal-50 shrink-0"
                >
                    <Eye size={18} />
                </button>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{parent.mobile || 'N/A'}</span>
                </div>
                {parent.email && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 truncate">
                        <Mail size={12} className="text-gray-400 shrink-0" />
                        <span className="truncate">{parent.email}</span>
                    </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                    <Users size={14} className="text-teal-500" />
                    <span className="font-semibold text-teal-700">{parent.studentCount ?? 0} linked</span>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6 hidden md:block">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-bold text-xs text-gray-700 uppercase tracking-wider">Parent Name</th>
                                <th className="px-6 py-4 font-bold text-xs text-gray-700 uppercase tracking-wider">Relationship</th>
                                <th className="px-6 py-4 font-bold text-xs text-gray-700 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 font-bold text-xs text-gray-700 uppercase tracking-wider">Linked Students</th>
                                <th className="px-6 py-4 font-bold text-xs text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-bold text-xs text-gray-700 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {parents.map((parent) => (
                                <ParentRow key={parent._id || parent.id} parent={parent} />
                            ))}
                        </tbody>
                    </table>
                </div>

                {parents.length === 0 && (
                    <div className="p-16 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <UserPlus size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium text-base mb-1">No parents found</p>
                        <p className="text-gray-400 text-sm">Add a parent to get started</p>
                    </div>
                )}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3 mb-6">
                {parents.map((parent) => (
                    <ParentCard key={parent._id || parent.id} parent={parent} />
                ))}
                {parents.length === 0 && (
                    <div className="p-10 text-center bg-white rounded-xl border border-gray-200">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                            <UserPlus size={28} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium text-sm">No parents found</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default ParentsTable;
