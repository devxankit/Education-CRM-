import React, { useState, useEffect, useCallback } from 'react';
import { Filter, Download, Search, UserPlus } from 'lucide-react';
import { useAdminStore } from '../../../../../store/adminStore';

// Components
import TeacherTable from './components/TeacherTable';
import TeacherProfileDrawer from './components/TeacherProfileDrawer';
import CreateTeacherModal from './components/CreateTeacherModal';
import { API_URL } from '../../../../../app/api';

const Teachers = () => {
    const teachers = useAdminStore(state => state.teachers);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [roles, setRoles] = useState([]);
    const [branches, setBranches] = useState([]);
    const [fetching, setFetching] = useState(false);

    // Fetch dependencies for creation
    const fetchDependencies = useCallback(async () => {
        setFetching(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [rolesRes, branchesRes] = await Promise.all([
                fetch(`${API_URL}/role`, { headers }),
                fetch(`${API_URL}/branch`, { headers })
            ]);

            const rolesData = await rolesRes.json();
            const branchesData = await branchesRes.json();

            if (rolesData.success) setRoles(rolesData.data);
            if (branchesData.success) setBranches(branchesData.data);
        } catch (error) {
            console.error('Error fetching dependencies:', error);
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => {
        fetchDependencies();
    }, [fetchDependencies]);

    // Handlers
    const handleView = (teacher) => {
        setSelectedTeacher(teacher);
        setIsDrawerOpen(true);
    };

    const handleClose = () => {
        setIsDrawerOpen(false);
        setSelectedTeacher(null);
    };

    const handleCreateTeacher = (data) => {
        console.log('Teacher to create:', data);
        // Backend integration would go here
        alert('Frontend only: Teacher data captured. Connect backend to save.');
        setIsCreateModalOpen(false);
    };

    // Filter Logic
    const filteredTeachers = teachers.filter(t => {
        const firstName = t.firstName || '';
        const lastName = t.lastName || '';
        const nameAttr = t.name || '';
        const name = (nameAttr || `${firstName} ${lastName}`).toLowerCase();
        const code = (t.code || t.employeeId || '').toLowerCase();
        const dept = (t.department || '').toLowerCase();
        const query = searchQuery.toLowerCase();

        return name.includes(query) || code.includes(query) || dept.includes(query);
    });

    return (
        <div className="h-full flex flex-col pb-10 font-['Inter']">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Faculty Management</h1>
                    <p className="text-gray-500 text-sm">Manage academic profiles, subject eligibility, and teaching roles.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search faculty..."
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
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium text-sm shadow-md"
                    >
                        <UserPlus size={18} /> Add Teacher
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Total Faculty</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{teachers.length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Active Teaching</p>
                    <h3 className="text-2xl font-bold text-indigo-600 mt-1">{teachers.filter(t => t.teachingStatus === 'Active').length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Avg. Load</p>
                    <h3 className="text-2xl font-bold text-green-600 mt-1">18h/wk</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-semibold text-gray-500 uppercase">On Leave</p>
                    <h3 className="text-2xl font-bold text-orange-600 mt-1">{teachers.filter(t => t.teachingStatus === 'On Leave').length}</h3>
                </div>
            </div>

            {/* Table */}
            <TeacherTable
                teachers={filteredTeachers}
                onView={handleView}
            />

            {/* Modals */}
            <CreateTeacherModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateTeacher}
                roles={roles}
                branches={branches}
            />

            {/* Detail Drawer */}
            <TeacherProfileDrawer
                isOpen={isDrawerOpen}
                onClose={handleClose}
                teacher={selectedTeacher}
            />

        </div>
    );
};

export default Teachers;

