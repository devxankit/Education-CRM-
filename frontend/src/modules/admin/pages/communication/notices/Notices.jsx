import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Mail, FileText, Filter, Users } from 'lucide-react';
import NoticeTable from './components/NoticeTable';
import NoticeFormSimple from './components/NoticeFormSimple';
import { API_URL } from '@/app/api';

const Notices = () => {
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [notices, setNotices] = useState([]);
    const [editingNotice, setEditingNotice] = useState(null);
    const [branches, setBranches] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [academicYears, setAcademicYears] = useState([]);
    const [selectedAcademicYearId, setSelectedAcademicYearId] = useState('');
    const [targetedAudience, setTargetedAudience] = useState({ classes: [], departments: [] });
    const [stats, setStats] = useState({
        publishedThisMonth: 0,
        urgentAlerts: 0,
        pendingDrafts: 0,
        avgOpenRate: 0
    });

    const fetchNotices = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            if (selectedBranchId && selectedBranchId !== 'all') params.append('branchId', selectedBranchId);
            if (selectedAcademicYearId && selectedAcademicYearId !== 'all') params.append('academicYearId', selectedAcademicYearId);
            
            const response = await axios.get(`${API_URL}/notice?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setNotices(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching notices:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/branch`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                const branchesData = response.data.data || [];
                setBranches(branchesData);
                // Set default branch if available and fetch stats immediately
                if (branchesData.length > 0 && !selectedBranchId) {
                    const defaultBranchId = branchesData[0]._id;
                    setSelectedBranchId(defaultBranchId);
                    // Stats will be fetched by the useEffect when selectedBranchId changes
                }
            }
        } catch (err) {
            console.error('Error fetching branches:', err);
        }
    };

    const fetchAcademicYears = async (branchId) => {
        if (!branchId || branchId === 'all') {
            setAcademicYears([]);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/academic-year?branchId=${branchId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                const years = response.data.data || [];
                setAcademicYears(years);
            }
        } catch (err) {
            console.error('Error fetching academic years:', err);
        }
    };

    const fetchTargetedAudience = async (branchId, academicYearId) => {
        if (!branchId || branchId === 'all' || !academicYearId || academicYearId === 'all') {
            setTargetedAudience({ classes: [], departments: [] });
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const [classesRes, departmentsRes] = await Promise.all([
                axios.get(`${API_URL}/class?branchId=${branchId}&academicYearId=${academicYearId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/department?branchId=${branchId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setTargetedAudience({
                classes: classesRes.data.success ? (classesRes.data.data || []) : [],
                departments: departmentsRes.data.success ? (departmentsRes.data.data || []) : []
            });
        } catch (err) {
            console.error('Error fetching targeted audience:', err);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            if (selectedBranchId && selectedBranchId !== 'all') params.append('branchId', selectedBranchId);
            if (selectedAcademicYearId && selectedAcademicYearId !== 'all') params.append('academicYearId', selectedAcademicYearId);
            
            const response = await axios.get(`${API_URL}/notice/stats?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success && response.data.data) {
                setStats({
                    publishedThisMonth: response.data.data.publishedThisMonth || 0,
                    urgentAlerts: response.data.data.urgentAlerts || 0,
                    pendingDrafts: response.data.data.pendingDrafts || 0,
                    avgOpenRate: response.data.data.avgOpenRate || 0
                });
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
            // Set default values on error
            setStats({
                publishedThisMonth: 0,
                urgentAlerts: 0,
                pendingDrafts: 0,
                avgOpenRate: 0
            });
        }
    };

    // Initial load
    useEffect(() => {
        fetchBranches();
    }, []);

    // Fetch academic years when branch changes
    useEffect(() => {
        if (selectedBranchId) {
            fetchAcademicYears(selectedBranchId);
            // Reset academic year when branch changes
            setSelectedAcademicYearId('');
        } else {
            setAcademicYears([]);
            setSelectedAcademicYearId('');
        }
    }, [selectedBranchId]);

    // Auto-select active academic year when academic years are loaded
    useEffect(() => {
        if (academicYears.length > 0 && selectedBranchId && !selectedAcademicYearId) {
            const activeYear = academicYears.find(y => y.status === 'active');
            setSelectedAcademicYearId(activeYear?._id || academicYears[0]._id);
        }
    }, [academicYears, selectedBranchId]);

    // Fetch targeted audience when academic year changes
    useEffect(() => {
        if (selectedBranchId && selectedAcademicYearId) {
            fetchTargetedAudience(selectedBranchId, selectedAcademicYearId);
        } else {
            setTargetedAudience({ classes: [], departments: [] });
        }
    }, [selectedBranchId, selectedAcademicYearId]);

    useEffect(() => {
        // Only fetch if branch is selected (required filter)
        if (selectedBranchId) {
            fetchNotices();
            fetchStats();
        } else {
            // Reset stats when no branch is selected
            setStats({
                publishedThisMonth: 0,
                urgentAlerts: 0,
                pendingDrafts: 0,
                avgOpenRate: 0
            });
        }
    }, [selectedBranchId, selectedAcademicYearId]);

    const handleCreate = () => {
        setEditingNotice(null);
        setIsFormOpen(true);
    };

    const handleSave = async (formData) => {
        const token = localStorage.getItem('token');
        if (editingNotice?._id) {
            const { _id, ...payload } = formData;
            const response = await axios.put(`${API_URL}/notice/${editingNotice._id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to update');
            }
            setNotices(prev => prev.map(n => n._id === editingNotice._id ? response.data.data : n));
        } else {
            const response = await axios.post(`${API_URL}/notice`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to save');
            }
            setNotices(prev => [response.data.data, ...prev]);
        }
        setEditingNotice(null);
        setIsFormOpen(false);
        fetchStats();
    };

    const handleAction = (type, notice) => {
        if (type === 'EDIT') {
            const raw = notices.find(n => (n._id || n.noticeId) === notice.id);
            setEditingNotice(raw || null);
            setIsFormOpen(true);
        }
    };

    const normalizedNotices = notices.map(n => ({
        id: n._id || n.noticeId,
        title: n.title,
        category: n.category,
        priority: n.priority,
        audienceSummary: (n.audiences || []).join(', '),
        recipientCount: n.recipientsCount || 0,
        channels: n.channels || ['APP'],
        status: n.status,
        publishDate: n.publishDate ? new Date(n.publishDate).toLocaleDateString() : '-',
        ackRequired: n.ackRequired || false
    }));

    const filteredNotices = normalizedNotices.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="pb-20 relative min-h-screen bg-gray-50/50">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Notices & Circulars</h1>
                    <p className="text-gray-500 text-sm">Create, publish, and track official communications for the institution.</p>
                </div>

                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    Compose New Notice
                </button>
            </div>

            {/* Branch and Academic Year Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Branch</label>
                        <select
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                        >
                            <option value="">Select Branch</option>
                            {branches.map((branch) => (
                                <option key={branch._id} value={branch._id}>{branch.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    {selectedBranchId && academicYears.length > 0 && (
                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Academic Year</label>
                            <select
                                value={selectedAcademicYearId}
                                onChange={(e) => setSelectedAcademicYearId(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                            >
                                <option value="">Select Academic Year</option>
                                {academicYears.map((year) => (
                                    <option key={year._id} value={year._id}>
                                        {year.name} {year.status === 'active' ? '(Active)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Targeted Audience Display */}
                {selectedBranchId && selectedAcademicYearId && (
                    <div className="flex-1 bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <Users size={16} className="text-indigo-600" />
                            <span className="text-xs font-semibold text-indigo-700">Targeted Audience</span>
                        </div>
                        <div className="text-xs text-indigo-600">
                            {targetedAudience.classes.length > 0 && (
                                <span className="mr-3">
                                    {targetedAudience.classes.length} Class{targetedAudience.classes.length !== 1 ? 'es' : ''}
                                </span>
                            )}
                            {targetedAudience.departments.length > 0 && (
                                <span>
                                    {targetedAudience.departments.length} Department{targetedAudience.departments.length !== 1 ? 's' : ''}
                                </span>
                            )}
                            {targetedAudience.classes.length === 0 && targetedAudience.departments.length === 0 && (
                                <span className="text-gray-500">No classes/departments found</span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Published This Month', val: stats.publishedThisMonth, color: 'text-indigo-600', icon: Mail },
                    { label: 'Urgent Alerts', val: stats.urgentAlerts, color: 'text-red-600', icon: Filter },
                    { label: 'Pending Drafts', val: stats.pendingDrafts, color: 'text-gray-600', icon: FileText },
                    { label: 'Avg Open Rate', val: `${stats.avgOpenRate}%`, color: 'text-green-600', icon: Search }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stat.val}</div>
                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search notices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                </div>
            </div>

            {/* Table Content */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading notices...</p>
                </div>
            ) : (
                <NoticeTable
                    notices={filteredNotices}
                    onAction={handleAction}
                />
            )}

            {isFormOpen && (
                <NoticeFormSimple
                    onClose={() => { setEditingNotice(null); setIsFormOpen(false); }}
                    onSave={handleSave}
                    branches={branches}
                    initialNotice={editingNotice}
                />
            )}

        </div>
    );
};

export default Notices;
