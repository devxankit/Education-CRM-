
import React, { useState } from 'react';
import { UserPlus, Search, ShieldCheck } from 'lucide-react';

import StaffUsersTable from './components/StaffUsersTable';
import CreateStaffUserModal from './components/CreateStaffUserModal';
import ChangeRoleModal from './components/ChangeRoleModal';
import UserDetailDrawer from './components/UserDetailDrawer';

const StaffUsers = () => {
    // Mock Data
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Vikram Singh',
            email: 'vikram.singh@edu.crm',
            roleId: 'role_admin',
            roleName: 'Super Admin',
            branchScope: 'all',
            status: 'active',
            lastLogin: 'Today, 10:30 AM'
        },
        {
            id: 2,
            name: 'Sarah Jen',
            email: 'sarah.j@edu.crm',
            roleId: 'role_teacher',
            roleName: 'Teacher',
            branchScope: 'branch_1',
            status: 'active',
            lastLogin: 'Yesterday'
        },
        {
            id: 3,
            name: 'Amit Kumar',
            email: 'amit.accounts@edu.crm',
            roleId: 'role_accountant',
            roleName: 'Accountant',
            branchScope: 'all',
            status: 'suspended',
            lastLogin: '2 days ago'
        }
    ]);

    // Mock Roles for Assign
    const activeRoles = [
        { id: 'role_admin', name: 'Super Admin', code: 'ROLE_ADMIN' },
        { id: 'role_teacher', name: 'Teacher', code: 'ROLE_TEACHER' },
        { id: 'role_accountant', name: 'Accountant', code: 'ROLE_ACCOUNTANT' }
    ];

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isRoleChangeOpen, setIsRoleChangeOpen] = useState(false);

    const isSuperAdmin = true;

    // Handlers
    const handleCreate = (data) => {
        const newUser = {
            id: Date.now(),
            ...data,
            roleName: activeRoles.find(r => r.id === data.roleId)?.name || 'Unknown',
            status: 'active',
            lastLogin: null
        };
        setUsers(prev => [newUser, ...prev]);
    };

    const handleStatusChange = (userId, newStatus) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        setSelectedUser(prev => prev ? { ...prev, status: newStatus } : null);
    };

    const handleChangeRole = (userId, newRoleId, reason) => {
        console.log(`Role Change for User ${userId} to ${newRoleId}. Reason: ${reason}`);

        const roleName = activeRoles.find(r => r.id === newRoleId)?.name;

        setUsers(prev => prev.map(u => u.id === userId ? { ...u, roleId: newRoleId, roleName } : u));
        setSelectedUser(null);
        // Toast success
    };

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
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Top Action Bar */}
            <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex gap-2">
                    {/* Filters placeholder */}
                    <select className="text-sm border-gray-300 rounded-md border p-1 bg-gray-50"><option>All Roles</option></select>
                    <select className="text-sm border-gray-300 rounded-md border p-1 bg-gray-50"><option>All Status</option></select>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                >
                    <UserPlus size={18} /> Add New User
                </button>
            </div>

            {/* List */}
            <StaffUsersTable
                users={users}
                onRowClick={setSelectedUser}
            />

            {/* Modals */}
            <CreateStaffUserModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={handleCreate}
                activeRoles={activeRoles}
            />

            <UserDetailDrawer
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                user={selectedUser}
                onChangeStatus={handleStatusChange}
                onChangeRole={() => setIsRoleChangeOpen(true)}
                isSuperAdmin={isSuperAdmin}
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
