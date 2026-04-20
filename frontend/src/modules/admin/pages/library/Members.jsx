import React, { useState, useEffect, useMemo } from 'react';
import { UserPlus, Search, Filter, Mail, Phone, CreditCard, Shield, Clock, Users as UsersIcon, Building2, User } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';

const LibraryMembers = () => {
    const { 
        libraryMembers, fetchLibraryMembers,
        branches, fetchBranches,
        addLibraryMember,
        academicYears, fetchAcademicYears,
        students, fetchStudents
    } = useAdminStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [branchId, setBranchId] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    
    const [newMember, setNewMember] = useState({
        memberType: 'student',
        studentId: '',
        teacherId: '',
        libraryCardNo: '',
        maxBooksAllowed: 2,
        branchId: '',
        academicYearId: ''
    });

    // We might need to fetch students/teachers for the dropdowns
    // For now I'll focus on the list view

    useEffect(() => {
        fetchBranches();
        fetchAcademicYears();
    }, [fetchBranches, fetchAcademicYears]);

    useEffect(() => {
        if (newMember.branchId && newMember.academicYearId && newMember.memberType === 'student') {
            fetchStudents({ branchId: newMember.branchId, academicYearId: newMember.academicYearId });
        }
    }, [newMember.branchId, newMember.academicYearId, newMember.memberType, fetchStudents]);

    useEffect(() => {
        if (branchId) {
            fetchLibraryMembers({ branchId });
        }
    }, [branchId, fetchLibraryMembers]);

    const filteredMembers = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return libraryMembers.filter(m => {
            const name = m.memberType === 'student' 
                ? `${m.studentId?.firstName} ${m.studentId?.lastName}` 
                : `${m.teacherId?.firstName} ${m.teacherId?.lastName}`;
            return name.toLowerCase().includes(lowerSearch) || m.libraryCardNo.toLowerCase().includes(lowerSearch);
        });
    }, [libraryMembers, searchTerm]);

    return (
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Library Members</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage library memberships for students and staff.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
                >
                    <UserPlus size={18} /> Register New Member
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or card number..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-emerald-500 transition-all outline-none text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64">
                    <select 
                        value={branchId}
                        onChange={(e) => setBranchId(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-emerald-500 transition-all outline-none text-sm font-semibold"
                    >
                        <option value="">Select Branch</option>
                        {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Members View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => {
                        const name = member.memberType === 'student' 
                            ? `${member.studentId?.firstName} ${member.studentId?.lastName}` 
                            : `${member.teacherId?.firstName} ${member.teacherId?.lastName}`;
                        const subInfo = member.memberType === 'student' 
                            ? `Roll No: ${member.studentId?.rollNo || 'N/A'}` 
                            : `Emp ID: ${member.teacherId?.employeeId || 'N/A'}`;

                        return (
                            <div key={member._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${member.memberType === 'student' ? 'bg-indigo-600' : 'bg-amber-600'}`}></div>
                                
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${member.memberType === 'student' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-lg font-bold text-gray-900 line-clamp-1">{name}</div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{member.memberType} • {subInfo}</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                        <CreditCard size={16} className="text-gray-400" />
                                        <span className="font-bold">Card: #{member.libraryCardNo}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                            <Shield size={14} className="text-emerald-500" />
                                            Active Member
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                            <Clock size={14} className="text-indigo-500" />
                                            Limit: {member.maxBooksAllowed} Books
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-2 pt-4 border-t border-gray-50">
                                    <button className="flex-1 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">ISSUE HISTORY</button>
                                    <button className="px-3 py-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all border border-transparent">
                                        <Mail size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-20 text-center space-y-4">
                        <UsersIcon size={48} className="mx-auto text-gray-200" />
                        <div className="text-gray-400 font-medium font-['Poppins']">No library members found for this criteria.</div>
                    </div>
                )}
            </div>

            {/* Register Member Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-gray-100">
                        <div className="px-10 py-8 bg-emerald-600 text-white flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">New Library Membership</h3>
                                <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mt-1">Register student or staff member</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors font-black">X</button>
                        </div>
                        
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            if (!newMember.branchId) return alert('Please select a branch');
                            await addLibraryMember(newMember);
                            setShowAddModal(false);
                            setNewMember({ memberType: 'student', studentId: '', teacherId: '', libraryCardNo: '', maxBooksAllowed: 2, branchId: '' });
                        }} className="p-10 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assigned Branch</label>
                                    <select 
                                        required
                                        value={newMember.branchId}
                                        onChange={e => setNewMember({...newMember, branchId: e.target.value})}
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 transition-all outline-none rounded-[20px] text-sm font-bold shadow-inner"
                                    >
                                        <option value="">Choose Branch</option>
                                        {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Academic Year</label>
                                    <select 
                                        required
                                        value={newMember.academicYearId}
                                        onChange={e => setNewMember({...newMember, academicYearId: e.target.value})}
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 transition-all outline-none rounded-[20px] text-sm font-bold shadow-inner"
                                    >
                                        <option value="">Year...</option>
                                        {academicYears.map(y => <option key={y._id} value={y._id}>{y.year}</option>)}
                                    </select>
                                </div>

                                <div className="col-span-2 flex p-1.5 bg-gray-100 rounded-2xl">
                                    <button 
                                        type="button"
                                        onClick={() => setNewMember({...newMember, memberType: 'student', teacherId: ''})}
                                        className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${newMember.memberType === 'student' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                                    >Student</button>
                                    <button 
                                        type="button"
                                        onClick={() => setNewMember({...newMember, memberType: 'teacher', studentId: ''})}
                                        className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${newMember.memberType === 'teacher' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                                    >Teacher</button>
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select {newMember.memberType === 'student' ? 'Student' : 'Teacher'}</label>
                                    {newMember.memberType === 'student' ? (
                                        <select 
                                            required
                                            value={newMember.studentId}
                                            onChange={e => setNewMember({...newMember, studentId: e.target.value})}
                                            className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 transition-all outline-none rounded-[20px] text-sm font-bold shadow-inner"
                                        >
                                            <option value="">Choose Student</option>
                                            {students.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.admissionNo})</option>)}
                                        </select>
                                    ) : (
                                        <input 
                                            required
                                            placeholder="Enter Employee ID"
                                            className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 transition-all outline-none rounded-[20px] text-sm font-bold shadow-inner"
                                            value={newMember.teacherId}
                                            onChange={e => setNewMember({...newMember, teacherId: e.target.value})}
                                        />
                                    )}
                                    <p className="text-[9px] text-gray-400 font-bold ml-1 uppercase">
                                        {newMember.memberType === 'student' 
                                            ? `* ${students.length} students found in this branch & year` 
                                            : `* Enter valid Employee ID for teacher`}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Library Card No</label>
                                    <input 
                                        required
                                        placeholder="e.g. LIB-1001"
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 transition-all outline-none rounded-[20px] text-sm font-bold shadow-inner"
                                        value={newMember.libraryCardNo}
                                        onChange={e => setNewMember({...newMember, libraryCardNo: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Books Limit</label>
                                    <input 
                                        type="number"
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 transition-all outline-none rounded-[20px] text-sm font-bold shadow-inner"
                                        value={newMember.maxBooksAllowed}
                                        onChange={e => setNewMember({...newMember, maxBooksAllowed: parseInt(e.target.value)})}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-8 py-4 bg-gray-100 text-gray-500 rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all">Cancel</button>
                                <button type="submit" className="flex-1 px-8 py-4 bg-emerald-600 text-white rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100">Confirm Registration</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LibraryMembers;
