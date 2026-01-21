
import React, { useState } from 'react';
import { Shield, UserCheck } from 'lucide-react';

const RolePermissionPanel = ({ isLocked }) => {

    // Matrix: Role -> [Can Send, Approval Required]
    const [permissions, setPermissions] = useState([
        { id: 'admin', role: 'Super Admin', canSend: true, approval: false },
        { id: 'teacher', role: 'Class Teacher', canSend: true, approval: true },
        { id: 'accountant', role: 'Accountant', canSend: true, approval: false },
        { id: 'reception', role: 'Front Desk', canSend: true, approval: true },
        { id: 'student', role: 'Student Rep', canSend: false, approval: true }
    ]);

    const handleChange = (id, field, value) => {
        if (isLocked) return;
        setPermissions(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <Shield className="text-purple-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Sending Permissions</h3>
                    <p className="text-xs text-gray-500">Who can broadcast messages?</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-5 py-3 border-b">Role</th>
                            <th className="px-5 py-3 border-b text-center">Can Send?</th>
                            <th className="px-5 py-3 border-b text-center">Approval Req?</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {permissions.map((perm) => (
                            <tr key={perm.id} className="hover:bg-gray-50">
                                <td className="px-5 py-3 font-medium text-gray-800">
                                    {perm.role}
                                </td>
                                <td className="px-5 py-3 text-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={perm.canSend}
                                            disabled={isLocked}
                                            onChange={(e) => handleChange(perm.id, 'canSend', e.target.checked)}
                                        />
                                        <div className={`w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} peer-checked:bg-purple-600`}></div>
                                    </label>
                                </td>
                                <td className="px-5 py-3 text-center">
                                    <div className={`transition-all ${!perm.canSend ? 'opacity-30 pointer-events-none' : ''}`}>
                                        <input
                                            type="checkbox"
                                            checked={perm.approval}
                                            disabled={isLocked}
                                            onChange={(e) => handleChange(perm.id, 'approval', e.target.checked)}
                                            className="w-4 h-4 text-orange-500 rounded cursor-pointer accent-orange-500"
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-500 flex gap-2">
                <UserCheck size={14} className="text-gray-400" />
                "Approval Required" means messages drafted by this role must be approved by an Admin before dispatch.
            </div>

        </div>
    );
};

export default RolePermissionPanel;
