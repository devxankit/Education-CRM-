
import React from 'react';
import { Shield, ChevronRight, Users } from 'lucide-react';
import RoleStatusBadge from './RoleStatusBadge';

const RoleTable = ({ roles, onRowClick }) => {

    if (!roles || roles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <Shield className="text-gray-400" size={32} />
                </div>
                <h3 className="text-gray-900 font-medium">No Roles Defined</h3>
                <p className="text-gray-500 text-sm mt-1">Create your first staff role to begin.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-medium border-b border-gray-100">Role Identity</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-100">Type</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-100">Default Access</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-100">Assigned Users</th>
                            <th className="px-6 py-4 font-medium border-b border-gray-100">Status</th>
                            <th className="px-4 py-4 border-b border-gray-100 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {roles.map((role) => (
                            <tr
                                key={role.id}
                                onClick={() => onRowClick(role)}
                                className="group hover:bg-indigo-50/30 transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${role.type === 'system' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                            <Shield size={18} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{role.name}</p>
                                            <p className="text-xs text-gray-500 font-mono mt-0.5">{role.code}</p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <RoleStatusBadge type={role.type} />
                                </td>

                                <td className="px-6 py-4 text-gray-600">
                                    {role.defaultDashboard}
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <Users size={14} className="text-gray-400" />
                                        <span className="font-medium">{role.userCount}</span>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <RoleStatusBadge status={role.status} />
                                </td>

                                <td className="px-4 py-4 text-gray-400">
                                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex justify-between">
                <span>Showing {roles.length} Roles</span>
                <span>System Definition</span>
            </div>
        </div>
    );
};

export default RoleTable;
