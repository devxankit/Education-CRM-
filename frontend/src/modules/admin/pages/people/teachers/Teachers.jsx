import React, { useState, useEffect, useCallback } from 'react';
import { Filter, Download, Search, UserPlus, Loader2 } from 'lucide-react';

// Components
import TeacherTable from './components/TeacherTable';
import TeacherProfileDrawer from './components/TeacherProfileDrawer';
import CreateTeacherModal from './components/CreateTeacherModal';
import { API_URL } from '../../../../../app/api';

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [roles, setRoles] = useState([]);
    const [branches, setBranches] = useState([]);

    // Fetch All Data (Teachers, Roles, Branches)
    const fetchAllData = useCallback(async () => {
        setFetching(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [teachersRes, rolesRes, branchesRes] = await Promise.all([
                fetch(`${API_URL}/teacher`, { headers }),
                fetch(`${API_URL}/role`, { headers }),
                fetch(`${API_URL}/branch`, { headers })
            ]);

            const [teachersData, rolesData, branchesData] = await Promise.all([
                teachersRes.json(),
                rolesRes.json(),
                branchesRes.json()
            ]);

            if (teachersData.success) {
                // Transform data for the table and drawer
                const transformed = teachersData.data.map(t => ({
                    ...t,
                    id: t._id,
                    name: `${t.firstName || ''} ${t.lastName || ''}`.trim() || 'No Name',
                    code: t.employeeId || 'No ID',
                    // UI Defaults for fields not present in basic model but used in components
                    academicLevel: t.academicLevel || 'N/A',
                    eligibleSubjectsCount: t.eligibleSubjectsCount || 0,
                    department: t.department || 'General',
                    designation: t.designation || 'Teacher'
                }));
                setTeachers(transformed);
            }
            if (rolesData.success) setRoles(rolesData.data);
            if (branchesData.success) setBranches(branchesData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // Handlers
    const handleView = (teacher) => {
        setSelectedTeacher(teacher);
        setIsDrawerOpen(true);
    };

    const handleClose = () => {
        setIsDrawerOpen(false);
        setSelectedTeacher(null);
    };

    const handleCreateTeacher = async (formData) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/teacher`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                alert('Teacher added successfully!');
                fetchAllData(); // Refresh list
                setIsCreateModalOpen(false);
            } else {
                alert(data.message || 'Failed to add teacher');
            }
        } catch (error) {
            console.error('Error creating teacher:', error);
            alert('An error occurred while adding teacher');
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredTeachers = teachers.filter(t => {
        const name = (t.name || '').toLowerCase();
        const code = (t.code || '').toLowerCase();
        const dept = (t.department || '').toLowerCase();
        const query = searchQuery.toLowerCase();

        return name.includes(query) || code.includes(query) || dept.includes(query);
    });

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 font-['Inter']">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                <p className="text-gray-500 font-medium italic">Loading Faculty Records...</p>
            </div>
        );
    }

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
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-64 shadow-sm"
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:text-indigo-600 shadow-sm transition-all hover:bg-gray-50">
                        <Filter size={18} />
                    </button>
                    <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:text-indigo-600 shadow-sm transition-all hover:bg-gray-50">
                        <Download size={18} />
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium text-sm shadow-md active:scale-95"
                    >
                        <UserPlus size={18} /> Add Teacher
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Faculty</p>
                    <h3 className="text-2xl font-black text-gray-900 mt-1">{teachers.length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Teaching</p>
                    <h3 className="text-2xl font-black text-indigo-600 mt-1">{teachers.filter(t => t.teachingStatus === 'Active').length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg. Load</p>
                    <h3 className="text-2xl font-black text-green-600 mt-1">
                        {teachers.length > 0 ? '0h/wk' : '0h/wk'}
                    </h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">On Leave</p>
                    <h3 className="text-2xl font-black text-orange-600 mt-1">{teachers.filter(t => t.teachingStatus === 'On Leave').length}</h3>
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
                loading={loading}
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
