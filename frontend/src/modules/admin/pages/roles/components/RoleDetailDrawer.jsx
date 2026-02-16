
import React, { useState, useEffect } from 'react';
import {
    X, Shield, Settings, Power, UserCheck, AlertTriangle, Save,
    LayoutDashboard, Users, GraduationCap, Briefcase,
    Banknote, Receipt, Bus, Box, FileText,
    Bell, LifeBuoy, BarChart2, ClipboardCheck
} from 'lucide-react';
import RoleStatusBadge from './RoleStatusBadge';

const MODULES_LIST = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { key: 'students', label: 'Students Management', icon: <GraduationCap size={18} /> },
    { key: 'teachers', label: 'Teacher Management', icon: <Users size={18} /> },
    { key: 'teacher-attendance', label: 'Teacher Attendance', icon: <ClipboardCheck size={18} /> },
    { key: 'employees', label: 'Employee Management', icon: <Briefcase size={18} /> },
    { key: 'fees', label: 'Fees & Collections', icon: <Banknote size={18} /> },
    { key: 'payroll', label: 'Payroll System', icon: <Receipt size={18} /> },
    { key: 'expenses', label: 'Expense Tracking', icon: <BarChart2 size={18} /> },
    { key: 'transport', label: 'Transport Management', icon: <Bus size={18} /> },
    { key: 'assets', label: 'Assets & Inventory', icon: <Box size={18} /> },
    { key: 'documents', label: 'Document Center', icon: <Shield size={18} /> },
    { key: 'notices', label: 'Notices & Announcements', icon: <Bell size={18} /> },
    { key: 'support', label: 'Helpdesk Support', icon: <LifeBuoy size={18} /> },
    { key: 'reports', label: 'System Reports', icon: <FileText size={18} /> },
    { key: 'settings', label: 'Global Settings', icon: <Settings size={18} /> },
];

const RoleDetailDrawer = ({
    isOpen,
    onClose,
    role,
    onStatusChange,
    onUpdatePermissions, // New Prop
    isSuperAdmin
}) => {

    // Derived Checks
    const isSystemRole = role?.type === 'system';
    const hasUsers = role?.userCount > 0;
    const isDeactivatable = !hasUsers && !isSystemRole;

    // Permissions State
    const [localPermissions, setLocalPermissions] = useState({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [saving, setSaving] = useState(false);

    // Sync state when role opens
    useEffect(() => {
        if (role && role.permissions) {
            setLocalPermissions(role.permissions);
        } else {
            setLocalPermissions({});
        }
        setHasUnsavedChanges(false);
    }, [role]);

    const togglePermission = (key) => {
        setLocalPermissions(prev => {
            const current = prev[key]?.accessible;
            return {
                ...prev,
                [key]: { accessible: !current } // Simple toggle for now
            };
        });
        setHasUnsavedChanges(true);
    };

    const handleSavePermissions = async () => {
        setSaving(true);
        try {
            await onUpdatePermissions(role.id, localPermissions);
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeactivate = () => {
        if (!isSuperAdmin) return;

        if (hasUsers) {
            alert("Cannot deactivate role with assigned users. Please reassign them first.");
            return;
        }

        if (window.confirm("Are you sure you want to deactivate this role?")) {
            onStatusChange(role.id, 'inactive', "Deactivated by admin");
        }
    };

    const handleActivate = () => {
        onStatusChange(role.id, 'active', "Re-activating role");
    };

    if (!isOpen || !role) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Drawer Panel */}
            <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col transform transition-transform duration-300 animate-slide-in-right border-l border-gray-100">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 font-['Poppins']">Role Configuration</h2>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                            <RoleStatusBadge type={role.type} />
                            <span>•</span>
                            <span className="font-mono">{role.code}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Identity Card */}
                    <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-5 rounded-xl shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-indigo-900">{role.name}</h3>
                                <p className="text-sm text-indigo-700 mt-1">{role.description}</p>
                            </div>
                            <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                                <Shield size={24} />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-4 text-xs font-medium text-indigo-600">
                            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-indigo-100">
                                <UserCheck size={14} /> {role.userCount} Assigned Users
                            </div>
                            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-indigo-100">
                                <Settings size={14} /> Def: {role.defaultDashboard}
                            </div>
                        </div>
                    </div>



                    {/* Permissions Configuration */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Module Access Control</h3>
                            {hasUnsavedChanges && (
                                <span className="text-xs text-amber-600 font-medium animate-pulse">Unsaved Changes</span>
                            )}
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
                            {MODULES_LIST.map((module) => {
                                const isAllowed = localPermissions[module.key]?.accessible;
                                return (
                                    <div key={module.key} className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${isAllowed ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                                                {module.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{module.label}</p>
                                                <p className="text-xs text-gray-500">{isAllowed ? 'Access Granted' : 'Restricted Access'}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => togglePermission(module.key)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAllowed ? 'bg-indigo-600' : 'bg-gray-200'
                                                }`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${isAllowed ? 'translate-x-6' : 'translate-x-1'
                                                }`} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Warning for System Role */}
                    {isSystemRole && (
                        <div className="bg-purple-50 p-4 rounded-lg flex gap-3 text-purple-800 text-xs border border-purple-100">
                            <Shield size={16} className="shrink-0 mt-0.5" />
                            <p>
                                This is a <strong>Core System Role</strong>. It cannot be deleted.
                                However, permissions can be customized to fit your institution's policy.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">

                    {hasUnsavedChanges && (
                        <button
                            onClick={handleSavePermissions}
                            disabled={saving}
                            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 transition-all flex justify-center items-center gap-2"
                        >
                            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={18} />}
                            Save Permission Changes
                        </button>
                    )}



                    {/* Secondary: Deactivate/Activate */}
                    {isSuperAdmin && (
                        <div className="flex justify-center">
                            {role.status === 'active' ? (
                                <button
                                    onClick={handleDeactivate}
                                    disabled={!isDeactivatable}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg
                                        ${!isDeactivatable
                                            ? 'text-gray-400 cursor-not-allowed opacity-60'
                                            : 'text-red-600 hover:bg-red-50'
                                        }
                                    `}
                                    title={!isDeactivatable ? (hasUsers ? "Cannot deactivate: has users" : "System role protected") : "Archive this role"}
                                >
                                    <Power size={16} />
                                    Deactivate Role
                                </button>
                            ) : (
                                <button
                                    onClick={handleActivate}
                                    className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Power size={16} />
                                    Activate Role
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoleDetailDrawer;
