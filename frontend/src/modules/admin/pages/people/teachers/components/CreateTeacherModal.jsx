
import React, { useState } from 'react';
import { X, UserPlus, Shield, Phone, Mail, Calendar, GraduationCap, Loader2 } from 'lucide-react';

const CreateTeacherModal = ({ isOpen, onClose, onCreate, roles = [], branches = [], loading = false }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        branchId: '',
        department: '',
        designation: '',
        experience: '',
        joiningDate: new Date().toISOString().split('T')[0],
        teachingStatus: 'Active',
        status: 'active'
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <UserPlus size={20} /> Add New Teacher
                    </h3>
                    <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded transition-colors shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Section 1: Basic Info */}
                        <div className="md:col-span-2 border-b border-gray-100 pb-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Identity & Contact</h4>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                            <input
                                type="text" name="firstName" required
                                value={formData.firstName} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                            <input
                                type="text" name="lastName" required
                                value={formData.lastName} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Mail size={14} className="text-gray-400" /> Email *
                            </label>
                            <input
                                type="email" name="email" required
                                value={formData.email} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Phone size={14} className="text-gray-400" /> Phone
                            </label>
                            <input
                                type="tel" name="phone"
                                value={formData.phone} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        {/* Section 2: Work Info */}
                        <div className="md:col-span-2 border-b border-gray-100 pb-2 pt-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Employment Details</h4>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Shield size={14} className="text-gray-400" /> Branch *
                            </label>
                            <select
                                name="branchId" required
                                value={formData.branchId} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
                            >
                                <option value="">Select Branch</option>
                                {branches.map(b => (
                                    <option key={b._id} value={b._id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <input
                                type="text" name="department"
                                value={formData.department} onChange={handleChange}
                                placeholder="e.g. Science"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                            <input
                                type="text" name="designation"
                                value={formData.designation} onChange={handleChange}
                                placeholder="e.g. Senior Teacher"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <GraduationCap size={14} className="text-gray-400" /> Experience
                            </label>
                            <input
                                type="text" name="experience"
                                value={formData.experience} onChange={handleChange}
                                placeholder="e.g. 5 Years"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Calendar size={14} className="text-gray-400" /> Joining Date
                            </label>
                            <input
                                type="date" name="joiningDate"
                                value={formData.joiningDate} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teaching Status</label>
                            <select
                                name="teachingStatus"
                                value={formData.teachingStatus} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
                            >
                                <option value="Active">Active</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">System Status</label>
                            <select
                                name="status"
                                value={formData.status} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
                            >
                                <option value="active" className="text-green-600">Active</option>
                                <option value="inactive" className="text-gray-500">Inactive</option>
                                <option value="suspended" className="text-red-600">Suspended</option>
                            </select>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-5">
                        <button
                            type="button" onClick={onClose}
                            className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Confirm Add Teacher'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTeacherModal;
