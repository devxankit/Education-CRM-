
import React, { useState, useEffect } from 'react';
import { Plus, Search, Megaphone, Bell } from 'lucide-react';
import AnnouncementTable from './components/AnnouncementTable';
import AnnouncementForm from './components/AnnouncementForm';

const Announcements = () => {

    // UI State
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('ALL');

    // Data State (Mock)
    const [announcements, setAnnouncements] = useState([]);

    // Mock Load
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setAnnouncements([
                {
                    id: 'A-2023-440',
                    title: 'Cafeteria Menu Update for February',
                    category: 'GENERAL',
                    audienceSummary: 'Students, Staff',
                    recipientCount: 1800,
                    channels: ['APP'],
                    status: 'PUBLISHED',
                    publishDate: '26 Jan 2026'
                },
                {
                    id: 'A-2023-441',
                    title: 'Annual Science Fair Registration',
                    category: 'EVENT',
                    audienceSummary: 'Students (Class 8-12)',
                    recipientCount: 450,
                    channels: ['APP', 'EMAIL'],
                    status: 'SCHEDULED',
                    publishDate: '28 Jan 2026'
                }
            ]);
            setLoading(false);
        }, 600);
    }, []);

    // Handlers
    const handlePublish = (formData) => {
        const newAnnouncement = {
            id: `A-2026-${Math.floor(Math.random() * 1000)}`,
            ...formData,
            audienceSummary: formData.audiences.map(a => a.toLowerCase().replace(/^\w/, c => c.toUpperCase())).join(', '),
            recipientCount: 320, // mock count
            publishDate: formData.status === 'PUBLISHED' ? 'Just Now' : '-',
        };

        setAnnouncements(prev => [newAnnouncement, ...prev]);
        setIsFormOpen(false);
    };

    const handleAction = (type, item) => {
        if (type === 'ARCHIVE') {
            if (window.confirm('Archive this announcement?')) {
                setAnnouncements(prev => prev.map(a => a.id === item.id ? { ...a, status: 'ARCHIVED' } : a));
            }
        } else {
            alert(`${type} action clicked for: ${item.title}`);
        }
    };

    const filteredList = announcements.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'ALL' || item.status === activeTab;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="pb-20 relative min-h-screen bg-gray-50/50">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Announcements</h1>
                    <p className="text-gray-500 text-sm">Broadcast quick updates and information to the institution.</p>
                </div>

                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    New Announcement
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Active Broadcasts', val: '5', icon: Megaphone, color: 'text-indigo-600' },
                    { label: 'Avg Reach', val: '92%', icon: Bell, color: 'text-green-600' },
                    { label: 'Scheduled', val: '2', icon: Plus, color: 'text-purple-600' } // Using Plus as placeholder for Calendar
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
                    onClose={() => setIsFormOpen(false)}
                    onPublish={handlePublish}
                />
            )}

        </div>
    );
};

export default Announcements;
