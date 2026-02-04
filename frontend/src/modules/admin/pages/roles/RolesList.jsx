
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Download, ShieldCheck } from 'lucide-react';

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
    const isSuperAdmin = true;

    // -- API Calls --

    const fetchRoles = useCallback(async () => {
        setFetching(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/role`, {
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
    }, []);

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

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Role Definitions</h1>
                    <p className="text-gray-500 text-sm">Create and manage functional roles for staff access control.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-opacity-50 cursor-not-allowed">
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
            {fetching ? (
                <div className="flex justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <RoleTable
                    roles={roles}
                    onRowClick={(role) => setSelectedRole(role)}
                />
            )}

            {/* Stats */}
            <div className="mt-4 text-xs text-center text-gray-400">
                {roles.filter(r => r.type === 'system').length} System Roles • {roles.filter(r => r.type === 'custom').length} Custom Roles
            </div>

            {/* Drawers & Modals */}
            <CreateRoleModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={handleCreate}
                loading={loading}
            />

            <RoleDetailDrawer
                isOpen={!!selectedRole}
                onClose={() => setSelectedRole(null)}
                role={selectedRole}
                onStatusChange={handleStatusChange}
                isSuperAdmin={isSuperAdmin}
                loading={loading}
            />
        </div>
    );
};

export default RolesList;

