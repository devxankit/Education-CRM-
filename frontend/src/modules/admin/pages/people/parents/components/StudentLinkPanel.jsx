
import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Link, AlertCircle, Loader2, Search } from 'lucide-react';
import { API_URL } from '@/app/api';
import { useAdminStore } from '../../../../../../store/adminStore';

const StudentLinkPanel = ({ parentId }) => {

    const students = useAdminStore(state => state.students);
    const fetchStudents = useAdminStore(state => state.fetchStudents);

    const [linkedStudents, setLinkedStudents] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Fetch linked students
    useEffect(() => {
        const loadLinkedStudents = async () => {
            if (!parentId) return;

            setFetching(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/parent/${parentId}/linked-students`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setLinkedStudents(data.data || []);
                }
            } catch (error) {
                console.error('Error fetching linked students:', error);
            } finally {
                setFetching(false);
            }
        };

        loadLinkedStudents();
    }, [parentId]);

    // Fetch all students for dropdown
    useEffect(() => {
        if (students.length === 0) {
            fetchStudents();
        }
    }, [students.length, fetchStudents]);

    const handleLink = async () => {
        if (!selectedStudentId) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/parent/${parentId}/link-student`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ studentId: selectedStudentId })
            });

            const data = await response.json();
            if (data.success) {
                setLinkedStudents(prev => [...prev, data.data]);
                setSelectedStudentId('');
                setSearchTerm('');
                setIsAdding(false);
            } else {
                alert(data.message || 'Failed to link student');
            }
        } catch (error) {
            console.error('Error linking student:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleUnlink = async (studentId) => {
        if (!confirm("Are you sure you want to unlink this student? Ensure they have another guardian linked.")) {
            return;
        }

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
                setLinkedStudents(prev => prev.filter(s => s._id !== studentId));
            } else {
                alert(data.message || 'Failed to unlink student');
            }
        } catch (error) {
            console.error('Error unlinking student:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Filter available students (not already linked)
    const availableStudents = students.filter(s =>
        !linkedStudents.some(ls => ls._id === s._id) &&
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (fetching) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
                <Loader2 className="mx-auto text-indigo-600 animate-spin mb-2" size={32} />
                <p className="text-sm text-gray-500">Loading students...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link className="text-indigo-600" size={20} />
                    <h3 className="font-bold text-gray-800 text-sm">Linked Students</h3>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    disabled={loading}
                    className="flex items-center gap-1 text-indigo-600 text-xs font-bold hover:underline disabled:opacity-50"
                >
                    <UserPlus size={14} /> Link Student
                </button>
            </div>

            <div className="p-6 space-y-3">

                {isAdding && (
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg mb-4 animate-in fade-in slide-in-from-top-2">
                        <label className="text-xs font-bold text-indigo-800 block mb-2">Search Student to Link</label>
                        <div className="flex flex-col gap-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                    type="text"
                                    placeholder="Type student name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full text-sm border border-indigo-200 rounded pl-8 pr-2 py-1.5 outline-none"
                                    autoFocus
                                />
                            </div>
                            <select
                                value={selectedStudentId}
                                onChange={(e) => setSelectedStudentId(e.target.value)}
                                className="w-full text-sm border border-indigo-200 rounded px-2 py-1.5 outline-none bg-white"
                                disabled={loading}
                            >
                                <option value="">Select a student...</option>
                                {availableStudents.map(s => (
                                    <option key={s._id} value={s._id}>
                                        {s.firstName} {s.lastName} - {s.admissionNo}
                                    </option>
                                ))}
                            </select>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleLink}
                                    disabled={!selectedStudentId || loading}
                                    className="flex-1 bg-indigo-600 text-white px-3 py-1.5 rounded text-xs font-bold disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                                >
                                    {loading ? <Loader2 size={14} className="animate-spin" /> : 'Add'}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsAdding(false);
                                        setSearchTerm('');
                                        setSelectedStudentId('');
                                    }}
                                    className="px-3 py-1.5 border border-indigo-200 text-indigo-700 rounded text-xs font-bold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {linkedStudents.map((link) => (
                    <div key={link._id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                {link.studentName?.charAt(0) || 'S'}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">{link.studentName}</p>
                                <p className="text-[10px] text-gray-500">{link.class}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleUnlink(link._id)}
                            disabled={loading}
                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 disabled:opacity-50"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}

                {linkedStudents.length === 0 && (
                    <div className="text-center py-4 text-gray-400 text-xs italic border border-dashed border-gray-200 rounded-lg flex flex-col items-center gap-2">
                        <AlertCircle size={16} />
                        No students linked. This parent is an orphan record.
                    </div>
                )}

            </div>
        </div>
    );
};

export default StudentLinkPanel;
