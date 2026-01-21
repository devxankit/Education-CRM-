
import React, { useState } from 'react';
import { Plus, Settings } from 'lucide-react';

// Components
import DepartmentList from './components/DepartmentList';
import DepartmentForm from './components/DepartmentForm';

const Departments = () => {

    // Mock Data
    const [departments, setDepartments] = useState([
        {
            id: 1,
            name: 'Administration',
            code: 'DEPT-001',
            type: 'Administrative',
            status: 'Active',
            employeeCount: 12,
            designationsCount: 4,
            designations: [
                { id: 101, name: 'Principal', code: 'DES-PRI', level: 1, reportsTo: 'Board', status: 'Active', employeeCount: 1 },
                { id: 102, name: 'Registrar', code: 'DES-REG', level: 2, reportsTo: 'Principal', status: 'Active', employeeCount: 1 },
                { id: 103, name: 'Accountant', code: 'DES-ACC', level: 3, reportsTo: 'Registrar', status: 'Active', employeeCount: 2 },
            ]
        },
        {
            id: 2,
            name: 'Science Department',
            code: 'DEPT-SCI',
            type: 'Academic',
            status: 'Active',
            employeeCount: 25,
            designationsCount: 3,
            designations: [
                { id: 201, name: 'HOD Science', code: 'DES-HOD-SCI', level: 2, reportsTo: 'Principal', status: 'Active', employeeCount: 1 },
                { id: 202, name: 'Senior Lecturer', code: 'DES-LEC-SR', level: 3, reportsTo: 'HOD Science', status: 'Active', employeeCount: 8 },
                { id: 203, name: 'Lab Assistant', code: 'DES-LAB', level: 4, reportsTo: 'HOD Science', status: 'Active', employeeCount: 3 },
            ]
        },
        {
            id: 3,
            name: 'Transport',
            code: 'DEPT-TRN',
            type: 'Operations',
            status: 'Active',
            employeeCount: 15,
            designationsCount: 2,
            designations: [
                { id: 301, name: 'Transport Manager', code: 'DES-TRN-MGR', level: 3, reportsTo: 'Registrar', status: 'Active', employeeCount: 1 },
                { id: 302, name: 'Driver', code: 'DES-DRV', level: 5, reportsTo: 'Transport Manager', status: 'Active', employeeCount: 14 },
            ]
        }
    ]);

    const [selectedDept, setSelectedDept] = useState(departments[0]);
    const [isCreating, setIsCreating] = useState(false);

    // Handlers
    const handleSelect = (dept) => {
        setSelectedDept(dept);
        setIsCreating(false);
    };

    const handleCreateNew = () => {
        setIsCreating(true);
        setSelectedDept(null);
    };

    const handleSave = (formData) => {
        if (selectedDept) {
            // Update
            setDepartments(prev => prev.map(d => d.id === selectedDept.id ? {
                ...formData,
                id: d.id,
                designationsCount: formData.designations.length
            } : d));
            setSelectedDept({ ...formData, id: selectedDept.id }); // Update view
        } else {
            // Create
            const newId = Date.now();
            const newDept = {
                ...formData,
                id: newId,
                employeeCount: 0,
                designationsCount: formData.designations.length
            };
            setDepartments(prev => [...prev, newDept]);
            setSelectedDept(newDept);
            setIsCreating(false);
        }
    };

    return (
        <div className="h-full flex flex-col pb-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Organization Structure</h1>
                    <p className="text-gray-500 text-sm">Define departments, reporting hierarchy, and job designations.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:text-indigo-600 shadow-sm">
                        <Settings size={18} />
                    </button>
                    <button
                        onClick={handleCreateNew}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg font-medium transition-all"
                    >
                        <Plus size={18} /> Add Department
                    </button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-hidden">

                {/* Left Listing */}
                <div className="col-span-12 md:col-span-4 lg:col-span-3">
                    <DepartmentList
                        departments={departments}
                        selectedId={isCreating ? null : selectedDept?.id}
                        onSelect={handleSelect}
                        onAdd={handleCreateNew}
                    />
                </div>

                {/* Right Details/Form */}
                <div className="col-span-12 md:col-span-8 lg:col-span-9 h-full">
                    {/* If Creating or Selected, show Form */}
                    {(selectedDept || isCreating) ? (
                        <DepartmentForm
                            department={selectedDept}
                            onSave={handleSave}
                        />
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center h-full text-center p-6 text-gray-400">
                            <p>Select a department to verify structure.</p>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
};

export default Departments;
