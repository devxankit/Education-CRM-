
import React from 'react';
import { User, Shield, MapPin, Pencil, Trash2, Power } from 'lucide-react';
import UserStatusBadge from './UserStatusBadge';

const StaffUsersTable = ({ users, onRowClick, onEdit, onDelete, onToggleStatus }) => {

    if (!users || users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <User className="text-gray-400" size={32} />
                </div>
                <h3 className="text-gray-900 font-medium">No Staff Users Found</h3>
                <p className="text-gray-500 text-sm mt-1">Create a new user to grant access to the platform.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-t-xl border border-gray-200 shadow-sm overflow-visible">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="sticky top-0 z-10 bg-gray-100 border-b-2 border-gray-200 shadow-sm">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">User Identity</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Assigned Role</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Branch Access</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider text-right">Last Login</th>
                            <th className="px-4 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {users.map((user) => {
                            const isActive = user.status === 'active';
                            return (
                            <tr
                                key={user.id}
                                className="group hover:bg-indigo-50/50 transition-colors"
                            >
                                <td className="px-6 py-4 cursor-pointer" onClick={() => onRowClick && onRowClick(user)}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                                            {user.name.substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 cursor-pointer" onClick={() => onRowClick && onRowClick(user)}>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Shield size={14} className="text-indigo-500" />
                                        <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-xs">
                                            {user.roleName}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 cursor-pointer" onClick={() => onRowClick && onRowClick(user)}>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                        <MapPin size={14} />
                                        {user.branchScope}
                                    </div>
                                </td>

                                <td className="px-6 py-4 cursor-pointer" onClick={() => onRowClick && onRowClick(user)}>
                                    <UserStatusBadge status={user.status} />
                                </td>

                                <td className="px-6 py-4 text-right text-gray-500 font-mono text-xs cursor-pointer" onClick={() => onRowClick && onRowClick(user)}>
                                    {user.lastLogin || 'Never'}
                                </td>

                                <td className="px-4 py-4">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() => onEdit && onEdit(user)}
                                            className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 bg-white shadow-sm"
                                            title="Edit user"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onToggleStatus && onToggleStatus(user)}
                                            className={`p-1.5 rounded-md border bg-white shadow-sm ${
                                                isActive
                                                    ? 'text-amber-600 border-amber-200 hover:bg-amber-50'
                                                    : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                                            }`}
                                            title={isActive ? 'Deactivate user' : 'Activate user'}
                                        >
                                            <Power size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete && onDelete(user)}
                                            className="p-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 bg-white shadow-sm"
                                            title="Delete user"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffUsersTable;
