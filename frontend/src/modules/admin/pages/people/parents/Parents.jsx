
import React, { useState, useEffect } from 'react';
import { Plus, Download, Filter, Search, Link2, Loader2, Users, UserX, CheckCircle, Mail } from 'lucide-react';
import { useAdminStore } from '../../../../../store/adminStore';

// Components
import ParentsTable from './components/ParentsTable';
import ParentDetailDrawer from './components/ParentDetailDrawer';

const Parents = () => {
    const { parents, fetchParents, addParent, updateParent, syncLinksByEmail, branches, fetchBranches } = useAdminStore();

    useEffect(() => {
        fetchParents();
        if (branches.length === 0) {
            fetchBranches();
        }
    }, [fetchParents, fetchBranches]);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [viewingParent, setViewingParent] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [syncing, setSyncing] = useState(false);

    const handleSyncByEmail = async () => {
        if (!confirm('Link students to parents where student email matches parent email. Continue?')) return;
        setSyncing(true);
        try {
            await syncLinksByEmail();
        } finally {
            setSyncing(false);
        }
    };

    // Handlers
    const handleAdd = () => {
        setViewingParent(null); // New
        setIsDrawerOpen(true);
    };

    const handleView = (parent) => {
        setViewingParent(parent);
        setIsDrawerOpen(true);
    };

    const handleSave = async (parentData) => {
        try {
            if (parentData._id) {
                await updateParent(parentData._id, parentData);
            } else {
                // Ensure branchId is present
                if (!parentData.branchId && branches.length > 0) {
                    parentData.branchId = branches[0]._id;
                }
                await addParent(parentData);
            }
            setIsDrawerOpen(false);
            fetchParents();
        } catch (error) {
            console.error('Error saving parent:', error);
        }
    };

    // Filter Logic
    const filteredParents = (parents || []).filter(p =>
        (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.mobile || '').includes(searchQuery)
    );

    return (
        <div className="h-full flex flex-col pb-10">

            {/* Header - compact so 100% looks like 75% zoom */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">Parent Directory</h1>
                    <p className="text-gray-500 text-[11px] mt-0.5">Manage guardians, emergency contacts, and student linkages.</p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                    <div className="relative flex-1 md:flex-none min-w-[120px] md:min-w-[160px]">
                        <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Name, Mobile, ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-7 pr-2 py-1.5 border border-gray-300 rounded text-[11px] outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                    </div>
                    <button className="p-1.5 border border-gray-300 rounded bg-white text-gray-600 hover:text-indigo-600 hover:bg-indigo-50" title="Filter">
                        <Filter size={14} />
                    </button>
                    <button className="p-1.5 border border-gray-300 rounded bg-white text-gray-600 hover:text-indigo-600 hover:bg-indigo-50" title="Export">
                        <Download size={14} />
                    </button>
                    <button
                        onClick={handleSyncByEmail}
                        disabled={syncing}
                        className="flex items-center gap-1 px-2.5 py-1.5 border border-teal-200 text-teal-700 bg-teal-50 rounded hover:bg-teal-100 text-[11px] font-medium disabled:opacity-60"
                        title="Link students to parents by matching emails"
                    >
                        {syncing ? <Loader2 size={12} className="animate-spin" /> : <Link2 size={12} />}
                        {syncing ? 'Syncing...' : 'Sync by Email'}
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-medium text-[11px] active:scale-95"
                    >
                        <Plus size={14} /> Add Parent
                    </button>
                </div>
            </div>

            {/* Stats Overview - compact for 100% = 75% look */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-3 rounded border border-indigo-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-semibold text-indigo-700 uppercase tracking-wider">Total Parents</p>
                            <h3 className="text-xl font-black text-indigo-900">{(parents || []).length}</h3>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center shrink-0">
                            <Users size={16} className="text-indigo-700" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded border border-orange-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-semibold text-orange-700 uppercase tracking-wider">Orphan Records</p>
                            <h3 className="text-xl font-black text-orange-900">{(parents || []).filter(p => (p.studentCount ?? 0) === 0).length}</h3>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center shrink-0">
                            <UserX size={16} className="text-orange-700" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded border border-green-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-semibold text-green-700 uppercase tracking-wider">Active</p>
                            <h3 className="text-xl font-black text-green-900">{(parents || []).filter(p => (p.status || 'Active') === 'Active').length}</h3>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center shrink-0">
                            <CheckCircle size={16} className="text-green-700" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-semibold text-gray-600 uppercase tracking-wider">Missing Email</p>
                            <h3 className="text-xl font-black text-gray-800">{(parents || []).filter(p => !p.email).length}</h3>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                            <Mail size={16} className="text-gray-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <ParentsTable
                parents={filteredParents}
                onView={handleView}
                searchQuery={searchQuery}
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
