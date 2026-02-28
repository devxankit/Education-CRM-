
import React, { useState } from 'react';
import { X, User, MapPin, Clock, Shield, LogOut, Lock } from 'lucide-react';
import UserStatusBadge from './UserStatusBadge';

const UserDetailDrawer = ({ isOpen, onClose, user, onChangeStatus, onChangeRole, onUpdateProfile, isSuperAdmin, loading }) => {

    if (!isOpen || !user) return null;

    const isActive = user.status === 'active';
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user.name || '',
        email: user.email || ''
    });

    const handleStatusToggle = () => {
        const newStatus = isActive ? 'suspended' : 'active';
        const action = isActive ? 'SUSPEND' : 'ACTIVATE';
        if (window.confirm(`Are you sure you want to ${action} this user?`)) {
            onChangeStatus(user.id, newStatus);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editForm.name || !editForm.email) {
            alert('Name and email are required');
            return;
        }
        onUpdateProfile && onUpdateProfile(user.id, {
            name: editForm.name,
            email: editForm.email
        });
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col transform transition-transform duration-300 animate-slide-in-right">

                {/* Header Profile */}
                <div className="relative bg-indigo-600 px-6 pt-10 pb-6 text-white text-center">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full text-white/80">
                        <X size={20} />
                    </button>

                    <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center text-indigo-600 text-2xl font-bold shadow-lg mb-3">
                        {user.name.substring(0, 2).toUpperCase()}
                    </div>

                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-indigo-200 text-sm mt-1">{user.email}</p>

                    <div className="mt-4 flex justify-center gap-2">
                        <UserStatusBadge status={user.status} />
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 border border-white/20 backdrop-blur-sm">
                            {user.roleName}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Personal Details / Edit */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex flex-col gap-3">
                        {!isEditing ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-gray-800">Personal Details</p>
                                        <p className="text-xs text-gray-500">Name and contact email</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className="text-sm text-gray-700">
                                    <div className="mb-1"><span className="font-medium">Name:</span> {user.name}</div>
                                    <div className="mb-1"><span className="font-medium">Email:</span> {user.email}</div>
                                </div>
                            </>
                        ) : (
                            <form onSubmit={handleEditSubmit} className="space-y-3">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Edit Personal Details</p>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => { setIsEditing(false); setEditForm({ name: user.name || '', email: user.email || '' }); }}
                                        className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Info Card */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <MapPin size={16} className="text-gray-400" />
                            <span>Branch Scope: <strong>{user.branchScope}</strong></span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Clock size={16} className="text-gray-400" />
                            <span>Last Login: {user.lastLogin || 'Never'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Shield size={16} className="text-gray-400" />
                            <span>Created By: {user.createdBy || 'System'}</span>
                        </div>
                    </div>

                    {/* Actions Panel */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Account Actions</h4>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700">
                                <span className="flex items-center gap-2"><Lock size={16} className="text-gray-400" /> Reset Password</span>
                            </button>

                            <button className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700">
                                <span className="flex items-center gap-2"><LogOut size={16} className="text-gray-400" /> Force Logout</span>
                            </button>

                            {isSuperAdmin && (
                                <button
                                    onClick={onChangeRole}
                                    className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-indigo-600 font-medium"
                                >
                                    <span className="flex items-center gap-2"><Shield size={16} /> Assign Different Role</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Warning */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={handleStatusToggle}
                        className={`w-full py-2.5 rounded-lg text-sm font-bold border transition-colors ${isActive
                                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                                : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                            }`}
                    >
                        {isActive ? 'Suspend Account' : 'Activate Account'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default UserDetailDrawer;
