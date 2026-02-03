
import React, { useState, useEffect } from 'react';
import { Plus, Download, Filter, Search } from 'lucide-react';
import { useAdminStore } from '../../../../../store/adminStore';

// Components
import ParentsTable from './components/ParentsTable';
import ParentDetailDrawer from './components/ParentDetailDrawer';

const Parents = () => {
    const { parents, fetchParents } = useAdminStore();

    useEffect(() => {
        fetchParents();
    }, [fetchParents]);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [viewingParent, setViewingParent] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Handlers
    const handleAdd = () => {
        setViewingParent(null); // New
        setIsDrawerOpen(true);
    };

    const handleView = (parent) => {
        setViewingParent(parent);
        setIsDrawerOpen(true);
    };

    const handleSave = (parentData) => {
        // Since we are now using backend, handleSave should ideally call an API
        // For now, let's just refresh the list after save
        setIsDrawerOpen(false);
        fetchParents();
    };

    // Filter Logic
    const filteredParents = (parents || []).filter(p =>
        (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.mobile || '').includes(searchQuery)
    );

    return (
        <div className="h-full flex flex-col pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Parent Directory</h1>
                    <p className="text-gray-500 text-sm">Manage guardians, emergency contacts, and student linkages.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Name, Mobile, ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:text-indigo-600 shadow-sm">
                        <Filter size={18} />
                    </button>
                    <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:text-indigo-600 shadow-sm">
                        <Download size={18} />
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg font-medium transition-all"
                    >
                        <Plus size={18} /> Add Parent
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Total Parents</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{parents.length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Orphan Records</p>
                    <h3 className="text-2xl font-bold text-orange-500 mt-1">{parents.filter(p => p.studentCount === 0).length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Active</p>
                    <h3 className="text-2xl font-bold text-green-600 mt-1">{parents.filter(p => p.status === 'Active').length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Missing Email</p>
                    <h3 className="text-2xl font-bold text-gray-400 mt-1">{parents.filter(p => !p.email).length}</h3>
                </div>
            </div>

            {/* Table */}
            <ParentsTable
                parents={filteredParents}
                onView={handleView}
            />

            {/* Detail Drawer */}
            <ParentDetailDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                parent={viewingParent}
                isNew={!viewingParent}
                onSave={handleSave}
            />

        </div>
    );
};

export default Parents;
