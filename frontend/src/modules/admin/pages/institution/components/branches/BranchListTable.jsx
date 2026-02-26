
import React from 'react';
import { Building2, ChevronRight, MapPin, GraduationCap, UserCog, BookOpen } from 'lucide-react';
import BranchStatusBadge from './BranchStatusBadge';

const BranchListTable = ({ branches, onRowClick, onToggleStatus }) => {
    // Pagination: 5 per page
    const pageSize = 5;
    const [page, setPage] = React.useState(1);

    if (!branches || branches.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <Building2 className="text-gray-400" size={32} />
                </div>
                <h3 className="text-gray-900 font-medium">No Branches Added</h3>
                <p className="text-gray-500 text-sm mt-1 mb-4">Define your campus structure to begin.</p>
                <button
                    onClick={() => onRowClick(null)} // Trigger 'New'
                    className="text-indigo-600 font-medium text-sm hover:underline"
                >
                    Create Main Campus
                </button>
            </div>
        );
    }

    const totalPages = Math.max(1, Math.ceil(branches.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const pageItems = branches.slice(startIndex, startIndex + pageSize);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[420px]">
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3 font-medium border-b border-gray-100">Branch Name</th>
                            <th className="px-6 py-3 font-medium border-b border-gray-100">Details</th>
                            <th className="px-6 py-3 font-medium border-b border-gray-100">Status</th>
                            <th className="px-6 py-3 font-medium border-b border-gray-100 text-right">Metrics</th>
                            <th className="px-4 py-3 border-b border-gray-100 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {pageItems.map((branch) => (
                            <tr
                                key={branch._id}
                                onClick={() => onRowClick(branch)}
                                className="group hover:bg-indigo-50/30 transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${branch.type === 'school' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                            <Building2 size={18} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{branch.name}</p>
                                            <p className="text-xs text-gray-500 font-mono mt-0.5">{branch.code}</p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="text-gray-600 flex items-center gap-1.5 text-xs">
                                        <MapPin size={14} className="text-gray-400" />
                                        {branch.city}, {branch.state}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Head: <span className="text-gray-700 font-medium">{branch.headName || 'Not Assigned'}</span>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    {onToggleStatus ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleStatus(branch);
                                            }}
                                            className="focus:outline-none"
                                            title={branch.isActive ? 'Click to Deactivate' : 'Click to Activate'}
                                        >
                                            <BranchStatusBadge isActive={branch.isActive} />
                                        </button>
                                    ) : (
                                        <BranchStatusBadge isActive={branch.isActive} />
                                    )}
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-4 text-xs text-gray-500">
                                        <span title="Total Students" className="flex items-center gap-1">
                                            <GraduationCap size={14} className="text-gray-400" />
                                            <strong className="text-gray-900">{branch.stats?.students ?? 0}</strong> Students
                                        </span>
                                        <span className="w-px h-3 bg-gray-300"></span>
                                        <span title="Total Staff" className="flex items-center gap-1">
                                            <UserCog size={14} className="text-gray-400" />
                                            <strong className="text-gray-900">{branch.stats?.staff ?? 0}</strong> Staff
                                        </span>
                                        <span className="w-px h-3 bg-gray-300"></span>
                                        <span title="Total Teachers" className="flex items-center gap-1">
                                            <BookOpen size={14} className="text-gray-400" />
                                            <strong className="text-gray-900">{branch.stats?.teachers ?? 0}</strong> Teachers
                                        </span>
                                    </div>
                                </td>

                                <td className="px-4 py-4 text-gray-400">
                                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>
                    Showing {pageItems.length} of {branches.length} Campus Locations
                    {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
                </span>
                {totalPages > 1 && (
                    <div className="inline-flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-2.5 py-1 rounded border border-gray-200 bg-white text-[11px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            Prev
                        </button>
                        <span className="text-[11px] text-gray-500">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-2.5 py-1 rounded border border-gray-200 bg-white text-[11px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BranchListTable;
