import React, { useState, useEffect } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Briefcase, User, MoreVertical, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { useStaffStore } from '../../../store/staffStore';

const Teachers = () => {
    const { user } = useStaffAuth();
    const navigate = useNavigate();
    const teachers = useStaffStore(state => state.teachers);
    const fetchTeachers = useStaffStore(state => state.fetchTeachers);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All'); // All | Permanent | Contract

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    // Only DATA_ENTRY can add teachers
    const canAddTeacher = user?.role === STAFF_ROLES.DATA_ENTRY;

    // Filter logic
    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || teacher.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="max-w-7xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 pt-5 pb-3 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Teachers Registry</h1>
                        <p className="text-xs text-gray-500">Manage faculty records and profiles</p>
                    </div>
                    {canAddTeacher && (
                        <button
                            onClick={() => navigate('/staff/teachers/new')}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm active:scale-95"
                        >
                            <Plus size={16} /> Add Teacher
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex gap-2 items-center">
                    <div className="relative flex-1 md:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
                        {['All', 'Permanent', 'Contract'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterType === type ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content List */}
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeachers.length > 0 ? (
                    filteredTeachers.map(teacher => (
                        <TeacherCard key={teacher.id} teacher={teacher} onClick={() => navigate(`/staff/teachers/${teacher.id}`)} />
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-gray-400">
                        <User size={48} className="mb-4 opacity-20" />
                        <p className="text-sm font-medium">No teachers found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- SUB COMPONENTS ---

const TeacherCard = ({ teacher, onClick }) => {
    const isLeave = teacher.status === 'On Leave';

    return (
        <div
            onClick={onClick}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden active:scale-[0.99]"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                        {teacher.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{teacher.name}</h3>
                        <p className="text-xs text-gray-500">{teacher.employeeId}</p>
                    </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isLeave ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                    {teacher.status}
                </span>
            </div>

            <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-gray-400 shrink-0" />
                    <p className="text-xs text-gray-600 truncate">{teacher.subjects.join(', ')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-gray-400 shrink-0" />
                    <p className="text-xs text-gray-600">{teacher.type} Staff</p>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400 shrink-0" />
                    <p className="text-xs text-gray-600">Joined: {teacher.doj}</p>
                </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-end">
                <span className="text-xs font-bold text-gray-400 flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
                    View Profile <Plus size={12} />
                </span>
            </div>
        </div>
    );
};

export default Teachers;
