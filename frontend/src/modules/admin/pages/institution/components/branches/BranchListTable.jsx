
import React from 'react';
import { Building2, Users, ChevronRight, MapPin } from 'lucide-react';
import BranchStatusBadge from './BranchStatusBadge';

const BranchListTable = ({ branches, onRowClick }) => {
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

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
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
                        {branches.map((branch) => (
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
                                    <BranchStatusBadge isActive={branch.isActive} />
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3 text-xs text-gray-500">
                                        <span title="Total Students">
                                            <strong className="text-gray-900">{branch.stats?.students || 0}</strong> Students
                                        </span>
                                        <span className="w-px h-3 bg-gray-300"></span>
                                        <span title="Total Staff">
                                            <strong className="text-gray-900">{branch.stats?.staff || 0}</strong> Staff
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

            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex justify-between">
                <span>Showing {branches.length} Campus Locations</span>
                <span>Sorted by Creation Date</span>
            </div>
        </div>
    );
};

export default BranchListTable;
