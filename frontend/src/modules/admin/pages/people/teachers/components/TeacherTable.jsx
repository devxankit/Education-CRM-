
import React from 'react';
import { MoreVertical, Eye, GraduationCap, School, UserPlus } from 'lucide-react';
import TeacherStatusBadge from './TeacherStatusBadge';

const TeacherTable = ({ teachers, onView, searchQuery = '' }) => {

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-bold text-xs text-gray-700 uppercase tracking-wider">Teacher Name</th>
                            <th className="px-6 py-4 font-bold text-xs text-gray-700 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-4 font-bold text-xs text-gray-700 uppercase tracking-wider">Academic Level</th>
                            <th className="px-6 py-4 font-bold text-xs text-gray-700 uppercase tracking-wider">Eligible Subjects</th>
                            <th className="px-6 py-4 font-bold text-xs text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 font-bold text-xs text-gray-700 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {teachers.map((teacher, index) => (
                            <tr 
                                key={teacher.id || teacher._id} 
                                className="hover:bg-indigo-50/30 transition-all group cursor-pointer"
                                onClick={() => onView(teacher)}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
                                            {teacher.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm group-hover:text-indigo-700 transition-colors">{teacher.name || 'Unknown'}</p>
                                            <p className="text-xs text-gray-500 font-mono mt-0.5">{teacher.code || teacher.employeeId || 'N/A'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">{teacher.department || 'General'}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{teacher.designation || 'Teacher'}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 bg-blue-50 w-fit px-3 py-1.5 rounded-lg border border-blue-200">
                                        <School size={14} className="text-blue-600" />
                                        <span className="text-xs font-semibold text-blue-700">{teacher.academicLevel || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                                            {teacher.eligibleSubjectsCount || 0} {teacher.eligibleSubjectsCount === 1 ? 'Subject' : 'Subjects'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <TeacherStatusBadge status={teacher.teachingStatus || teacher.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onView(teacher);
                                        }}
                                        className="inline-flex items-center gap-2 text-gray-400 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-all group-hover:bg-indigo-50"
                                        title="View Details"
                                    >
                                        <Eye size={18} />
                                        <span className="text-xs font-medium hidden md:inline">View</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
