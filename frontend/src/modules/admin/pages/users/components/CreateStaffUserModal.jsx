
import React, { useState, useEffect } from 'react';
import { UserPlus, X, Lock, Building } from 'lucide-react';

const EMPTY_FORM = {
    name: '',
    email: '',
    mobile: '',
    roleId: '',
    branchScope: 'all', // 'all' or specific branchId
};

const CreateStaffUserModal = ({ isOpen, onClose, mode = 'create', initialData, onSubmit, activeRoles, branches = [], loading }) => {

    const [formData, setFormData] = useState(EMPTY_FORM);

    const isEdit = mode === 'edit';

    useEffect(() => {
        if (!isOpen) return;
        if (isEdit && initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                mobile: initialData.phone || initialData.mobile || '',
                roleId: initialData.roleId || '',
                branchScope: initialData.branchId || 'all',
            });
        } else {
            setFormData(EMPTY_FORM);
        }
    }, [isOpen, isEdit, initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Map branchScope to branchId for backend consistency
        const submissionData = {
            ...formData,
            branchId: formData.branchScope === 'all' ? null : formData.branchScope
        };
        onSubmit && onSubmit(submissionData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <UserPlus size={20} /> {isEdit ? 'Edit Staff User' : 'Create Staff User'}
                    </h3>
                    <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Column 1: Identity */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Identity</h4>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text" name="name" required
                                value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Official Email</label>
                            <input
                                type="email" name="email" required
                                value={formData.email} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                            <input
                                type="tel" name="mobile" required
                                value={formData.mobile} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Column 2: Access & Security */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Access Control</h4>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Branch Scope</label>
                            <select
                                name="branchScope"
                                value={formData.branchScope} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                                <option value="all">Global Access (All Branches)</option>
                                {branches.map(branch => (
                                    <option key={branch._id} value={branch._id}>{branch.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Role</label>
                            <select
                                name="roleId" required
                                value={formData.roleId} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                                <option value="">Select Role</option>
                                {activeRoles.map(role => (
                                    <option key={role._id} value={role._id}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Footer - Full Width */}
                    <div className="md:col-span-2 pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button
                            type="button" onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-60"
                        >
                            {loading ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Account')}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateStaffUserModal;
