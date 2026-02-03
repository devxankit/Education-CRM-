
import React, { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../../../../store/adminStore';

// Components
import StudentStatsCards from './components/StudentStatsCards';
import StudentFilters from './components/StudentFilters';
import StudentTable from './components/StudentTable';

const StudentList = () => {
    const navigate = useNavigate();
    const fetchStudents = useAdminStore(state => state.fetchStudents);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    return (
        <div className="h-full flex flex-col pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Student Management</h1>
                    <p className="text-gray-500 text-sm">Manage student profiles, admissions, and academic records.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/people/students/add')}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg font-medium transition-all"
                    >
                        <Plus size={18} /> New Admission
                    </button>
                </div>
            </div>

            {/* Stats */}
            <StudentStatsCards />

            {/* Filters */}
            <StudentFilters />

            {/* Table */}
            <StudentTable />

        </div>
    );
};

export default StudentList;
