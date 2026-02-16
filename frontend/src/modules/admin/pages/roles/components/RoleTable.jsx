
import React from 'react';
import { Shield, ChevronRight, Users, MapPin } from 'lucide-react';
import RoleStatusBadge from './RoleStatusBadge';

const RoleTable = ({ roles, onRowClick }) => {

    if (!roles || roles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                    <Shield className="text-gray-400" size={32} />
                </div>
                <h3 className="text-gray-900 font-semibold">No Roles Defined</h3>
                <p className="text-gray-500 text-sm mt-1">Create your first staff role to begin.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto overflow-visible">
            <table className="w-full text-left">
                <thead className="sticky top-0 z-10 bg-gray-100 border-b-2 border-gray-200 shadow-sm">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Role Identity</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Branch</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Permissions</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Assigned Users</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-4 w-12 text-right"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm bg-white">
                    {roles.map((role) => (
                        <tr
                            key={role.id}
                            onClick={() => onRowClick(role)}
                            className="group hover:bg-indigo-50/50 transition-colors cursor-pointer"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg shrink-0 ${role.type === 'system' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                        <Shield size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{role.name}</p>
                                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">{role.code}</p>
                                    </div>
                                </div>
                            </td>

                            <td className="px-6 py-4 align-middle">
                                <span className="inline-flex items-center gap-1.5 text-gray-600 text-xs">
                                    <MapPin size={12} className="text-gray-400" />
                                    {role.branchName || 'All Branches'}
                                </span>
                            </td>

                            <td className="px-6 py-4 align-middle">
                                <RoleStatusBadge type={role.type} />
                            </td>

                            <td className="px-6 py-4 align-middle">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium text-xs border border-indigo-100">
                                    <Shield size={12} />
                                    {Object.values(role.permissions || {}).filter(p => p?.accessible).length} Modules
                                </span>
                            </td>

                            <td className="px-6 py-4 align-middle">
                                <span className="inline-flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 text-xs font-medium">
                                    <Users size={14} className="text-gray-400" />
                                    {role.userCount ?? 0} Staff
                                </span>
                            </td>

                            <td className="px-6 py-4 align-middle">
                                <RoleStatusBadge status={role.status} />
                            </td>

                            <td className="px-4 py-4 text-right align-middle">
                                <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-500 transition-colors inline-block" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RoleTable;
