
import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';

const ChangeRoleModal = ({ isOpen, onClose, user, roles, onConfirm }) => {

    const [selectedRole, setSelectedRole] = useState('');
    const [reason, setReason] = useState('');
    const [confirmation, setConfirmation] = useState(false);

    if (!isOpen || !user) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedRole || !reason || !confirmation) return;

        onConfirm(user.id, selectedRole, reason);
        onClose();
        // Reset state
        setSelectedRole('');
        setReason('');
        setConfirmation(false);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in border border-red-100">
                {/* Critical Header */}
                <div className="bg-red-50 px-6 py-4 flex items-center justify-between border-b border-red-100">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-red-700">
                        <ShieldAlert size={20} /> Critical Security Action
                    </h3>
                    <button onClick={onClose} className="hover:bg-red-100 p-1 rounded transition-colors text-red-700"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3 text-sm text-amber-800">
                        <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="font-bold">Warning: Access Revocation</p>
                            <p className="mt-1 opacity-90">
                                You are changing the role for <strong>{user.name}</strong> from <span className="font-mono bg-white px-1 border rounded">{user.roleName}</span> to a new role.
                            </p>
                            <ul className="list-disc list-inside mt-2 text-xs opacity-80">
                                <li>Current permissions will be immediately revoked.</li>
                                <li>The user will be forced to log out.</li>
                                <li>This action is logged in the security audit trail.</li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select New Role</label>
                        <select
                            required
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        >
                            <option value="">-- Choose Role --</option>
                            {roles.filter(r => r.id !== user.roleId).map(role => (
                                <option key={role.id} value={role.id}>
                                    {role.name} ({role.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Audit Reason (Mandatory)</label>
                        <textarea
                            required
                            rows="2"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Why is this role being changed?"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"
                        ></textarea>
                    </div>

                    <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
                        <input
                            type="checkbox"
                            required
                            id="confirm-role-change"
                            checked={confirmation}
                            onChange={(e) => setConfirmation(e.target.checked)}
                            className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                        />
                        <label htmlFor="confirm-role-change" className="text-sm text-gray-700">
                            I understand the consequences of this security change.
                        </label>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!selectedRole || !reason || !confirmation}
                            className="px-6 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Confirm Role Change
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ChangeRoleModal;
