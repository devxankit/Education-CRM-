
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

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col p-6 bg-slate-50/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 font-['Poppins'] tracking-tight">Role Definitions</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage staff roles and their access permissions.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchRoles}
                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white bg-white border border-slate-200 shadow-sm rounded-lg transition-all active:scale-95"
                        title="Refresh List"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>
                    </button>

                    {isSuperAdmin && (
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium text-sm shadow-md shadow-indigo-200 active:scale-95"
                        >
                            <Plus size={18} /> Define New Role
                        </button>
                    )}
                </div>
            </div>

            {/* Main Table Card */}
            <div className="flex-1 min-h-0 flex flex-col mb-2 bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 overflow-hidden">
                {fetching ? (
                    <div className="flex-1 flex justify-center items-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            <p className="text-slate-400 text-sm font-medium">Loading roles...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <RoleTable
                            roles={roles}
                            onRowClick={(role) => setSelectedRole(role)}
                        />
                        {/* Footer Stats - Inside Card */}
                        <div className="border-t border-slate-50 bg-slate-50/50 px-6 py-3 flex justify-between items-center text-xs text-slate-400 font-medium shrink-0">
                            <span>Last synced: {new Date().toLocaleTimeString()}</span>
                            <span className="flex gap-3">
                                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> {roles.filter(r => r.type === 'system').length} System</span>
                                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> {roles.filter(r => r.type === 'custom').length} Custom</span>
                            </span>
                        </div>
                    </>
                )}
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
                onUpdatePermissions={handleUpdatePermissions}
                isSuperAdmin={isSuperAdmin}
                loading={loading}
            />
        </div>
    );
};

export default RolesList;