
import React from 'react';
import StudentRow from './StudentRow';
import { STAFF_ROLES } from '../../config/roles';

const StudentTable = ({ students, role }) => {
    // 1. Define Column Visibility based on Role
    const columns = [
        { label: 'Student Info', show: true, width: 'w-1/4' }, // Name + ID
        { label: 'Class', show: true, width: 'w-1/6' },
        { label: 'Status', show: true, width: 'w-1/12' },

        // Role Specific Columns
        { label: 'Contact', show: [STAFF_ROLES.FRONT_DESK, STAFF_ROLES.DATA_ENTRY, STAFF_ROLES.TRANSPORT].includes(role), width: 'w-1/6' },
        { label: 'Fees Status', show: [STAFF_ROLES.ACCOUNTS, STAFF_ROLES.FRONT_DESK].includes(role), width: 'w-1/6' },
        { label: 'Route', show: [STAFF_ROLES.TRANSPORT].includes(role), width: 'w-1/6' },
        { label: 'Docs', show: [STAFF_ROLES.FRONT_DESK, STAFF_ROLES.DATA_ENTRY].includes(role), width: 'w-1/6' },

        { label: 'Actions', show: true, width: 'w-1/12 text-right' }
    ];

    const visibleColumns = columns.filter(col => col.show);

    if (students.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No students found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            {visibleColumns.map((col, idx) => (
                                <th key={idx} className={`px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider ${col.width}`}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {students.map(student => (
                            <StudentRow
                                key={student.id}
                                student={student}
                                role={role}
                                visibleColumns={visibleColumns} // Pass config to row
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
                <span>Showing {students.length} results</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50" disabled>Prev</button>
                    <button className="px-3 py-1 border rounded bg-white hover:bg-gray-100">Next</button>
                </div>
            </div>
        </div>
    );
};

export default StudentTable;