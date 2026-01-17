
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Download } from 'lucide-react';
import StudentTable from '../components/students/StudentTable';
import { STAFF_ROLES } from '../config/roles';

// Mock Data
const MOCK_STUDENTS = [
    { id: 'STU-2024-001', name: 'Aarav Gupta', class: 'X-A', status: 'Active', contact: '9876543210', feeStatus: 'Paid', route: 'Route-A', docsStatus: 'Verified' },
    { id: 'STU-2024-002', name: 'Ishita Sharma', class: 'X-A', status: 'Active', contact: '9876543211', feeStatus: 'Due', route: 'Route-B', docsStatus: 'Pending' },
    { id: 'STU-2024-003', name: 'Rohan Mehta', class: 'IX-B', status: 'Inactive', contact: '9876543212', feeStatus: 'Overdue', route: 'Unassigned', docsStatus: 'Missing' },
    { id: 'STU-2024-004', name: 'Sanya Kapoor', class: 'XI-C', status: 'Active', contact: '9876543213', feeStatus: 'Paid', route: 'Route-A', docsStatus: 'Verified' },
    { id: 'STU-2024-005', name: 'Vihaan Singh', class: 'XI-C', status: 'Active', contact: '9876543214', feeStatus: 'Due', route: 'Route-C', docsStatus: 'Pending' },
];

const StaffStudentsPage = () => {
    const navigate = useNavigate();
    // In real app, get from auth context
    const currentRole = STAFF_ROLES.FRONT_DESK; // Dev toggle

    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('All');

    // 1. Filtering Logic
    const filteredStudents = MOCK_STUDENTS.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = filterClass === 'All' || student.class === filterClass;
        return matchesSearch && matchesClass;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Student Records</h1>
                    <p className="text-sm text-gray-500">View and manage operational student data</p>
                </div>

                {/* Actions: Add New (Only for Front Desk / Data Entry usually) */}
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        <Download size={18} />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                    {(currentRole === STAFF_ROLES.FRONT_DESK || currentRole === STAFF_ROLES.DATA_ENTRY) && (
                        <button
                            onClick={() => navigate('/staff/students/new')}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            <Plus size={18} />
                            <span>New Admission</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Filters & Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Name, Student ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 min-w-[150px]">
                        <Filter size={18} className="text-gray-400" />
                        <select
                            value={filterClass}
                            onChange={(e) => setFilterClass(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full p-0 cursor-pointer"
                        >
                            <option value="All">All Classes</option>
                            <option value="X-A">Class X-A</option>
                            <option value="IX-B">Class IX-B</option>
                            <option value="XI-C">Class XI-C</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Students Table */}
            <StudentTable
                students={filteredStudents}
                role={currentRole}
            />
        </div>
    );
};

export default StaffStudentsPage;