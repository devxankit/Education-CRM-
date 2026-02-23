import React, { useState, useEffect, useCallback } from 'react';
import { Filter, Download, Search, UserPlus, Loader2, GraduationCap, School, CalendarOff } from 'lucide-react';

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
                    academicLevel: t.academicLevel || 'N/A',
                    eligibleSubjectsCount: t.eligibleSubjectsCount ?? (t.eligibleSubjects?.length ?? 0),
                    eligibleSubjectsDisplay: t.eligibleSubjects?.length ?? t.eligibleSubjectsCount ?? 0,
                    department: t.department || t.roleId?.name || 'General',
                    designation: t.designation || 'Teacher',
                    teachingStatus: t.teachingStatus || t.status || 'Active'
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

            {/* Header - compact for 100% zoom */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Faculty Management</h1>
                    <p className="text-gray-500 text-xs mt-0.5">Manage academic profiles, subject eligibility, and teaching roles.</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative flex-1 md:flex-none min-w-[160px] md:min-w-[220px]">
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or department..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
                        />
                    </div>
                    <button className="p-2 border border-gray-300 rounded-lg bg-white text-gray-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50" title="Filter">
                        <Filter size={16} />
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg bg-white text-gray-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50" title="Export">
                        <Download size={16} />
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-xs shadow-sm active:scale-95"
                    >
                        <UserPlus size={16} /> Add Teacher
                    </button>
                </div>
            </div>

            {/* Stats Overview - compact */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wider">Total Faculty</p>
                            <h3 className="text-2xl font-black text-indigo-900">{teachers.length}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center shrink-0">
                            <UserPlus size={20} className="text-indigo-700" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-semibold text-green-700 uppercase tracking-wider">Active Teaching</p>
                            <h3 className="text-2xl font-black text-green-900">{teachers.filter(t => (t.teachingStatus || t.status || 'Active') === 'Active').length}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center shrink-0">
                            <GraduationCap size={20} className="text-green-700" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider">Subjects Assigned</p>
                            <h3 className="text-2xl font-black text-blue-900">
                                {teachers.reduce((sum, t) => sum + (t.eligibleSubjectsCount ?? t.eligibleSubjects?.length ?? 0), 0)}
                            </h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center shrink-0">
                            <School size={20} className="text-blue-700" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-semibold text-orange-700 uppercase tracking-wider">On Leave</p>
                            <h3 className="text-2xl font-black text-orange-900">{teachers.filter(t => (t.teachingStatus || t.status) === 'On Leave').length}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center shrink-0">
                            <CalendarOff size={20} className="text-orange-700" />
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
