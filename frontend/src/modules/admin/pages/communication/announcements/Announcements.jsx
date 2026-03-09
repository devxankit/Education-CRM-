
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Megaphone, Bell, X, CalendarDays, Users2 } from 'lucide-react';
import AnnouncementTable from './components/AnnouncementTable';
import AnnouncementForm from './components/AnnouncementForm';
import { API_URL } from '@/app/api';

const Announcements = () => {

    // UI State
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('ALL');
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [viewingAnnouncement, setViewingAnnouncement] = useState(null);

    // Data State (from backend)
    const [announcements, setAnnouncements] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState('');

    // Load branches
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/branch`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    const list = response.data.data || [];
                    setBranches(list);
                    if (list.length > 0 && !selectedBranchId) {
                        setSelectedBranchId(list[0]._id);
                    }
                }
            } catch (error) {
                console.error('Error fetching branches for announcements:', error);
            }
        };
        fetchBranches();
    }, [selectedBranchId]);

    // Load announcements when branch or status tab changes
    useEffect(() => {
        const fetchAnnouncements = async () => {
            if (!selectedBranchId) return;
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const params = new URLSearchParams();
                if (selectedBranchId && selectedBranchId !== 'all') params.append('branchId', selectedBranchId);
                if (activeTab && activeTab !== 'ALL') params.append('status', activeTab);

                const response = await axios.get(`${API_URL}/announcement?${params.toString()}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setAnnouncements(response.data.data || []);
                }
            } catch (error) {
                console.error('Error fetching announcements:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, [selectedBranchId, activeTab]);

    // Create / update announcement
    const handlePublish = async (formData) => {
        const finalBranchId = formData.branchId || selectedBranchId;
        if (!finalBranchId) {
            alert('Please select a branch in the form.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                branchId: finalBranchId
            };
            if (editingAnnouncement?._id) {
                const response = await axios.put(`${API_URL}/announcement/${editingAnnouncement._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    const updated = response.data.data;
                    setAnnouncements(prev => prev.map(a => (a._id === updated._id ? updated : a)));
                    setEditingAnnouncement(null);
                    setIsFormOpen(false);
                }
            } else {
                const response = await axios.post(`${API_URL}/announcement`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    const created = response.data.data;
                    setAnnouncements(prev => [created, ...prev]);
                    setIsFormOpen(false);
                }
            }
        } catch (error) {
            console.error('Error saving announcement:', error);
            alert(error.response?.data?.message || 'Failed to save announcement');
        }
    };

    const handleAction = async (type, item) => {
        const raw = announcements.find(a => (a._id || a.announcementId) === (item.dbId || item._id || item.id)) || null;

        if (type === 'VIEW') {
            setViewingAnnouncement(raw);
            return;
        }

        if (type === 'EDIT') {
            setViewingAnnouncement(null);
            setEditingAnnouncement(raw);
            setIsFormOpen(true);
            return;
        }

        if (type === 'DELETE' && raw?._id) {
            const confirmed = window.confirm(`Are you sure you want to delete "${raw.title || 'this announcement'}"?`);
            if (!confirmed) return;

            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete(`${API_URL}/announcement/${raw._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setAnnouncements(prev => prev.filter(a => a._id !== raw._id));
                    if (viewingAnnouncement?._id === raw._id) setViewingAnnouncement(null);
                    if (editingAnnouncement?._id === raw._id) {
                        setEditingAnnouncement(null);
                        setIsFormOpen(false);
                    }
                }
            } catch (error) {
                console.error('Error deleting announcement:', error);
                alert(error.response?.data?.message || 'Failed to delete announcement');
            }
        }
    };

    const normalizedAnnouncements = announcements.map(a => ({
        id: a.announcementId,
        dbId: a._id,
        title: a.title,
        category: a.category,
        audienceSummary: (a.audiences || []).join(', '),
        recipientCount: a.recipientsCount || 0,
        channels: a.channels || ['APP'],
        status: a.status,
        publishDate: a.publishDate ? new Date(a.publishDate).toLocaleDateString() : '-'
    }));

    const filteredList = normalizedAnnouncements.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        activeBroadcasts: normalizedAnnouncements.filter(a => a.status === 'PUBLISHED').length,
        totalRecipients: normalizedAnnouncements.reduce((sum, a) => sum + (a.recipientCount || 0), 0),
        scheduled: normalizedAnnouncements.filter(a => a.status === 'SCHEDULED').length
    };

    return (
        <div className="pb-20 relative min-h-screen bg-gray-50/50">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Announcements</h1>
                    <p className="text-gray-500 text-sm">Broadcast quick updates and information to the institution.</p>
                </div>

                <button
                    onClick={() => {
                        setEditingAnnouncement(null);
                        setViewingAnnouncement(null);
                        setIsFormOpen(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    New Announcement
                </button>
            </div>

            {/* Branch Filter + Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 items-stretch">
                <div className="md:col-span-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Branch</label>
                    <select
                        value={selectedBranchId}
                        onChange={(e) => setSelectedBranchId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                    >
                        <option value="">Select Branch</option>
                        {branches.map(b => (
                            <option key={b._id} value={b._id}>{b.name}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Active Broadcasts', val: stats.activeBroadcasts, icon: Megaphone, color: 'text-indigo-600' },
                        { label: 'Total Recipients', val: stats.totalRecipients, icon: Bell, color: 'text-green-600' },
                        { label: 'Scheduled', val: stats.scheduled, icon: Plus, color: 'text-purple-600' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stat.val}</div>
                                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters & Tabs */}
            <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">

                <div className="flex p-1">
                    {['ALL', 'PUBLISHED', 'SCHEDULED', 'DRAFT', 'ARCHIVED'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {tab.charAt(0) + tab.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64 mr-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search announcements..."
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
                    <p className="text-gray-500">Loading feeds...</p>
                </div>
            ) : (
                <AnnouncementTable
                    announcements={filteredList}
                    onAction={handleAction}
                />
            )}

            {/* Create Drawer */}
            {isFormOpen && (
                <AnnouncementForm
                    onClose={() => {
                        setEditingAnnouncement(null);
                        setIsFormOpen(false);
                    }}
                    onPublish={handlePublish}
                    initialAnnouncement={editingAnnouncement}
                />
            )}

            {viewingAnnouncement && (
                <AnnouncementViewModal
                    announcement={viewingAnnouncement}
                    branches={branches}
                    onClose={() => setViewingAnnouncement(null)}
                    onEdit={() => {
                        setViewingAnnouncement(null);
                        setEditingAnnouncement(viewingAnnouncement);
                        setIsFormOpen(true);
                    }}
                    onDelete={() => handleAction('DELETE', viewingAnnouncement)}
                />
            )}

        </div>
    );
};

const AnnouncementViewModal = ({ announcement, branches, onClose, onEdit, onDelete }) => {
    const branchName = branches.find((branch) => branch._id === announcement?.branchId)?.name || 'N/A';
    const publishDate = announcement?.publishDate ? new Date(announcement.publishDate).toLocaleString() : 'N/A';
    const audiences = Array.isArray(announcement?.audiences) ? announcement.audiences : [];
    const channels = Array.isArray(announcement?.channels) ? announcement.channels : [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-600 border border-pink-100 text-[10px] font-black uppercase tracking-widest mb-3">
                            <Megaphone size={12} />
                            Announcement Preview
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{announcement?.title || 'Announcement'}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Category</p>
                            <p className="text-sm font-bold text-gray-900">{announcement?.category || 'GENERAL'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Status</p>
                            <p className="text-sm font-bold text-gray-900">{announcement?.status || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Branch</p>
                            <p className="text-sm font-bold text-gray-900">{branchName}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <CalendarDays size={12} />
                            Published On
                        </p>
                        <p className="text-sm font-bold text-gray-900">{publishDate}</p>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Users2 size={12} />
                            Target Audience
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {audiences.length > 0 ? audiences.map((audience) => (
                                <span key={audience} className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-semibold border border-pink-100">
                                    {audience}
                                </span>
                            )) : (
                                <span className="text-sm text-gray-500">No audience selected</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Channels</p>
                        <div className="flex flex-wrap gap-2">
                            {channels.length > 0 ? channels.map((channel) => (
                                <span key={channel} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200 uppercase">
                                    {channel}
                                </span>
                            )) : (
                                <span className="text-sm text-gray-500">No channels configured</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Announcement Content</p>
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-6">
                                {announcement?.content || 'No content available.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            onClick={onEdit}
                            className="flex-1 py-3 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100"
                        >
                            Edit Announcement
                        </button>
                        <button
                            type="button"
                            onClick={onDelete}
                            className="flex-1 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 font-bold hover:bg-red-100"
                        >
                            Delete Announcement
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Announcements;
