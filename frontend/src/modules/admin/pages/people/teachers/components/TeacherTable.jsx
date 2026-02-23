
import React, { useState, useMemo, useEffect } from 'react';
import { Eye, School, UserPlus } from 'lucide-react';
import TeacherStatusBadge from './TeacherStatusBadge';

const PAGE_SIZE = 5;

const TeacherTable = ({ teachers, onView, searchQuery = '' }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(teachers.length / PAGE_SIZE) || 1;
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const displayTeachers = useMemo(
        () => teachers.slice(startIndex, startIndex + PAGE_SIZE),
        [teachers, startIndex]
    );

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) setCurrentPage(1);
    }, [teachers.length, currentPage, totalPages]);

    const getDeptDisplay = (teacher) => {
        const dept = teacher.department || 'General';
        const desig = teacher.designation || 'Teacher';
        const role = desig !== dept ? desig : 'Teacher';
        return `${dept} · ${role}`;
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-2.5 font-semibold text-[10px] text-gray-600 uppercase tracking-wider">Teacher Name</th>
                            <th className="px-4 py-2.5 font-semibold text-[10px] text-gray-600 uppercase tracking-wider">Department</th>
                            <th className="px-4 py-2.5 font-semibold text-[10px] text-gray-600 uppercase tracking-wider">Academic Level</th>
                            <th className="px-4 py-2.5 font-semibold text-[10px] text-gray-600 uppercase tracking-wider">Eligible Subjects</th>
                            <th className="px-4 py-2.5 font-semibold text-[10px] text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-2.5 font-semibold text-[10px] text-gray-600 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {displayTeachers.map((teacher) => (
                            <tr
                                key={teacher.id || teacher._id}
                                className="hover:bg-indigo-50/40 transition-colors group cursor-pointer"
                                onClick={() => onView(teacher)}
                            >
                                <td className="px-4 py-2.5 align-middle">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                                            {teacher.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-900 truncate text-sm">{teacher.name || 'Unknown'}</p>
                                            <p className="text-[10px] text-gray-500 font-mono truncate">{teacher.code || teacher.employeeId || 'N/A'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-2.5 align-middle">
                                    <p className="text-gray-800 text-xs truncate" title={getDeptDisplay(teacher)}>
                                        {getDeptDisplay(teacher)}
                                    </p>
                                </td>
                                <td className="px-4 py-2.5 align-middle whitespace-nowrap">
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-medium">
                                        <School size={10} className="shrink-0" />
                                        {teacher.academicLevel || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-4 py-2.5 align-middle whitespace-nowrap">
                                    <span className="inline-flex px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-semibold">
                                        {(teacher.eligibleSubjectsDisplay ?? teacher.eligibleSubjectsCount ?? teacher.eligibleSubjects?.length ?? 0)} {(teacher.eligibleSubjectsDisplay ?? teacher.eligibleSubjectsCount ?? 0) === 1 ? 'Subject' : 'Subjects'}
                                    </span>
                                </td>
                                <td className="px-4 py-2.5 align-middle whitespace-nowrap">
                                    <TeacherStatusBadge status={teacher.teachingStatus || teacher.status || 'Active'} />
                                </td>
                                <td className="px-4 py-2.5 align-middle text-right whitespace-nowrap">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onView(teacher);
                                        }}
                                        className="inline-flex items-center gap-1 text-gray-500 hover:text-indigo-600 px-1.5 py-1 rounded hover:bg-indigo-50 transition-colors"
                                        title="View Details"
                                    >
                                        <Eye size={14} />
                                        <span className="text-[10px] font-medium">View</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {teachers.length > 0 && (
                <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                    <span>
                        Showing {startIndex + 1} to {Math.min(startIndex + PAGE_SIZE, teachers.length)} of {teachers.length}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage <= 1}
                            className="px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                className={`px-2 py-1 border rounded ${currentPage === p ? 'bg-indigo-100 text-indigo-700 font-semibold border-indigo-200' : 'hover:bg-gray-50'}`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage >= totalPages}
                            className="px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {teachers.length === 0 && (
                <div className="p-16 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserPlus size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium text-base mb-1">No teachers found</p>
                    <p className="text-gray-400 text-sm">
                        {searchQuery ? `No teachers match "${searchQuery}"` : 'Get started by adding your first teacher'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default TeacherTable;
