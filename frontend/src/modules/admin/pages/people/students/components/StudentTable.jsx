
import React, { useState, useMemo, useEffect } from 'react';
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../../../../../store/adminStore';

const PAGE_SIZE = 5;

const StudentTable = () => {
    const navigate = useNavigate();
    const students = useAdminStore(state => state.students);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(students.length / PAGE_SIZE) || 1;
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) setCurrentPage(1);
    }, [students.length, currentPage, totalPages]);
    const DISPLAY_STUDENTS = useMemo(
        () => students.slice(startIndex, startIndex + PAGE_SIZE),
        [students, startIndex]
    );

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'fees due': return 'bg-amber-100 text-amber-700';
            case 'inactive': return 'bg-gray-100 text-gray-600';
            default: return 'bg-green-100 text-green-700';
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Student Info</th>
                            <th className="px-6 py-4 font-semibold">Class / Roll</th>
                            <th className="px-6 py-4 font-semibold">Parent Contact</th>
                            <th className="px-6 py-4 font-semibold">Admission No</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {DISPLAY_STUDENTS.map((student) => {
                            const fullName = student.name || `${student.firstName} ${student.lastName}`;
                            const studentId = student._id || student.id;
                            return (
                                <tr
                                    key={studentId}
                                    onClick={() => navigate(`/admin/people/students/${studentId}`)}
                                    className="hover:bg-gray-50 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                {fullName ? fullName.substring(0, 2).toUpperCase() : 'ST'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{fullName}</p>
                                                <p className="text-xs text-gray-500">ID: {studentId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-900 font-medium">
                                            {student.classId?.name || student.class || 'N/A'} - {student.sectionId?.name || student.section || 'N/A'}
                                        </p>
                                        <p className="text-xs text-gray-500">Roll: {student.rollNo || student.roll || 'N/A'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-900">{student.parentId?.name || student.parentName || 'N/A'}</p>
                                        <div className="flex flex-col">
                                            <p className="text-xs text-gray-500">{student.parentId?.mobile || student.parentMobile || 'N/A'}</p>
                                            {student.parentEmail && <p className="text-[10px] text-indigo-500 font-medium truncate max-w-[150px]">{student.parentEmail}</p>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-gray-600 text-xs">
                                        {student.admissionNo || student.admNo || 'PENDING'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(student.status || 'Active')}`}>
                                            {student.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                        <button className="text-gray-400 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>
                    Showing {students.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + PAGE_SIZE, students.length)} of {students.length} entries
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className={`px-3 py-1 border rounded ${currentPage === p ? 'bg-indigo-50 text-indigo-600 font-bold' : 'hover:bg-gray-50'}`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages}
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentTable;
