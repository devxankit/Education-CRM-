
import React, { useState, useMemo, useEffect } from 'react';
import { Eye, Phone, Mail, Users, UserPlus } from 'lucide-react';
import ParentStatusBadge from './ParentStatusBadge';

const PAGE_SIZE = 5;

const ParentsTable = ({ parents = [], onView, searchQuery = '' }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(parents.length / PAGE_SIZE) || 1;
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const displayParents = useMemo(
        () => parents.slice(startIndex, startIndex + PAGE_SIZE),
        [parents, startIndex]
    );

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) setCurrentPage(1);
    }, [parents.length, currentPage, totalPages]);

    const ParentRow = ({ parent }) => {
        const parentId = parent._id || parent.id;
        const linked = parent.linkedStudents || [];
        return (
            <tr
                key={parentId}
                onClick={() => onView(parent)}
                className="hover:bg-indigo-50/40 transition-colors group cursor-pointer"
            >
                <td className="px-4 py-2.5 align-middle">
                    <div className="flex items-center gap-1.5">
                        <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-[10px] shrink-0">
                            {(parent.name || 'P').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate text-xs">{parent.name || 'N/A'}</p>
                            <p className="text-[9px] text-gray-500 font-mono truncate">{parent.code || 'N/A'}</p>
                        </div>
                    </div>
                </td>
                <td className="px-4 py-2.5 align-middle whitespace-nowrap">
                    <span className="inline-flex px-1 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200 text-[9px] font-semibold">
                        {parent.relationship || 'N/A'}
                    </span>
                </td>
                <td className="px-4 py-2.5 align-middle">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] text-gray-700 flex items-center gap-1">
                            <Phone size={9} className="text-gray-400 shrink-0" /> {parent.mobile || 'N/A'}
                        </span>
                        {parent.email && (
                            <span className="text-[9px] text-gray-500 flex items-center gap-1 truncate max-w-[120px]">
                                <Mail size={9} className="text-gray-400 shrink-0" /> {parent.email}
                            </span>
                        )}
                    </div>
                </td>
                <td className="px-4 py-2.5 align-middle whitespace-nowrap">
                    <div className="flex items-center gap-1">
                        <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-100 text-[9px] font-semibold">
                            <Users size={9} className="shrink-0" /> {parent.studentCount ?? 0}
                        </span>
                        {linked.length > 0 && (
                            <span className="text-[9px] text-gray-500 truncate max-w-[100px]" title={linked.map(s => s.studentName).join(', ')}>
                                {linked[0]?.studentName}
                                {linked.length > 1 && ` +${linked.length - 1}`}
                            </span>
                        )}
                    </div>
                </td>
                <td className="px-4 py-2.5 align-middle whitespace-nowrap">
                    <ParentStatusBadge status={parent.status || 'Active'} />
                </td>
                <td className="px-4 py-2.5 align-middle text-right whitespace-nowrap">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(parent);
                        }}
                        className="inline-flex items-center gap-0.5 text-gray-500 hover:text-teal-600 px-1 py-0.5 rounded hover:bg-teal-50 transition-colors"
                        title="View Details"
                    >
                        <Eye size={12} />
                        <span className="text-[9px] font-medium">View</span>
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
            <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden mb-4 hidden md:block min-h-[320px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-2.5 font-semibold text-[9px] text-gray-600 uppercase tracking-wider">Parent Name</th>
                                <th className="px-4 py-2.5 font-semibold text-[9px] text-gray-600 uppercase tracking-wider">Relationship</th>
                                <th className="px-4 py-2.5 font-semibold text-[9px] text-gray-600 uppercase tracking-wider">Contact</th>
                                <th className="px-4 py-2.5 font-semibold text-[9px] text-gray-600 uppercase tracking-wider">Linked Students</th>
                                <th className="px-4 py-2.5 font-semibold text-[9px] text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-2.5 font-semibold text-[9px] text-gray-600 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {displayParents.map((parent) => (
                                <ParentRow key={parent._id || parent.id} parent={parent} />
                            ))}
                        </tbody>
                    </table>
                </div>

                {parents.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-600">
                        <span className="font-medium">
                            Showing {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, parents.length)} of {parents.length} parents
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage <= 1}
                                className="px-2.5 py-1 border border-gray-200 rounded hover:bg-white hover:border-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed text-[11px] font-medium"
                            >
                                Previous
                            </button>
                            <span className="text-gray-400 text-sm">|</span>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setCurrentPage(p)}
                                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                                        currentPage === p
                                            ? 'bg-indigo-600 text-white border border-indigo-600'
                                            : 'border border-gray-200 hover:bg-white hover:border-indigo-200'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <span className="text-gray-400 text-sm">|</span>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage >= totalPages}
                                className="px-2.5 py-1 border border-gray-200 rounded hover:bg-white hover:border-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed text-[11px] font-medium"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {parents.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                            <UserPlus size={28} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium text-sm mb-1">No parents found</p>
                        <p className="text-gray-400 text-xs">{searchQuery ? `No parents match "${searchQuery}"` : 'Add a parent to get started'}</p>
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
