
import React from 'react';
import { Calendar, PlayCircle, Lock, Eye, ChevronRight } from 'lucide-react';
import YearStatusBadge from './YearStatusBadge';

const AcademicYearTable = ({ years, onActivate, onCloseYear, onView, isSuperAdmin }) => {

    // Sort logic: Active first, then Upcoming, then Closed (newest first)
    const sortedYears = [...years].sort((a, b) => {
        if (a.status === 'active') return -1;
        if (b.status === 'active') return 1;
        if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
        if (b.status === 'upcoming' && a.status !== 'upcoming') return 1;
        return new Date(b.endDate) - new Date(a.endDate);
    });

    if (!years || years.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <Calendar className="text-gray-400" size={32} />
                </div>
                <h3 className="text-gray-900 font-medium">No Academic Years Found</h3>
                <p className="text-gray-500 text-sm mt-1">Configure your first academic session to begin.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-medium border-b border-gray-100">Academic Session</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-100 w-32">Start Date</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-100 w-32">End Date</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-100">Status</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-100">Created Metadata</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-100 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {sortedYears.map((year) => (
                            <tr key={year._id || year.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                            <Calendar size={18} />
                                        </div>
                                        <span className="font-semibold text-gray-900 text-md">{year.name}</span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                    {year.startDate}
                                </td>

                                <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                    {year.endDate}
                                </td>

                                <td className="px-6 py-4">
                                    <YearStatusBadge status={year.status} />
                                </td>

                                <td className="px-6 py-4 text-xs text-gray-500">
                                    <div>{year.createdOn}</div>
                                    <div className="text-[10px] text-gray-400">by {year.createdBy}</div>
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">

                                        {/* Activate Button (Only for Upcoming + Super Admin) */}
                                        {year.status === 'upcoming' && isSuperAdmin && (
                                            <button
                                                onClick={() => onActivate(year)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded text-xs font-semibold transition-colors"
                                            >
                                                <PlayCircle size={14} /> Activate
                                            </button>
                                        )}

                                        {/* Close Button (Only for Active + Super Admin) */}
                                        {year.status === 'active' && isSuperAdmin && (
                                            <button
                                                onClick={() => onCloseYear(year)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded text-xs font-semibold transition-colors"
                                            >
                                                <Lock size={14} /> Close Year
                                            </button>
                                        )}

                                        <button
                                            onClick={() => onView(year)}
                                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                            title="View Details"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex justify-between">
                <span>Showing {years.length} Academic Years</span>
                <span>System Time: Asia/Kolkata</span>
            </div>
        </div>
    );
};

export default AcademicYearTable;
