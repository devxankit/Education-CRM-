
import React from 'react';
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../../../../../store/adminStore';

const StudentTable = () => {
    const navigate = useNavigate();
    const students = useAdminStore(state => state.students);

    // Initial Mock Data for visual reference if store is empty
    const DISPLAY_STUDENTS = students.length > 0 ? students : [
        { id: 1, admNo: 'A-2024-001', name: 'Aarav Sharma', firstName: 'Aarav', lastName: 'Sharma', class: '10', section: 'A', roll: 12, parent: 'Rajiv Sharma', contact: '9876543210', status: 'Active' },
        { id: 2, admNo: 'A-2024-005', name: 'Ishita Patel', firstName: 'Ishita', lastName: 'Patel', class: '10', section: 'A', roll: 13, parent: 'Nilesh Patel', contact: '9876543211', status: 'Active' },
        { id: 3, admNo: 'A-2024-012', name: 'Rohan Mehta', firstName: 'Rohan', lastName: 'Mehta', class: '9', section: 'B', roll: "08", parent: 'Sanjay Mehta', contact: '9876543212', status: 'Fees Due' },
        { id: 4, admNo: 'A-2024-045', name: 'Ananya Gupta', firstName: 'Ananya', lastName: 'Gupta', class: '9', section: 'B', roll: "09", parent: 'Vikram Gupta', contact: '9876543213', status: 'Active' },
        { id: 5, admNo: 'A-2024-102', name: 'Kabir Singh', firstName: 'Kabir', lastName: 'Singh', class: '8', section: 'C', roll: 21, parent: 'Preeti Singh', contact: '9876543214', status: 'Inactive' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'Fees Due': return 'bg-amber-100 text-amber-700';
            case 'Inactive': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-600';
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
                            return (
                                <tr
                                    key={student.id}
                                    onClick={() => navigate(`/admin/people/students/${student.id}`)}
                                    className="hover:bg-gray-50 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                {fullName ? fullName.substring(0, 2).toUpperCase() : 'ST'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{fullName}</p>
                                                <p className="text-xs text-gray-500">ID: {student.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-900 font-medium">{student.class} - {student.section}</p>
                                        <p className="text-xs text-gray-500">Roll: {student.roll || 'N/A'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-900">{student.parent || student.parentName || 'N/A'}</p>
                                        <p className="text-xs text-gray-500">{student.contact || student.phone || 'N/A'}</p>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-gray-600 text-xs">
                                        {student.admNo || student.admissionNo || 'PENDING'}
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
                <span>Showing 1 to {DISPLAY_STUDENTS.length} of {DISPLAY_STUDENTS.length} entries</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
                    <button className="px-3 py-1 border rounded bg-indigo-50 text-indigo-600 font-bold">1</button>
                    <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
                </div>
            </div>
        </div>
    );
};

export default StudentTable;
