
import React from 'react';
import { BookOpen, GraduationCap, Percent } from 'lucide-react';

const AcademicTab = ({ student }) => {
    // Get subjects from student data
    const currentSubjects = student?.subjects || [];

    return (
        <div className="space-y-6">

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Percent size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Overall Attendance</p>
                        <h3 className="text-xl font-bold text-gray-900">{student?.attendance || 'N/A'}</h3>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <GraduationCap size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">CGPA / Grade</p>
                        <h3 className="text-xl font-bold text-gray-900">{student?.grade || 'N/A'}</h3>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Subjects</p>
                        <h3 className="text-xl font-bold text-gray-900">{student?.subjects?.length || 0} Enrolled</h3>
                    </div>
                </div>
            </div>

            {/* Current Subjects */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-800">Current Academic Performance</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Subject</th>
                                <th className="px-6 py-3 font-semibold">Code</th>
                                <th className="px-6 py-3 font-semibold">Type</th>
                                <th className="px-6 py-3 font-semibold">Teacher</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {currentSubjects.map((sub, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-800">{sub.name}</td>
                                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{sub.code}</td>
                                    <td className="px-6 py-4 text-gray-600 capitalize">{sub.type?.replace('_', ' + ')}</td>
                                    <td className="px-6 py-4 text-gray-600">{sub.teacher}</td>
                                </tr>
                            ))}
                            {currentSubjects.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <BookOpen size={32} className="opacity-20" />
                                            <p className="font-medium">No subjects assigned yet.</p>
                                            <p className="text-xs text-gray-400">Class schedule and subject mappings will appear here after academic setup.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default AcademicTab;
