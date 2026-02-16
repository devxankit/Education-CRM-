import React, { useState, useEffect, useCallback } from 'react';
import { Filter, Download, Search, UserPlus, Loader2, GraduationCap, School } from 'lucide-react';

// Components
import TeacherTable from './components/TeacherTable';
import TeacherProfileDrawer from './components/TeacherProfileDrawer';
import CreateTeacherModal from './components/CreateTeacherModal';
import EditTeacherModal from './components/EditTeacherModal';
import { API_URL } from '@/app/api';

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
                fetch(`${API_URL}/branch?activeOnly=true`, { headers })
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

    const handleEditTeacher = async (id, formData) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/teacher/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                alert('Teacher updated successfully!');
                fetchAllData(); // Refresh list
                setIsEditModalOpen(false);
                setIsDrawerOpen(false);
            } else {
                alert(data.message || 'Failed to update teacher');
            }
        } catch (error) {
            console.error('Error updating teacher:', error);
            alert('An error occurred while updating teacher');
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
                    <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">Faculty Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage academic profiles, subject eligibility, and teaching roles.</p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative flex-1 md:flex-none min-w-[200px] md:min-w-[280px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or department..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all"
                        />
                    </div>
                    <button 
                        className="p-2.5 border border-gray-300 rounded-lg bg-white text-gray-600 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition-all hover:bg-indigo-50"
                        title="Filter"
                    >
                        <Filter size={18} />
                    </button>
                    <button 
                        className="p-2.5 border border-gray-300 rounded-lg bg-white text-gray-600 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition-all hover:bg-indigo-50"
                        title="Export"
                    >
                        <Download size={18} />
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium text-sm shadow-md hover:shadow-lg active:scale-95"
                    >
                        <UserPlus size={18} /> Add Teacher
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl border border-indigo-200 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">Total Faculty</p>
                            <h3 className="text-3xl font-black text-indigo-900">{teachers.length}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center">
                            <UserPlus size={24} className="text-indigo-700" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">Active Teaching</p>
                            <h3 className="text-3xl font-black text-green-900">{teachers.filter(t => t.teachingStatus === 'Active' || !t.teachingStatus).length}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
                            <GraduationCap size={24} className="text-green-700" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">Subjects Assigned</p>
                            <h3 className="text-3xl font-black text-blue-900">
                                {teachers.reduce((sum, t) => sum + (t.eligibleSubjectsCount || 0), 0)}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                            <School size={24} className="text-blue-700" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1">On Leave</p>
                            <h3 className="text-3xl font-black text-orange-900">{teachers.filter(t => t.teachingStatus === 'On Leave').length}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center">
                            <Filter size={24} className="text-orange-700" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <TeacherTable
                teachers={filteredTeachers}
                onView={handleView}
                searchQuery={searchQuery}
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

            <EditTeacherModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                teacher={selectedTeacher}
                onSave={handleEditTeacher}
                branches={branches}
                loading={loading}
            />

            {/* Detail Drawer */}
            <TeacherProfileDrawer
                isOpen={isDrawerOpen}
                onClose={handleClose}
                teacher={selectedTeacher}
                onEdit={(teacher) => {
                    setSelectedTeacher(teacher);
                    setIsEditModalOpen(true);
                }}
            />

        </div>
    );
};

export default Teachers;
