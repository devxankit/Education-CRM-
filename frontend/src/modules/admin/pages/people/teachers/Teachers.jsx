
import React, { useState, useMemo, useCallback } from 'react';
import { Filter, Download, Search } from 'lucide-react';
import { useAdminStore } from '../../../../../store/adminStore';

// Components
import TeacherTable from './components/TeacherTable';
import TeacherProfileDrawer from './components/TeacherProfileDrawer';

const Teachers = () => {
    const teachers = useAdminStore(state => state.teachers);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Handlers
    const handleView = (teacher) => {
        setSelectedTeacher(teacher);
        setIsDrawerOpen(true);
    };

    const handleClose = () => {
        setIsDrawerOpen(false);
        setSelectedTeacher(null);
    };

    // Filter Logic
    const filteredTeachers = teachers.filter(t => {
        const name = (t.name || `${t.firstName} ${t.lastName}`).toLowerCase();
        const code = (t.code || t.employeeId || '').toLowerCase();
        const dept = (t.department || '').toLowerCase();
        const query = searchQuery.toLowerCase();

        return name.includes(query) || code.includes(query) || dept.includes(query);
    });

    return (
        <div className="h-full flex flex-col pb-10">

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
                    {/* Note: No "Add Teacher" button here. Teachers are added via Employee Master. */}
                    <div className="bg-blue-50 text-blue-800 text-xs px-3 py-2 rounded-lg border border-blue-100 hidden md:block">
                        To add new faculty, create a 'Teacher' in <strong>Employee Directory</strong>.
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Total Faculty</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{teachers.length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Active Teaching</p>
                    <h3 className="text-2xl font-bold text-indigo-600 mt-1">{teachers.filter(t => t.teachingStatus === 'Active').length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Avg. Load</p>
                    <h3 className="text-2xl font-bold text-green-600 mt-1">18h/wk</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">On Leave</p>
                    <h3 className="text-2xl font-bold text-orange-600 mt-1">{teachers.filter(t => t.teachingStatus === 'On Leave').length}</h3>
                </div>
            </div>

            {/* Table */}
            <TeacherTable
                teachers={filteredTeachers}
                onView={handleView}
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
