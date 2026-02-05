
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
        <div className="h-full flex flex-col">
            <div className="overflow-x-auto flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Role Identity</th>
                            <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Default Access</th>
                            <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Assigned Users</th>
                            <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm bg-white">
                        {roles.map((role) => (
                            <tr
                                key={role.id}
                                onClick={() => onRowClick(role)}
                                className="group hover:bg-slate-50/80 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-indigo-500"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl ${role.type === 'system' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'} transition-transform group-hover:scale-110`}>
                                            <Shield size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{role.name}</p>
                                            <p className="text-[11px] text-slate-400 font-mono mt-0.5 uppercase tracking-wide">{role.code}</p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <RoleStatusBadge type={role.type} />
                                </td>

                                <td className="px-6 py-4 text-slate-500 font-medium">
                                    {role.defaultDashboard || 'Standard'}
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg w-fit border border-slate-100">
                                        <Users size={14} className="text-slate-400" />
                                        <span className="font-semibold text-xs">{role.userCount} Staff</span>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <RoleStatusBadge status={role.status} />
                                </td>

                                <td className="px-4 py-4 text-slate-300">
                                    <ChevronRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-indigo-400" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* removed footer from here as it is moved to parent */}
        </div>
    );
};

export default RoleTable;
