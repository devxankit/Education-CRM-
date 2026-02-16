
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, MapPin, Filter } from 'lucide-react';

import RoleTable from './components/RoleTable';
import CreateRoleModal from './components/CreateRoleModal';
import RoleDetailDrawer from './components/RoleDetailDrawer';
import { API_URL } from '@/app/api';

const RolesList = () => {
    // Data States
    const [roles, setRoles] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);

    // UI States
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [branches, setBranches] = useState([]);
    const [filterBranchId, setFilterBranchId] = useState('all');
    const pageSize = 5;
    const isSuperAdmin = true;

    // -- API Calls --

    const fetchBranches = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/branch?activeOnly=true`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setBranches(data.data || []);
        } catch (e) {
            console.error('Error fetching branches:', e);
        }
    }, []);

    const fetchRoles = useCallback(async () => {
        setFetching(true);
        try {
            const token = localStorage.getItem('token');
            let url = `${API_URL}/role`;
            if (filterBranchId && filterBranchId !== 'all') {
                url += `?branchId=${filterBranchId}`;
            }
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                // Ensure backend data matches frontend expectations (id vs _id)
                const transformed = data.data.map(r => ({
                    ...r,
                    id: r._id // Map _id to id for table/component compatibility
                }));
                setRoles(transformed);
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
            alert('Failed to load roles');
        } finally {
            setFetching(false);
        }
    }, [filterBranchId]);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    // -- Handlers --

    const handleCreate = async (newRoleData) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/role`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newRoleData)
            });

            const result = await response.json();
            if (result.success) {
                alert('Role created successfully');
                fetchRoles();
                setIsCreateOpen(false);
            } else {
                alert(result.message || 'Failed to create role');
            }
        } catch (error) {
            console.error('Error creating role:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus, reason) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/role/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus, auditReason: reason })
            });

            const result = await response.json();
            if (result.success) {
                alert('Role status updated successfully');
                setRoles(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
                setSelectedRole(prev => (prev?._id === id ? { ...prev, status: newStatus } : prev));
            } else {
                alert(result.message || 'Failed to update role');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePermissions = async (id, permissions) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/role/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ permissions })
            });

            const result = await response.json();
            if (result.success) {
                // Update local state
                setRoles(prev => prev.map(r => r._id === id ? { ...r, permissions } : r));
                setSelectedRole(prev => (prev?._id === id ? { ...prev, permissions } : prev));
                alert('Permissions updated successfully');
            } else {
                alert(result.message || 'Failed to update permissions');
            }
        } catch (error) {
            console.error('Error updating permissions:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const filteredRoles = useMemo(() =>
        roles.filter(r =>
            (r.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.code || '').toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [roles, searchTerm]
    );
    const totalPages = Math.ceil(filteredRoles.length / pageSize) || 1;
    const paginatedRoles = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredRoles.slice(start, start + pageSize);
    }, [filteredRoles, currentPage, pageSize]);

    useEffect(() => setCurrentPage(1), [searchTerm]);
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    }, [currentPage, totalPages]);
    const handlePageChange = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Role Definitions</h1>
                    <p className="text-gray-500 text-sm">Manage staff roles and their access permissions.</p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-400" />
                        <MapPin size={16} className="text-indigo-500" />
                        <select
                            value={filterBranchId}
                            onChange={(e) => setFilterBranchId(e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Branches</option>
                            {branches.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search roles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                        />
                    </div>
                    <button
                        onClick={fetchRoles}
                        className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 bg-white border border-gray-200 rounded-lg transition-colors"
                        title="Refresh"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>
                    </button>
                    {isSuperAdmin && (
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm shadow-sm"
                        >
                            <Plus size={18} /> Define New Role
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            {fetching ? (
                <div className="flex justify-center items-center p-12 bg-white rounded-xl border border-gray-200">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <p className="text-gray-500 text-sm">Loading roles...</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 min-h-0 flex flex-col gap-0">
                    <div className={`bg-white border border-gray-200 shadow-sm flex-1 min-h-0 flex flex-col overflow-hidden ${filteredRoles.length > 0 ? 'rounded-t-xl' : 'rounded-xl'}`}>
                        <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0 custom-scrollbar">
                            <RoleTable
                                roles={paginatedRoles}
                                onRowClick={(role) => setSelectedRole(role)}
                            />
                        </div>
                    </div>
                    {filteredRoles.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border border-gray-200 border-t-0 rounded-b-xl -mt-px shadow-sm">
                            <p className="text-xs text-gray-500">
                                Showing <span className="font-semibold text-gray-700">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                                <span className="font-semibold text-gray-700">{Math.min(currentPage * pageSize, filteredRoles.length)}</span> of{' '}
                                <span className="font-semibold text-gray-700">{filteredRoles.length}</span> roles
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 mr-2">
                                    <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-1"></span>{filteredRoles.filter(r => r.type === 'system').length} System
                                    <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 ml-3 mr-1"></span>{filteredRoles.filter(r => r.type === 'custom').length} Custom
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage <= 1}
                                        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <div className="flex items-center gap-1 mx-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) pageNum = i + 1;
                                            else if (currentPage <= 3) pageNum = i + 1;
                                            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                            else pageNum = currentPage - 2 + i;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= totalPages}
                                        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Drawers & Modals */}
            <CreateRoleModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={handleCreate}
                branches={branches}
                loading={loading}
            />

            <RoleDetailDrawer
                isOpen={!!selectedRole}
                onClose={() => setSelectedRole(null)}
                role={selectedRole}
                onStatusChange={handleStatusChange}
                onUpdatePermissions={handleUpdatePermissions}
                isSuperAdmin={isSuperAdmin}
                loading={loading}
            />
        </div>
    );
};

export default RolesList;