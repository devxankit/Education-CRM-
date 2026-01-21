
import React, { useState } from 'react';
import { Plus, Download, Filter, Search } from 'lucide-react';

// Components
import EmployeeTable from './components/EmployeeTable';
import EmployeeProfileDrawer from './components/EmployeeProfileDrawer';

const Employees = () => {

    // Mock Data
    const [employees, setEmployees] = useState([
        { id: 1, name: 'John Doe', code: 'EMP-1023', employeeType: 'Teacher', department: 'Science', designation: 'Physics Lecturer', status: 'Active', dateOfJoining: '2022-06-15', email: 'john.d@school.edu' },
        { id: 2, name: 'Jane Smith', code: 'EMP-1100', employeeType: 'Non-Teaching', department: 'Administration', designation: 'Registrar', status: 'Active', dateOfJoining: '2021-08-01', email: 'jane.s@school.edu' },
        { id: 3, name: 'Robert Brown', code: 'EMP-2045', employeeType: 'Contract', department: 'Transport', designation: 'Bus Driver', status: 'Suspended', dateOfJoining: '2023-01-10', email: 'robert.b@school.edu' },
        { id: 4, name: 'Emily Davis', code: 'EMP-1050', employeeType: 'Teacher', department: 'Mathematics', designation: 'Math Teacher', status: 'Draft', dateOfJoining: '2024-03-01', email: 'emily.d@school.edu' },
    ]);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [viewingEmployee, setViewingEmployee] = useState(null); // If null but isDrawerOpen=true, then it's CREATE mode
    const [searchQuery, setSearchQuery] = useState('');

    // Handlers
    const handleAdd = () => {
        setViewingEmployee(null); // New
        setIsDrawerOpen(true);
    };

    const handleView = (emp) => {
        setViewingEmployee(emp);
        setIsDrawerOpen(true);
    };

    const handleSave = (empData) => {
        if (viewingEmployee) {
            // Update
            // Logic for update would go here
        } else {
            // Create
            const newId = Date.now();
            setEmployees(prev => [...prev, { ...empData, id: newId }]);
        }
        setIsDrawerOpen(false);
    };

    const handleClose = () => {
        setIsDrawerOpen(false);
        setViewingEmployee(null);
    };

    // Filter Logic
    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Employee Directory</h1>
                    <p className="text-gray-500 text-sm">Manage official staff records, assignments, and lifecycle status.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:text-indigo-600 shadow-sm">
                        <Filter size={18} />
                    </button>
                    <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:text-indigo-600 shadow-sm">
                        <Download size={18} />
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg font-medium transition-all"
                    >
                        <Plus size={18} /> Add Employee
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Total Workforce</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{employees.length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Teaching Staff</p>
                    <h3 className="text-2xl font-bold text-indigo-600 mt-1">{employees.filter(e => e.employeeType === 'Teacher').length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Active</p>
                    <h3 className="text-2xl font-bold text-green-600 mt-1">{employees.filter(e => e.status === 'Active').length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">On Leave</p>
                    <h3 className="text-2xl font-bold text-orange-600 mt-1">2</h3>
                </div>
            </div>

            {/* Table */}
            <EmployeeTable
                employees={filteredEmployees}
                onView={handleView}
            />

            {/* Detail Drawer / Profile */}
            <EmployeeProfileDrawer
                isOpen={isDrawerOpen}
                onClose={handleClose}
                employee={viewingEmployee}
                isNew={!viewingEmployee}
                onSave={handleSave}
            />

        </div>
    );
};

export default Employees;
