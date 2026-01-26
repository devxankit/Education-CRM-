
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Mail } from 'lucide-react';
import NoticeTable from './components/NoticeTable';
import NoticeFormStepper from './components/NoticeFormStepper';

const Notices = () => {

    // UI State
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('ALL');

    // Data State (Mock)
    const [notices, setNotices] = useState([]);

    // Mock Load
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setNotices([
                {
                    id: 'N-2023-089',
                    title: 'Annual Sports Day 2026 - Registration Open',
                    category: 'HOLIDAY',
                    priority: 'NORMAL',
                    audienceSummary: 'All Students, Teachers',
                    recipientCount: 1450,
                    channels: ['APP', 'EMAIL'],
                    status: 'PUBLISHED',
                    publishDate: '24 Jan 2026',
                    ackRequired: false
                },
                {
                    id: 'N-2023-090',
                    title: 'Urgent: School Closed Due to Heavy Rain',
                    category: 'EMERGENCY',
                    priority: 'URGENT',
                    audienceSummary: 'All Parents, Staff',
                    recipientCount: 2300,
                    channels: ['SMS', 'APP'],
                    status: 'PUBLISHED',
                    publishDate: '26 Jan 2026',
                    ackRequired: true
                },
                {
                    id: 'N-2023-091',
                    title: 'Term 2 Fee Payment Deadline Extended',
                    category: 'FEES',
                    priority: 'IMPORTANT',
                    audienceSummary: 'Parents (Defaulters)',
                    recipientCount: 145,
                    channels: ['EMAIL', 'SMS'],
                    status: 'DRAFT',
                    publishDate: '-',
                    ackRequired: false
                }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    // Handlers
    const handleCreate = () => {
        setIsFormOpen(true);
    };

    const handlePublish = (formData) => {
        const newNotice = {
            id: `N-2026-${Math.floor(Math.random() * 1000)}`,
            ...formData,
            audienceSummary: formData.audiences.map(a => a.toLowerCase().replace(/^\w/, c => c.toUpperCase())).join(', '),
            recipientCount: 245, // mock
            publishDate: formData.status === 'PUBLISHED' ? 'Just Now' : '-',
        };

        setNotices(prev => [newNotice, ...prev]);
        setIsFormOpen(false);
    };

    const handleAction = (type, notice) => {
        if (type === 'VIEW') {
            alert(`Viewing Notice: ${notice.title}`);
        }
        if (type === 'EDIT') {
            alert("Edit Mode coming in v2");
        }
    };

    const filteredNotices = notices.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'ALL' || n.status === activeTab;
        return matchesSearch && matchesTab;
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

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Published This Month', val: '12', color: 'text-indigo-600', icon: Mail },
                    { label: 'Urgent Alerts', val: '2', color: 'text-red-600', icon: Filter }, // filter icon as placeholder for Alert
                    { label: 'Pending Drafts', val: '4', color: 'text-gray-600', icon: FileText },
                    { label: 'Avg Open Rate', val: '86%', color: 'text-green-600', icon: Search } // search icon as placeholder for Chart
                ].map((stat, i) => ( // imported icons are constrained, using generic ones
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stat.val}</div>
                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Tabs */}
            <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">

                <div className="flex p-1">
                    {['ALL', 'PUBLISHED', 'SCHEDULED', 'DRAFT'].map(tab => (
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

            {/* Create Wizard */}
            {isFormOpen && (
                <NoticeFormStepper
                    onClose={() => setIsFormOpen(false)}
                    onPublish={handlePublish}
                />
            )}

        </div>
    );
};

// Temp Icon Imports for Stat Cards (since not all imported above)
import { FileText } from 'lucide-react';

export default Notices;
