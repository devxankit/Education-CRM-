
import React, { useState } from 'react';
import { X, Shield, Settings, Power, UserCheck, AlertTriangle } from 'lucide-react';
import RoleStatusBadge from './RoleStatusBadge';

const RoleDetailDrawer = ({
    isOpen,
    onClose,
    role,
    onStatusChange,
    isSuperAdmin
}) => {

    // Derived Checks
    const isSystemRole = role?.type === 'system';
    const hasUsers = role?.userCount > 0;
    const isDeactivatable = !hasUsers && !isSystemRole;

    const handleDeactivate = () => {
        if (!isSuperAdmin) return;

        if (hasUsers) {
            alert("Cannot deactivate role with assigned users. Please reassign them first.");
            return;
        }

        const reason = window.prompt("To Deactivate this role, please provide a reason for the Audit Log:");
        if (reason) {
            onStatusChange(role.id, 'inactive', reason);
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
