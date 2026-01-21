
import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    Download
} from 'lucide-react';
import BranchListTable from './components/branches/BranchListTable';
import BranchDetailDrawer from './components/branches/BranchDetailDrawer';

const Branches = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Role Mock (Admin Context)
    const isSuperAdmin = true;

    // Mock Data State
    const [branches, setBranches] = useState([
        {
            id: 1,
            name: 'Main Campus - Sunshine School',
            code: 'M-001',
            type: 'school',
            city: 'Pune',
            state: 'Maharashtra',
            headName: 'Dr. Rajesh Kumar',
            status: 'active',
            stats: { students: 1200, staff: 85 },
            address: '123, Knowledge Park',
            phone: '+91 98765 43210',
            email: 'main@sunshine.edu',
            establishedYear: '1995',
            allowAdmissions: true,
            allowFeeCollection: true
        },
        {
            id: 2,
            name: 'North Wing - Primary',
            code: 'N-002',
            type: 'school',
            city: 'Pune',
            state: 'Maharashtra',
            headName: 'Mrs. Anita Desai',
            status: 'active',
            stats: { students: 450, staff: 30 },
            address: '45, North Avenue',
            phone: '+91 98765 43211',
            email: 'north@sunshine.edu',
            establishedYear: '2010',
            allowAdmissions: true,
            allowFeeCollection: true
        },
        {
            id: 3,
            name: 'East City Center (Coaching)',
            code: 'E-003',
            type: 'training_center',
            city: 'Kharadi',
            state: 'Maharashtra',
            headName: 'Mr. Vivek Singh',
            status: 'inactive',
            stats: { students: 0, staff: 5 },
            address: '88, East Road',
            phone: '+91 98765 43212',
            email: 'east@sunshine.edu',
            establishedYear: '2022',
            allowAdmissions: false,
            allowFeeCollection: false
        }
    ]);

    const handleRowClick = (branch) => {
        setSelectedBranch(branch);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedBranch(null);
    };

    const handleSave = (formData) => {
        // Mock API Call
        console.log("Saved Branch:", formData);

        if (formData.id) {
            // Update
            setBranches(prev => prev.map(b => b.id === formData.id ? { ...b, ...formData } : b));
        } else {
            // Create
            const newBranch = {
                ...formData,
                id: Date.now(),
                stats: { students: 0, staff: 0 } // Init empty stats
            };
            setBranches(prev => [...prev, newBranch]);
        }

        handleCloseDrawer();
        // Here we would trigger a toast "Branch Saved Successfully"
    };

    const handleDeactivate = (id, reason) => {
        console.log(`Deactivating Branch ${id}. Reason: ${reason}`);
        // Toggle status logic
        setBranches(prev => prev.map(b => {
            if (b.id === id) {
                const newStatus = b.status === 'active' ? 'inactive' : 'active';
                return { ...b, status: newStatus };
            }
            return b;
        }));
        // We'd send audit log to backend here
        handleCloseDrawer();
    };

    // Derived State
    const filteredBranches = branches.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Campus Management</h1>
                    <p className="text-gray-500 text-sm">Configure multi-campus structure and operational rules.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        <Download size={16} />
                        Export
                    </button>
                    <button
                        onClick={() => handleRowClick(null)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                    >
                        <Plus size={18} />
                        Add New Campus
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, code or city..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-400" />
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 outline-none">
                        <option value="all">Every Status</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                    </select>
                </div>
            </div>

            {/* List Table */}
            <BranchListTable
                branches={filteredBranches}
                onRowClick={handleRowClick}
            />

            {/* Count Footer */}
            <div className="mt-4 text-xs text-center text-gray-400">
                Displaying {filteredBranches.length} of {branches.length} campuses
            </div>

            {/* Detail Drawer */}
            <BranchDetailDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                branch={selectedBranch}
                onSave={handleSave}
                onDeactivate={handleDeactivate}
                isSuperAdmin={isSuperAdmin}
            />
        </div>
    );
};

export default Branches;
