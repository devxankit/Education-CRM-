
import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Download
} from 'lucide-react';
import BranchListTable from './components/branches/BranchListTable';
import BranchDetailDrawer from './components/branches/BranchDetailDrawer';
import { API_URL } from '@/app/api';

const Branches = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Role Mock (Admin Context)
    const isSuperAdmin = true;

    // Data State
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        setFetching(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/branch`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setBranches(data.data);
            } else {
                alert(data.message || 'Failed to load branches');
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
            alert('Failed to load branches');
        } finally {
            setFetching(false);
        }
    };

    const handleRowClick = (branch) => {
        setSelectedBranch(branch);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedBranch(null);
    };

    const handleSave = async (formData) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const method = formData._id ? 'PUT' : 'POST';
            const url = formData._id
                ? `${API_URL}/branch/${formData._id}`
                : `${API_URL}/branch`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                alert(formData._id ? 'Branch Updated Successfully' : 'Branch Created Successfully');
                fetchBranches();
                handleCloseDrawer();
            } else {
                alert(data.message || 'Failed to save branch');
            }
        } catch (error) {
            console.error('Error saving branch:', error);
            alert('An error occurred while saving');
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (id, reason, newIsActive) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/branch/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: newIsActive, deactivationReason: reason })
            });

            const data = await response.json();
            if (data.success) {
                alert(`Branch ${newIsActive ? 'Activated' : 'Deactivated'} Successfully`);
                fetchBranches();
                handleCloseDrawer();
            } else {
                alert(data.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('An error occurred while updating status');
        } finally {
            setLoading(false);
        }
    };

    // Derived State
    const filteredBranches = branches.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.code.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && b.isActive) ||
            (statusFilter === 'inactive' && !b.isActive);

        return matchesSearch && matchesStatus;
    });

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
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 outline-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Every Status</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                    </select>
                </div>
            </div>

            {/* List Table */}
            {fetching ? (
                <div className="flex justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <BranchListTable
                    branches={filteredBranches}
                    onRowClick={handleRowClick}
                />
            )}

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
                loading={loading}
            />
        </div>
    );
};

export default Branches;
