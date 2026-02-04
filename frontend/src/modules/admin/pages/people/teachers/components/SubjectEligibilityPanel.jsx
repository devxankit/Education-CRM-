
import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Loader2 } from 'lucide-react';
import { useAdminStore } from '../../../../../../store/adminStore';
import { API_URL } from '../../../../../../app/api';

const SubjectEligibilityPanel = ({ teacher }) => {

    const subjects = useAdminStore(state => state.subjects);
    const fetchSubjects = useAdminStore(state => state.fetchSubjects);

    const [eligibleSubjects, setEligibleSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Fetch all subjects and teacher's eligible subjects
    useEffect(() => {
        const loadData = async () => {
            setFetching(true);
            try {
                // Fetch all subjects if not loaded
                if (subjects.length === 0) {
                    await fetchSubjects(teacher.branchId?._id || teacher.branchId);
                }

                // Fetch teacher's eligible subjects
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/teacher/${teacher._id}/eligible-subjects`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setEligibleSubjects(data.data || []);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setFetching(false);
            }
        };

        if (teacher?._id) {
            loadData();
        }
    }, [teacher, subjects.length, fetchSubjects]);

    const handleAdd = async () => {
        if (!selectedSubjectId) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/teacher/${teacher._id}/eligible-subjects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ subjectId: selectedSubjectId })
            });

            const data = await response.json();
            if (data.success) {
                setEligibleSubjects(data.data);
                setSelectedSubjectId('');
            } else {
                alert(data.message || 'Failed to add subject');
            }
        } catch (error) {
            console.error('Error adding subject:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (subjectId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/teacher/${teacher._id}/eligible-subjects`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ subjectId })
            });

            const data = await response.json();
            if (data.success) {
                setEligibleSubjects(data.data);
            } else {
                alert(data.message || 'Failed to remove subject');
            }
        } catch (error) {
            console.error('Error removing subject:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Filter out already added subjects
    const availableSubjects = subjects.filter(
        s => !eligibleSubjects.some(es => es._id === s._id)
    );

    if (fetching) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
                <Loader2 className="mx-auto text-indigo-600 animate-spin mb-2" size={32} />
                <p className="text-sm text-gray-500">Loading subjects...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                    <BookOpen className="text-blue-600" size={20} />
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm">Subject Eligibility</h3>
                        <p className="text-xs text-gray-500">Subjects this teacher is approved to teach.</p>
                    </div>
                </div>
            </div>

            <div className="px-6 pb-6">

                {/* List */}
                <div className="space-y-2 mb-6">
                    {eligibleSubjects.map((subject) => (
                        <div key={subject._id} className="flex justify-between items-center p-3 bg-blue-50/50 border border-blue-100 rounded-lg group">
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{subject.name}</p>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-[10px] text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded font-bold font-mono">{subject.code}</span>
                                    <span className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded font-bold capitalize">{subject.type?.replace('_', ' + ')}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemove(subject._id)}
                                disabled={loading}
                                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 disabled:opacity-50"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {eligibleSubjects.length === 0 && <p className="text-xs text-gray-400 italic">No eligible subjects added.</p>}
                </div>

                {/* Add New */}
                <div className="flex gap-2 items-end border-t border-gray-100 pt-4">
                    <div className="flex-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Select Subject</label>
                        <select
                            value={selectedSubjectId}
                            onChange={(e) => setSelectedSubjectId(e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500 bg-white"
                            disabled={loading}
                        >
                            <option value="">Choose a subject...</option>
                            {availableSubjects.map(s => (
                                <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={loading || !selectedSubjectId}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg mb-0.5 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SubjectEligibilityPanel;
