
import React, { useState } from 'react';
import { Plus, Download, ShieldCheck } from 'lucide-react';

import RoleTable from './components/RoleTable';
import CreateRoleModal from './components/CreateRoleModal';
import RoleDetailDrawer from './components/RoleDetailDrawer';

const RolesList = () => {

    // Mock Data (System + Custom)
    const [roles, setRoles] = useState([
        {
            id: 1,
            name: 'Super Admin',
            code: 'ROLE_SUPER_ADMIN',
            type: 'system',
            description: 'Full access to all modules.',
            defaultDashboard: '/admin/dashboard',
            status: 'active',
            userCount: 2
        },
        {
            id: 2,
            name: 'Teacher',
            code: 'ROLE_TEACHER',
            type: 'system',
            description: 'Can manage classes, attendance, and marks.',
            defaultDashboard: '/staff/dashboard',
            status: 'active',
            userCount: 45
        },
        {
            id: 3,
            name: 'Accountant',
            code: 'ROLE_ACCOUNTANT',
            type: 'system',
            description: 'Manage fees and payroll.',
            defaultDashboard: '/finance/dashboard',
            status: 'active',
            userCount: 3
        },
        {
            id: 4,
            name: 'Lab Assistant',
            code: 'ROLE_LAB_ASSISTANT',
            type: 'custom',
            description: 'Manage inventory for Science Labs.',
            defaultDashboard: '/staff/dashboard',
            status: 'active',
            userCount: 0
        }
    ]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const isSuperAdmin = true; // Context

    // Handlers
    const handleCreate = (newRoleData) => {
        const newRole = {
            id: Date.now(),
            ...newRoleData,
            type: 'custom',
            status: 'active',
            userCount: 0
        };
        setRoles(prev => [...prev, newRole]);
        console.log("Created Role:", newRole);
    };

    const handleRowClick = (role) => {
        setSelectedRole(role);
    };

    const handleStatusChange = (id, newStatus, reason) => {
        console.log(`Role ${id} status change to ${newStatus}. Reason: ${reason}`);
        setRoles(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        setSelectedRole(prev => (prev?.id === id ? { ...prev, status: newStatus } : prev));
    };

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Role Definitions</h1>
                    <p className="text-gray-500 text-sm">Create and manage functional roles for staff access control.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        <Download size={16} /> Export Map
                    </button>
                    {isSuperAdmin && (
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                        >
                            <Plus size={18} /> Define New Role
                        </button>
                    )}
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3 mb-6">
                <ShieldCheck className="text-blue-600 mt-1 shrink-0" size={20} />
                <div className="text-sm text-blue-900">
                    <p className="font-semibold">Security Logic Active</p>
                    <p className="opacity-80 mt-1">
                        New roles are created with <strong>Zero Privileges</strong> by default.
                    </p>
                </div>
            </div>

            {/* Main Table */}
            <RoleTable
                roles={roles}
                onRowClick={handleRowClick}
            />

            {/* Stats */}
            <div className="mt-4 text-xs text-center text-gray-400">
                {roles.filter(r => r.type === 'system').length} System Roles • {roles.filter(r => r.type === 'custom').length} Custom Roles
            </div>

            {/* Drawers & Modals */}
            <CreateRoleModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={handleCreate}
            />

            <RoleDetailDrawer
                isOpen={!!selectedRole}
                onClose={() => setSelectedRole(null)}
                role={selectedRole}
                onStatusChange={handleStatusChange}
                isSuperAdmin={isSuperAdmin}
            />
        </div>
    );
};

export default RolesList;
