import React, { useState, useEffect } from 'react';
import { X, Send, Save } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '@/app/api';

const PRIORITIES = [
    { value: 'NORMAL', label: 'Normal', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { value: 'IMPORTANT', label: 'Important', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'URGENT', label: 'Urgent', color: 'bg-red-50 text-red-700 border-red-200' },
];

const AUDIENCES = [
    { id: 'All Students', label: 'Students' },
    { id: 'All Teachers', label: 'Teachers' },
    { id: 'All Parents', label: 'Parents' },
    { id: 'All Staff', label: 'Staff' },
];

const NoticeFormSimple = ({ onClose, onSave, branches = [], initialNotice = null }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('NORMAL');
    const [audiences, setAudiences] = useState([]);
    const [branchId, setBranchId] = useState(branches[0]?._id || '');
    const [academicYearId, setAcademicYearId] = useState('');
    const [academicYears, setAcademicYears] = useState([]);
    const [loadingAcademicYears, setLoadingAcademicYears] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const isEdit = Boolean(initialNotice?._id);

    useEffect(() => {
        if (initialNotice) {
            setTitle(initialNotice.title || '');
            setContent(initialNotice.content || '');
            setPriority(initialNotice.priority || 'NORMAL');
            setAudiences(Array.isArray(initialNotice.audiences) ? initialNotice.audiences : []);
            if (initialNotice.branchId) {
                setBranchId(initialNotice.branchId);
            }
            if (initialNotice.academicYearId) {
                setAcademicYearId(initialNotice.academicYearId);
            }
        } else {
            setTitle('');
            setContent('');
            setPriority('NORMAL');
            setAudiences([]);
            setBranchId(branches[0]?._id || '');
            setAcademicYearId('');
        }
    }, [initialNotice, branches]);

    // Fetch academic years when branch changes
    useEffect(() => {
        const fetchAcademicYears = async () => {
            if (!branchId || branchId === '') {
                setAcademicYears([]);
                setAcademicYearId('');
                return;
            }
            setLoadingAcademicYears(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/academic-year?branchId=${branchId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    const years = response.data.data || [];
                    setAcademicYears(years);
                    // If editing and academicYearId exists, check if it's still valid for this branch
                    if (initialNotice?.academicYearId) {
                        const yearExists = years.some(y => y._id === initialNotice.academicYearId);
                        if (yearExists) {
                            setAcademicYearId(initialNotice.academicYearId);
                        } else if (years.length > 0) {
                            // If old year not found, auto-select active year
                            const activeYear = years.find(y => y.status === 'active');
                            setAcademicYearId(activeYear?._id || years[0]._id);
                        }
                    } else if (years.length > 0) {
                        // Auto-select active year for new notices
                        const activeYear = years.find(y => y.status === 'active');
                        setAcademicYearId(activeYear?._id || years[0]._id);
                    }
                }
            } catch (err) {
                console.error('Error fetching academic years:', err);
                setAcademicYears([]);
            } finally {
                setLoadingAcademicYears(false);
            }
        };
        fetchAcademicYears();
    }, [branchId]);

    const toggleAudience = (id) => {
        setAudiences(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const buildPayload = (status) => ({
        title: title.trim(),
        content: (content || '').trim(),
        priority,
        audiences: audiences.length ? audiences : (initialNotice?.audiences || []),
        branchId: branchId || branches[0]?._id,
        academicYearId: academicYearId || null,
        category: initialNotice?.category || 'GENERAL',
        status,
        channels: initialNotice?.channels || ['APP']
    });

    const handleSubmit = async (e, asDraft = false) => {
        e.preventDefault();
        setError('');
        if (!title.trim()) {
            setError('Notice title is required');
            return;
        }
        if (!asDraft) {
            if (!content.trim()) {
                setError('Content is required');
                return;
            }
            if (audiences.length === 0 && !initialNotice?.audiences?.length) {
                setError('Select at least one target audience');
                return;
            }
        }
        const bid = branchId || branches[0]?._id;
        if (!bid) {
            setError(branches.length > 0 ? 'Please select a branch' : 'No branch available. Please add a branch first.');
            return;
        }

        setSubmitting(true);
        try {
            await onSave(buildPayload(asDraft ? 'DRAFT' : 'PUBLISHED'));
            onClose();
        } catch (err) {
            setError(err.message || (asDraft ? 'Failed to save draft' : 'Failed to publish notice'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Notice' : 'Compose Notice'}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e, false); }} className="p-6 space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Notice Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter notice title..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Content <span className="text-red-500">*</span></label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={5}
                            placeholder="Type your notice content here..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                        />
                    </div>

                    {/* Priority Level */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Priority Level</label>
                        <div className="flex gap-2">
                            {PRIORITIES.map((p) => (
                                <button
                                    key={p.value}
                                    type="button"
                                    onClick={() => setPriority(p.value)}
                                    className={`flex-1 py-2.5 px-3 rounded-xl border text-sm font-bold transition-all ${priority === p.value
                                        ? p.color + ' border-2'
                                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Target Audience */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Target Audience <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-2 gap-2">
                            {AUDIENCES.map((a) => (
                                <button
                                    key={a.id}
                                    type="button"
                                    onClick={() => toggleAudience(a.id)}
                                    className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all ${audiences.includes(a.id)
                                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200 border-2'
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    {a.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Branch */}
                    {branches.length > 0 && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Branch</label>
                            <select
                                value={branchId}
                                onChange={(e) => setBranchId(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="">Select branch</option>
                                {branches.map((b) => (
                                    <option key={b._id} value={b._id}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Academic Year */}
                    {branchId && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Academic Year</label>
                            <select
                                value={academicYearId}
                                onChange={(e) => setAcademicYearId(e.target.value)}
                                disabled={loadingAcademicYears}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                            >
                                <option value="">Select academic year</option>
                                {academicYears.map((year) => (
                                    <option key={year._id} value={year._id}>
                                        {year.name} {year.status === 'active' ? '(Active)' : ''}
                                    </option>
                                ))}
                            </select>
                            {loadingAcademicYears && (
                                <p className="text-xs text-gray-500 mt-1">Loading academic years...</p>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={submitting}
                            onClick={(e) => handleSubmit(e, true)}
                            className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {submitting ? 'Saving...' : (
                                <>
                                    <Save size={18} />
                                    Save as Draft
                                </>
                            )}
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {submitting ? (isEdit ? 'Updating...' : 'Publishing...') : (
                                <>
                                    <Send size={18} />
                                    {isEdit ? 'Update Notice' : 'Publish Notice'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NoticeFormSimple;
