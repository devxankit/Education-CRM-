
import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, GraduationCap } from 'lucide-react';

const EditTeacherModal = ({ isOpen, onClose, teacher, onSave, loading = false, branches = [] }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        branchId: '',
        department: '',
        designation: '',
        academicLevel: '',
        experience: '',
        joiningDate: '',
        teachingStatus: 'Active',
        status: 'active'
    });

    useEffect(() => {
        if (teacher) {
            setFormData({
                firstName: teacher.firstName || '',
                lastName: teacher.lastName || '',
                email: teacher.email || '',
                phone: teacher.phone || '',
                branchId: teacher.branchId?._id || teacher.branchId || '',
                department: teacher.department || '',
                designation: teacher.designation || '',
                academicLevel: teacher.academicLevel || '',
                experience: teacher.experience || '',
                joiningDate: teacher.joiningDate ? new Date(teacher.joiningDate).toISOString().split('T')[0] : '',
                teachingStatus: teacher.teachingStatus || 'Active',
                status: teacher.status || 'active'
            });
        }
    }, [teacher]);

    if (!isOpen || !teacher) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(teacher._id, formData);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Save size={20} /> Edit Teacher Details
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input
                                type="email" name="email" required
                                value={formData.email} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <input
                                type="text" name="department"
                                value={formData.department} onChange={handleChange}
                                placeholder="e.g. Science"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
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
                                <GraduationCap size={14} className="text-gray-400" /> Academic Level
                            </label>
                            <select
                                name="academicLevel"
                                value={formData.academicLevel} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
                            >
                                <option value="">Select Level</option>
                                <option value="Primary">Primary (1-5)</option>
                                <option value="Middle School">Middle School (6-8)</option>
                                <option value="High School">High School (9-10)</option>
                                <option value="Senior Secondary">Senior Secondary (11-12)</option>
                                <option value="Undergraduate">Undergraduate (UG)</option>
                                <option value="Postgraduate">Postgraduate (PG)</option>
                                <option value="Diploma">Diploma</option>
                                <option value="Vocational">Vocational Training</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                            <input
                                type="text" name="experience"
                                value={formData.experience} onChange={handleChange}
                                placeholder="e.g. 5 Years"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
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
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTeacherModal;
