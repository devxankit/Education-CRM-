
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UserPlus, Search, ChevronLeft, ChevronRight, MapPin, Filter } from 'lucide-react';

import StaffUsersTable from './components/StaffUsersTable';
import CreateStaffUserModal from './components/CreateStaffUserModal';
import ChangeRoleModal from './components/ChangeRoleModal';
import UserDetailDrawer from './components/UserDetailDrawer';
import { API_URL } from '@/app/api';

const StaffUsers = () => {
    // Data States
    const [users, setUsers] = useState([]);
    const [activeRoles, setActiveRoles] = useState([]);
    const [branches, setBranches] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);

    // UI States
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'
    const [editingUser, setEditingUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isRoleChangeOpen, setIsRoleChangeOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBranchId, setFilterBranchId] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const isSuperAdmin = true;

    // -- API Calls --

    const fetchAllData = useCallback(async () => {
        setFetching(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const staffUrl = filterBranchId && filterBranchId !== 'all'
                ? `${API_URL}/staff?branchId=${filterBranchId}`
                : `${API_URL}/staff`;
            const [staffRes, rolesRes, branchesRes] = await Promise.all([
                fetch(staffUrl, { headers }),
                fetch(`${API_URL}/role`, { headers }),
                fetch(`${API_URL}/branch?activeOnly=true`, { headers })
            ]);

            const staffData = await staffRes.json();
            const rolesData = await rolesRes.json();
            const branchesData = await branchesRes.json();

            if (staffData.success) {
                // Transform data for table
                const transformed = staffData.data.map(u => ({
                    id: u._id,
                    _id: u._id,
                    name: u.name,
                    email: u.email,
                    phone: u.phone,
                    roleId: u.roleId?._id || u.roleId,
                    roleName: u.roleId?.name || 'No Role',
                    branchId: u.branchId?._id || u.branchId || null,
                    branchScope: u.branchId?.name || (u.branchId === 'all' || !u.branchId ? 'All Branches' : 'Single Branch'),
                    status: u.status,
                    lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never logged in'
                }));
                setUsers(transformed);
            }

            if (rolesData.success) {
                const transformedRoles = rolesData.data
                    .filter(r => r.status === 'active')
                    .map(r => ({ ...r, id: r._id }));
                setActiveRoles(transformedRoles);
            }

            if (branchesData.success) {
                setBranches(branchesData.data);
            }

        } catch (error) {
            console.error('Error fetching staff data:', error);
            alert('Failed to load staff management data');
        } finally {
            setFetching(false);
        }
    }, [filterBranchId]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // -- Handlers --

    const handleCreate = async (data) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/staff`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.success) {
                alert('Staff user created successfully');
                fetchAllData();
                setIsCreateOpen(false);
            } else {
                alert(result.message || 'Failed to create staff');
            }
        } catch (error) {
            console.error('Error creating staff:', error);
            alert('An error occurred while creating staff');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/staff/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const result = await response.json();
            if (result.success) {
                alert(`User ${newStatus} successfully`);
                setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: newStatus } : u));
                setSelectedUser(prev => prev ? { ...prev, status: newStatus } : null);
            } else {
                alert(result.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('An error occurred while updating status');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (user) => {
        if (!user || !window.confirm(`Are you sure you want to DELETE "${user.name}"? This action cannot be undone.`)) {
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/staff/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.success) {
                alert('Staff user deleted successfully');
                setUsers(prev => prev.filter(u => u.id !== user.id));
                setSelectedUser(prev => (prev && prev.id === user.id ? null : prev));
            } else {
                alert(result.message || 'Failed to delete staff user');
            }
        } catch (error) {
            console.error('Error deleting staff:', error);
            alert('An error occurred while deleting staff user');
        } finally {
            setLoading(false);
        }
    };

    const handleChangeRole = async (userId, newRoleId, reason) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/staff/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ roleId: newRoleId, auditReason: reason })
            });

            const result = await response.json();
            if (result.success) {
                alert('Role updated successfully');
                fetchAllData();
                setIsRoleChangeOpen(false);
                setSelectedUser(null);
            } else {
                alert(result.message || 'Failed to change role');
            }
        } catch (error) {
            console.error('Error changing role:', error);
            alert('An error occurred while changing role');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (userId, payload) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/staff/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.success) {
                alert('User details updated successfully');
                const updated = result.data;
                setUsers(prev => prev.map(u =>
                    u._id === userId
                        ? {
                            ...u,
                            name: updated.name,
                            email: updated.email,
                            branchScope: u.branchScope
                        }
                        : u
                ));
                setSelectedUser(prev => prev ? {
                    ...prev,
                    name: updated.name,
                    email: updated.email
                } : null);
            } else {
                alert(result.message || 'Failed to update user details');
            }
        } catch (error) {
            console.error('Error updating user details:', error);
            alert('An error occurred while updating user details');
        } finally {
            setLoading(false);
        }
    };

    // Filter & Pagination
    const filteredUsers = useMemo(() =>
        users.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [users, searchTerm]
    );
    const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredUsers.slice(start, start + pageSize);
    }, [filteredUsers, currentPage, pageSize]);

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
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Staff User Management</h1>
                    <p className="text-gray-500 text-sm">Manage administrative access and security profiles.</p>
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
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                        />
                    </div>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                    >
                        <UserPlus size={18} /> Add New User
                    </button>
                </div>
            </div>

            {/* Table + Pagination */}
            {fetching ? (
                <div className="flex justify-center items-center p-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <>
                    <StaffUsersTable
                        users={paginatedUsers}
                        onRowClick={(u) => setSelectedUser(u)}
                        onEdit={(u) => {
                            setFormMode('edit');
                            setEditingUser(u);
                            setIsCreateOpen(true);
                        }}
                        onToggleStatus={(u) => {
                            const nextStatus = u.status === 'active' ? 'suspended' : 'active';
                            const action = nextStatus === 'active' ? 'ACTIVATE' : 'SUSPEND';
                            if (window.confirm(`Are you sure you want to ${action} this user?`)) {
                                handleStatusChange(u.id, nextStatus);
                            }
                        }}
                        onDelete={handleDelete}
                    />
                    {/* Pagination */}
                    {filteredUsers.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border border-gray-200 border-t-0 rounded-b-xl -mt-px shadow-sm">
                            <p className="text-xs text-gray-500">
                                Showing <span className="font-semibold text-gray-700">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                                <span className="font-semibold text-gray-700">{Math.min(currentPage * pageSize, filteredUsers.length)}</span> of{' '}
                                <span className="font-semibold text-gray-700">{filteredUsers.length}</span> staff
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <div className="flex items-center gap-1 mx-2">
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
                                                className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                                                    currentPage === pageNum ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                                }`}
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
                    )}
                </>
            )}

            {/* Modals */}
            <CreateStaffUserModal
                isOpen={isCreateOpen}
                onClose={() => {
                    setIsCreateOpen(false);
                    setEditingUser(null);
                    setFormMode('create');
                }}
                mode={formMode}
                initialData={editingUser}
                onSubmit={formMode === 'create'
                    ? async (payload) => {
                        await handleCreate(payload);
                        setIsCreateOpen(false);
                    }
                    : async (payload) => {
                        if (!editingUser) return;
                        setLoading(true);
                        try {
                            const token = localStorage.getItem('token');
                            const response = await fetch(`${API_URL}/staff/${editingUser.id}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify(payload)
                            });
                            const result = await response.json();
                            if (result.success) {
                                alert('Staff user updated successfully');
                                const updated = result.data;
                                setUsers(prev => prev.map(u =>
                                    u.id === editingUser.id
                                        ? {
                                            ...u,
                                            name: updated.name,
                                            email: updated.email,
                                            phone: updated.phone,
                                            roleId: updated.roleId,
                                            roleName: updated.roleId?.name || u.roleName,
                                            branchId: updated.branchId || null,
                                            branchScope: updated.branchId?.name || u.branchScope
                                        }
                                        : u
                                ));
                                setEditingUser(null);
                                setIsCreateOpen(false);
                            } else {
                                alert(result.message || 'Failed to update staff user');
                            }
                        } catch (error) {
                            console.error('Error updating staff user:', error);
                            alert('An error occurred while updating staff user');
                        } finally {
                            setLoading(false);
                        }
                    }}
                activeRoles={activeRoles}
                branches={branches}
                loading={loading}
            />

            <UserDetailDrawer
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                user={selectedUser}
                onChangeStatus={handleStatusChange}
                onChangeRole={() => setIsRoleChangeOpen(true)}
                isSuperAdmin={isSuperAdmin}
                onUpdateProfile={handleUpdateProfile}
                loading={loading}
            />

            <ChangeRoleModal
                isOpen={isRoleChangeOpen}
                onClose={() => setIsRoleChangeOpen(false)}
                user={selectedUser}
                roles={activeRoles}
                onConfirm={handleChangeRole}
            />
        </div>
    );
};

export default StaffUsers;

