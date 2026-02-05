
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Download, ChevronRight, User } from 'lucide-react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { useStaffStore } from '../../../store/staffStore';

const StaffStudentsPage = () => {
    const navigate = useNavigate();
    const students = useStaffStore(state => state.students);
    const fetchStudents = useStaffStore(state => state.fetchStudents);
    const { user } = useStaffAuth();
    const currentRole = user?.role || STAFF_ROLES.FRONT_DESK;

    // Fetch real students from API
    React.useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('All');

    // 1. Filtering Logic
    const filteredStudents = students.filter(student => {
        const name = student?.name || '';
        const id = student?.id || student?._id || '';

        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesClass = filterClass === 'All' || student.class === filterClass;
        return matchesSearch && matchesClass;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-100 text-emerald-700';
            case 'Inactive': return 'bg-gray-100 text-gray-500';
            default: return 'bg-gray-100 text-gray-500';
        }
    };

    return (
        <div className="max-w-md mx-auto pb-24 md:pb-6 min-h-screen relative">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Students</h1>
                    <p className="text-xs text-gray-500">{filteredStudents.length} Records Found</p>
                </div>
                {(currentRole === STAFF_ROLES.FRONT_DESK || currentRole === STAFF_ROLES.DATA_ENTRY) && (
                    <button
                        onClick={() => navigate('/staff/students/new')}
                        className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                    >
                        <Plus size={20} />
                    </button>
                )}
            </div>

            {/* Compact Search & Filter */}
            <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="relative">
                    <select
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-8 text-sm font-bold text-gray-600 outline-none w-24"
                    >
                        <option value="All">All</option>
                        <option value="X-A">X-A</option>
                        <option value="IX-B">IX-B</option>
                        <option value="XI-C">XI-C</option>
                    </select>
                    <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>
            </div>

            {/* List View (No Table) */}
            <div className="space-y-3">
                {filteredStudents.map(student => (
                    <div
                        key={student.id}
                        onClick={() => navigate(`/staff/students/${student.id}`)}
                        className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm active:scale-[0.99] transition-transform flex items-center justify-between cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">
                                {student?.name ? student.name.charAt(0) : '?'}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">{student?.name || 'Unknown Student'}</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-bold bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-100">{student.id}</span>
                                    <span className="text-[10px] text-gray-400">• {student.class}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getStatusColor(student.status)}`}>
                                {student.status}
                            </span>
                            <ChevronRight size={16} className="text-gray-300" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaffStudentsPage;
