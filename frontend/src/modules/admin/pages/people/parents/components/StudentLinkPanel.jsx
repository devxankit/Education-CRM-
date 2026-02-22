
import React, { useState, useEffect, useMemo } from 'react';
import { UserPlus, Trash2, Link, AlertCircle, Loader2, Search, X, User } from 'lucide-react';
import { API_URL } from '@/app/api';
import { useAdminStore } from '../../../../../../store/adminStore';

const StudentLinkPanel = ({ parentId, branchId, academicYearId, initialLinkedStudents = [], onChange }) => {
    const students = useAdminStore(state => state.students);
    const fetchStudents = useAdminStore(state => state.fetchStudents);

    const [linkedStudents, setLinkedStudents] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    // Sync local state with initialLinkedStudents when they change (prop updates)
    useEffect(() => {
        if (initialLinkedStudents && initialLinkedStudents.length > 0) {
            setLinkedStudents(initialLinkedStudents);
        }
    }, [initialLinkedStudents]);

    // Fetch linked students from API if we have a parentId and no initial data
    useEffect(() => {
        const loadLinkedStudents = async () => {
            if (!parentId || (initialLinkedStudents && initialLinkedStudents.length > 0)) {
                setFetching(false);
                return;
            }

            setFetching(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/parent/${parentId}/linked-students`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    const fetchedList = data.data || [];
                    setLinkedStudents(fetchedList);
                    if (onChange) onChange(fetchedList);
                }
            } catch (error) {
                console.error('Error fetching linked students:', error);
            } finally {
                setFetching(false);
            }
        };

        loadLinkedStudents();
    }, [parentId]);

    // Fetch students for search - filter by branch + academic year when available
    useEffect(() => {
        if (branchId) {
            fetchStudents({ branchId, academicYearId: academicYearId || undefined });
        } else {
            fetchStudents();
        }
    }, [branchId, academicYearId, fetchStudents]);

    // Filter students for the search dropdown
    const availableStudents = useMemo(() => {
        if (!searchTerm.trim()) return [];
        return students.filter(s => {
            const isAlreadyLinked = linkedStudents.some(ls => ls._id === s._id || ls.id === s._id);
            const matchesSearch =
                `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.admissionNo && s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()));
            return !isAlreadyLinked && matchesSearch;
        }).slice(0, 5); // Limit to top 5 results for cleaner UI
    }, [students, linkedStudents, searchTerm]);

    const handleSelectStudent = async (student) => {
        if (parentId) {
            // DIRECT LINK (API Call for existing parent)
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/parent/${parentId}/link-student`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ studentId: student._id })
                });

                const data = await response.json();
                if (data.success) {
                    const newLinked = [...linkedStudents, data.data];
                    setLinkedStudents(newLinked);
                    if (onChange) onChange(newLinked);
                    setSearchTerm('');
                    setIsAdding(false);
                }
            } catch (error) {
                console.error('Error linking student:', error);
            } finally {
                setLoading(false);
            }
        } else {
            // LOCAL LINK (For new/unsaved parent creation)
            const newEntry = {
                _id: student._id,
                studentName: `${student.firstName} ${student.lastName}`,
                class: `${student.classId?.name || ''}-${student.sectionId?.name || ''}`,
                admissionNo: student.admissionNo
            };
            const newLinked = [...linkedStudents, newEntry];
            setLinkedStudents(newLinked);
            if (onChange) onChange(newLinked);
            setSearchTerm('');
            setIsAdding(false);
        }
    };

    const handleUnlink = async (studentToUnlink) => {
        const studentId = studentToUnlink._id || studentToUnlink.id;

        if (parentId) {
            if (!confirm(`Unlink ${studentToUnlink.studentName || 'this student'}?`)) return;

            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/parent/${parentId}/unlink-student`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ studentId })
                });

                const data = await response.json();
                if (data.success) {
                    const newLinked = linkedStudents.filter(s => (s._id !== studentId && s.id !== studentId));
                    setLinkedStudents(newLinked);
                    if (onChange) onChange(newLinked);
                }
            } catch (error) {
                console.error('Error unlinking student:', error);
            } finally {
                setLoading(false);
            }
        } else {
            // LOCAL UNLINK
            const newLinked = linkedStudents.filter(s => (s._id !== studentId && s.id !== studentId));
            setLinkedStudents(newLinked);
            if (onChange) onChange(newLinked);
        }
    };

    return (
            <div className="space-y-4">
            {(!branchId || !academicYearId) && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    Select Branch and Academic Year above to search and link students from that year.
                </p>
            )}
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 tracking-wider">
                    <Link size={14} className="text-indigo-500" /> Linked Children
                </h4>
                {!isAdding && branchId && (
                    <button
                        type="button"
                        onClick={() => setIsAdding(true)}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-full transition-all"
                    >
                        <UserPlus size={12} /> Link Student
                    </button>
                )}
            </div>

            {/* Inline Search UI */}
            {isAdding && (
                <div className="relative animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2 p-1 bg-gray-50 border border-indigo-100 rounded-xl focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
                        <div className="pl-3 text-gray-400">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Type student name or ID..."
                            className="flex-1 bg-transparent text-sm py-2 outline-none text-gray-700 placeholder:text-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => { setIsAdding(false); setSearchTerm(''); }}
                            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-gray-600 transition-all"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Quick Results Dropdown */}
                    {searchTerm.trim() && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-xl rounded-xl z-10 overflow-hidden py-1 divide-y divide-gray-50">
                            {availableStudents.length > 0 ? (
                                availableStudents.map(student => (
                                    <button
                                        key={student._id}
                                        type="button"
                                        onClick={() => handleSelectStudent(student)}
                                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-indigo-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                {student.firstName[0]}{student.lastName[0]}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-semibold text-gray-800">{student.firstName} {student.lastName}</p>
                                                <p className="text-[10px] text-gray-500">{student.admissionNo} • {student.classId?.name}</p>
                                            </div>
                                        </div>
                                        <UserPlus size={14} className="text-indigo-400 group-hover:text-indigo-600" />
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-6 text-center text-gray-400 italic text-xs flex flex-col items-center gap-2">
                                    <AlertCircle size={20} className="text-gray-200" />
                                    No matching students found
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* List of Linked Students */}
            <div className="grid gap-2">
                {fetching ? (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-400 animate-pulse">
                        <Loader2 size={24} className="animate-spin mb-2" />
                        <span className="text-[10px] font-medium">Syncing students...</span>
                    </div>
                ) : (
                    <>
                        {linkedStudents.map((link) => (
                            <div
                                key={link._id || link.id}
                                className="group flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-indigo-100 hover:bg-indigo-50/30 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 leading-none">{link.studentName}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-[10px] bg-white border border-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-medium tracking-tighter">
                                                {link.class || 'No Class'}
                                            </span>
                                            {link.admissionNo && (
                                                <span className="text-[10px] text-gray-400 font-mono italic">
                                                    #{link.admissionNo}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleUnlink(link)}
                                    disabled={loading}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}

                        {linkedStudents.length === 0 && !isAdding && (
                            <div className="flex flex-col items-center justify-center py-10 px-6 border-2 border-dashed border-gray-50 rounded-2xl bg-gray-50/30">
                                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-300 mb-3">
                                    <Link size={20} />
                                </div>
                                <p className="text-xs text-gray-400 font-medium text-center">
                                    No students linked to this profile.
                                    <br />
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(true)}
                                        className="text-indigo-600 font-bold hover:underline mt-1"
                                    >
                                        Connect child account
                                    </button>
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {loading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-20 rounded-xl">
                    <Loader2 className="text-indigo-600 animate-spin" />
                </div>
            )}
        </div>
    );
};

export default StudentLinkPanel;
