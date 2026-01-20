import React, { useState } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, User, Briefcase, MapPin, Filter, Truck, MoreVertical, ChevronRight } from 'lucide-react';

// --- MOCK EMPLOYEE DATA ---
const MOCK_EMPLOYEES = [
    {
        id: 'EMP-2024-001',
        name: 'Ramesh Singh',
        employeeId: 'EMP-D-101',
        designation: 'Senior Driver',
        department: 'Transport',
        type: 'Full-time',
        status: 'Active',
        contact: '9876543210'
    },
    {
        id: 'EMP-2024-002',
        name: 'Sunita Sharma',
        employeeId: 'EMP-O-202',
        designation: 'Office Clerk',
        department: 'Operations',
        type: 'Full-time',
        status: 'Active',
        contact: '9876543211'
    },
    {
        id: 'EMP-2024-003',
        name: 'Mohan Lal',
        employeeId: 'EMP-H-305',
        designation: 'Helper',
        department: 'Maintenance',
        type: 'Contract',
        status: 'On Leave',
        contact: '9876543212'
    },
    {
        id: 'EMP-2024-004',
        name: 'Rajesh Gupta',
        employeeId: 'EMP-S-401',
        designation: 'Guard',
        department: 'Security',
        type: 'Full-time',
        status: 'Active',
        contact: '9876543213'
    },
];

const Employees = () => {
    const { user } = useStaffAuth();
    const navigate = useNavigate();

    // Filters State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [viewMode, setViewMode] = useState('list'); // List (Cards) or Table - controlled by responsiveness mainly

    // Access Check: Front Desk NO ACCESS
    if (user?.role === STAFF_ROLES.FRONT_DESK) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-gray-50">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
                    <User size={32} className="text-red-400" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Access Restricted</h2>
                <p className="text-sm text-gray-500 mt-2 max-w-xs">You do not have permission to view sensitive employee records.</p>
            </div>
        );
    }

    const canAddEmployee = user?.role === STAFF_ROLES.DATA_ENTRY;

    // Filter Logic
    const filteredEmployees = MOCK_EMPLOYEES.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = filterDept === 'All' || emp.department === filterDept;
        const matchesStatus = filterStatus === 'All' || emp.status === filterStatus;
        return matchesSearch && matchesDept && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-50 text-green-700 border-green-200';
            case 'On Leave': return 'bg-amber-50 text-amber-700 border-amber-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="max-w-7xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 pt-5 pb-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Employee Directory</h1>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                            <Briefcase size={12} /> Non-teaching staff & operations team
                        </p>
                    </div>
                    {canAddEmployee && (
                        <button
                            onClick={() => navigate('/staff/employees/new')}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm active:scale-95"
                        >
                            <Plus size={16} /> Add Employee
                        </button>
                    )}
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name, ID or mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>

                    {/* Filters Wrapper */}
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                        <select
                            value={filterDept}
                            onChange={(e) => setFilterDept(e.target.value)}
                            className="px-3 py-2 bg-gray-100 text-sm font-bold text-gray-600 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                        >
                            <option value="All">All Departments</option>
                            <option value="Transport">Transport</option>
                            <option value="Operations">Operations</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Security">Security</option>
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 bg-gray-100 text-sm font-bold text-gray-600 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 md:p-6">

                {/* Desktop Table View (Hidden on Mobile) */}
                <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Role & Dept</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees.map(emp => (
                                    <tr
                                        key={emp.id}
                                        onClick={() => navigate(`/staff/employees/${emp.id}`)}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xs ring-2 ring-white">
                                                    {emp.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{emp.name}</p>
                                                    <p className="text-[11px] font-mono text-gray-400">{emp.employeeId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-800">{emp.designation}</span>
                                                <span className="text-xs text-gray-500">{emp.department}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">{emp.type}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                            {emp.contact}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(emp.status)}`}>
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-600 inline-block transition-colors" />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                        No employees found matching filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View (Hidden on Desktop) */}
                <div className="md:hidden grid grid-cols-1 gap-4">
                    {filteredEmployees.length > 0 ? (
                        filteredEmployees.map(emp => (
                            <EmployeeCard key={emp.id} employee={emp} onClick={() => navigate(`/staff/employees/${emp.id}`)} getStatusColor={getStatusColor} />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                            <User size={48} className="mb-4 opacity-20" />
                            <p className="text-sm font-medium">No employees found.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

// --- SUB COMPONENT (Mobile Card) ---
const EmployeeCard = ({ employee, onClick, getStatusColor }) => {
    const isTransport = employee.department === 'Transport';

    return (
        <div
            onClick={onClick}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm active:scale-[0.99] transition-transform"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isTransport ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                        {isTransport ? <Truck size={18} /> : employee.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm">{employee.name}</h3>
                        <p className="text-xs text-gray-500">{employee.employeeId}</p>
                    </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(employee.status)}`}>
                    {employee.status}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-50">
                <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Designation</span>
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                        <Briefcase size={12} className="text-indigo-500" /> {employee.designation}
                    </span>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Department</span>
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                        <MapPin size={12} className="text-indigo-500" /> {employee.department}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Employees;
