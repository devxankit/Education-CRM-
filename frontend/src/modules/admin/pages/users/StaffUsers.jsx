
import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, Search } from 'lucide-react';

import StaffUsersTable from './components/StaffUsersTable';
import CreateStaffUserModal from './components/CreateStaffUserModal';
import ChangeRoleModal from './components/ChangeRoleModal';
import UserDetailDrawer from './components/UserDetailDrawer';
import { API_URL } from '../../../../app/api';

const StaffUsers = () => {
    // Data States
    const [users, setUsers] = useState([]);
    const [activeRoles, setActiveRoles] = useState([]);
    const [branches, setBranches] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);

    // UI States
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isRoleChangeOpen, setIsRoleChangeOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const isSuperAdmin = true;

    // -- API Calls --

    const fetchAllData = useCallback(async () => {
        setFetching(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch Staff, Roles and Branches in parallel
            const [staffRes, rolesRes, branchesRes] = await Promise.all([
                fetch(`${API_URL}/staff`, { headers }),
                fetch(`${API_URL}/role`, { headers }),
                fetch(`${API_URL}/branch`, { headers })
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
                    roleId: u.roleId?._id || u.roleId,
                    roleName: u.roleId?.name || 'No Role',
                    branchScope: u.branchId?.name || (u.branchId === 'all' || !u.branchId ? 'All Branches' : 'Single Branch'),
                    status: u.status,
                    lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never logged in'
                }));
                setUsers(transformed);
            }

            if (rolesData.success) {
                const transformedRoles = rolesData.data.map(r => ({ ...r, id: r._id }));
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
    }, []);

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

    // Filter Logic
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Staff User Management</h1>
                    <p className="text-gray-500 text-sm">Manage administrative access and security profiles.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Top Action Bar */}
            <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex gap-2">
                    <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-md border border-gray-100 font-medium">
                        Total Staff: {users.length}
                    </div>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                >
                    <UserPlus size={18} /> Add New User
                </button>
            </div>

            {/* List */}
            {fetching ? (
                <div className="flex justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <StaffUsersTable
                    users={filteredUsers}
                    onRowClick={(u) => setSelectedUser(u)}
                />
            )}

            {/* Modals */}
            <CreateStaffUserModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={handleCreate}
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

