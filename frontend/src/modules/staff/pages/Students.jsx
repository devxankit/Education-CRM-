
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Download, ChevronRight, User, CheckCircle2 } from 'lucide-react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { useStaffStore } from '../../../store/staffStore';
import toast from 'react-hot-toast';

const StaffStudentsPage = () => {
    const navigate = useNavigate();
    const students = useStaffStore(state => state.students);
    const fetchStudents = useStaffStore(state => state.fetchStudents);
    const { user } = useStaffAuth();
    const currentRole = user?.role || STAFF_ROLES.FRONT_DESK;

    const canManage = [STAFF_ROLES.DATA_ENTRY, STAFF_ROLES.PRINCIPAL, STAFF_ROLES.FRONT_DESK, STAFF_ROLES.ADMIN].includes(user?.role);

    const handleApprove = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Activate this student record?")) return;

        const loadingToast = toast.loading("Updating status...");
        try {
            await useStaffStore.getState().updateStudent(id, { status: 'active' });
            toast.success("Student activated successfully!", { id: loadingToast });
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status", { id: loadingToast });
        }
    };

    // Fetch real students from API
    React.useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('All');

    // 1. Filtering Logic
    const filteredStudents = students.filter(student => {
        const firstName = student?.firstName || '';
        const lastName = student?.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();
        const id = student?.admissionNo || student?.id || student?._id || '';
        const className = student?.classId?.name || '';

        const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesClass = filterClass === 'All' || className === filterClass;
        return matchesSearch && matchesClass;
    });

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'active': return 'bg-emerald-100 text-emerald-700';
            case 'inactive': return 'bg-gray-100 text-gray-500';
            case 'pending':
            case 'in_review': return 'bg-amber-100 text-amber-700';
            case 'alumni': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-500';
        }
    };

    // Get unique classes for filter
    const uniqueClasses = ['All', ...new Set(students.map(s => s.classId?.name).filter(Boolean))];

    return (
        <div className="max-w-6xl mx-auto pb-24 md:pb-12 min-h-screen relative px-4 sm:px-6 lg:px-8 pt-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-8 overflow-hidden bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Active Students</h1>
                    <p className="text-sm text-gray-500 font-medium">{filteredStudents.length} Students Records found</p>
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
            <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search student name or admission number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-200 transition-all shadow-inner"
                    />
                </div>
                <div className="relative min-w-[180px]">
                    <select
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-4 pr-10 text-sm font-black text-gray-700 outline-none transition-all focus:bg-white focus:border-indigo-200 shadow-inner"
                    >
                        {uniqueClasses.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>
                    <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
            </div>

            {/* List View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
                        <User className="mx-auto text-gray-200 mb-4" size={56} />
                        <h3 className="text-lg font-bold text-gray-800">No students found</h3>
                        <p className="text-sm text-gray-400 font-medium mt-1">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    filteredStudents.map(student => (
                        <div
                            key={student.id}
                            onClick={() => navigate(`/staff/students/${student.id}`)}
                            className="group bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-300 cursor-pointer active:scale-[0.98]"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-gray-100 p-1 group-hover:border-indigo-200 transition-colors">
                                    <div className="w-full h-full rounded-xl overflow-hidden bg-indigo-50 flex items-center justify-center">
                                        {student?.documents?.photo?.url ? (
                                            <img
                                                src={student.documents.photo.url}
                                                alt={student.firstName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-indigo-600 font-black text-lg">
                                                {student?.firstName?.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${getStatusColor(student.status)} shadow-sm`}>
                                        {student.status || 'Active'}
                                    </span>
                                    {canManage && (student.status === 'in_review' || student.status === 'pending') && (
                                        <button
                                            onClick={(e) => handleApprove(e, student.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-wider shadow-sm active:scale-95"
                                        >
                                            <CheckCircle2 size={12} />
                                            Activate
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-base font-black text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
                                    {student?.firstName} {student?.lastName}
                                </h3>

                                <div className="flex flex-wrap gap-2 mt-3">
                                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">ID:</span>
                                        <span className="text-[10px] font-black text-gray-700">{student.admissionNo || student.id}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">CLS:</span>
                                        <span className="text-[10px] font-black text-gray-700">{student.classId?.name || 'NA'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-400 group-hover:text-indigo-500 transition-colors">View full profile</span>
                                <ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StaffStudentsPage;
