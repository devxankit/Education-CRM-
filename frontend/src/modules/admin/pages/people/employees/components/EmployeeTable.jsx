
import React from 'react';
import { MoreVertical, Eye, Briefcase, GraduationCap, User } from 'lucide-react';
import EmployeeStatusBadge from './EmployeeStatusBadge';

const EmployeeTable = ({ employees, onView }) => {

    const getTypeIcon = (type) => {
        if (type === 'Teacher') return <GraduationCap size={14} className="text-indigo-600" />;
        if (type === 'Contract') return <User size={14} className="text-orange-600" />;
        return <Briefcase size={14} className="text-green-600" />;
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Employee</th>
                            <th className="px-6 py-4 font-semibold">Type</th>
                            <th className="px-6 py-4 font-semibold">Department</th>
                            <th className="px-6 py-4 font-semibold">Designation</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Joined</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold overflow-hidden border border-gray-100">
                                            {emp.avatar ? <img src={emp.avatar} alt="" className="w-full h-full object-cover" /> : (emp.name?.charAt(0) || '?')}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{emp.name}</p>
                                            <p className="text-xs text-gray-500 font-mono">{emp.code}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-md bg-gray-50 border border-gray-100">
                                            {getTypeIcon(emp.employeeType)}
                                        </div>
                                        <span className="text-xs font-medium text-gray-700">{emp.employeeType}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-xs font-medium">
                                    {emp.department}
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-xs">
                                    {emp.designation}
                                </td>
                                <td className="px-6 py-4">
                                    <EmployeeStatusBadge status={emp.status} />
                                </td>
                                <td className="px-6 py-4 font-mono text-gray-500 text-xs">
                                    {emp.dateOfJoining}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onView(emp)}
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

            {employees.length === 0 && (
                <div className="p-10 text-center text-gray-400 text-sm">
                    No employees found matching filters.
                </div>
            )}
        </div>
    );
};

export default EmployeeTable;
