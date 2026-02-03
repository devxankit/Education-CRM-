
import React from 'react';
import { MoreVertical, Eye, GraduationCap, School } from 'lucide-react';
import TeacherStatusBadge from './TeacherStatusBadge';

const TeacherTable = ({ teachers, onView }) => {

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Teacher Name</th>
                            <th className="px-6 py-4 font-semibold">Department</th>
                            <th className="px-6 py-4 font-semibold">Academic Level</th>
                            <th className="px-6 py-4 font-semibold">Eligible Subjects</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {teachers.map((teacher) => (
                            <tr key={teacher.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                                            {teacher.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{teacher.name}</p>
                                            <p className="text-xs text-gray-500 font-mono">{teacher.code}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 font-medium text-xs">
                                    {teacher.department}
                                    <span className="block text-[10px] text-gray-400 font-normal">{teacher.designation}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 bg-gray-50 w-fit px-2 py-1 rounded border border-gray-100">
                                        <School size={12} className="text-gray-500" />
                                        <span className="text-xs font-bold text-gray-700">{teacher.academicLevel}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                                        {teacher.eligibleSubjectsCount} Subjects
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <TeacherStatusBadge status={teacher.teachingStatus} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onView(teacher)}
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

            {teachers.length === 0 && (
                <div className="p-10 text-center text-gray-400 text-sm">
                    No active teachers found.
                </div>
            )}
        </div>
    );
};

export default TeacherTable;
