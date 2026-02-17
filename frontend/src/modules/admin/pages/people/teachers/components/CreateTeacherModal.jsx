
import React, { useState, useEffect } from 'react';
import { X, UserPlus, Shield, Phone, Mail, Calendar, GraduationCap, Loader2, MapPin, FileText, Plus, Trash2 } from 'lucide-react';
import { API_URL } from '@/app/api';

const CreateTeacherModal = ({ isOpen, onClose, onCreate, roles = [], branches = [], loading = false }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        branchId: '',
        academicYearId: '',
        department: '',
        designation: '',
        academicLevel: '',
        experience: '',
        joiningDate: new Date().toISOString().split('T')[0],
        teachingStatus: 'Active',
        status: 'active',
        documents: []
    });
    const [departmentsForBranch, setDepartmentsForBranch] = useState([]);
    const [academicYearsForBranch, setAcademicYearsForBranch] = useState([]);
    const [docUploading, setDocUploading] = useState(false);

    useEffect(() => {
        if (!formData.branchId) {
            setDepartmentsForBranch([]);
            setAcademicYearsForBranch([]);
            return;
        }
        const token = localStorage.getItem('token');
        Promise.all([
            fetch(`${API_URL}/department?branchId=${formData.branchId}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then((r) => r.json()),
            fetch(`${API_URL}/academic-year?branchId=${formData.branchId}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then((r) => r.json())
        ])
            .then(([deptData, ayData]) => {
                setDepartmentsForBranch(deptData.success ? deptData.data : []);
                setAcademicYearsForBranch(ayData.success ? ayData.data : []);
            })
            .catch(() => {
                setDepartmentsForBranch([]);
                setAcademicYearsForBranch([]);
            });
    }, [formData.branchId]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const next = { ...prev, [name]: value };
            if (name === 'branchId') {
                next.academicYearId = '';
                next.department = '';
                next.designation = '';
            } else if (name === 'department') {
                next.designation = '';
            }
            return next;
        });
    };

    const selectedDept = departmentsForBranch.find((d) => d.name === formData.department);
    const designationsForDept = selectedDept?.designations?.filter((d) => d.status === 'Active') || [];

    const handleDocumentUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setDocUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('folder', 'teachers/documents');
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/upload/single`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd
            });
            const data = await res.json();
            if (data.success && data.url) {
                setFormData(prev => ({
                    ...prev,
                    documents: [...(prev.documents || []), { name: file.name, url: data.url, status: 'Pending' }]
                }));
            } else {
                alert(data.message || 'Upload failed');
            }
        } catch (err) {
            alert('Document upload failed');
        } finally {
            setDocUploading(false);
            e.target.value = '';
        }
    };

    const removeDocument = (index) => {
        setFormData(prev => ({
            ...prev,
            documents: (prev.documents || []).filter((_, i) => i !== index)
        }));
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

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <MapPin size={14} className="text-gray-400" /> Address
                            </label>
                            <textarea
                                name="address"
                                rows={3}
                                value={formData.address || ''}
                                onChange={handleChange}
                                placeholder="Full residential address"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Calendar size={14} className="text-gray-400" /> Academic Year
                            </label>
                            <select
                                name="academicYearId"
                                value={formData.academicYearId}
                                onChange={handleChange}
                                disabled={!formData.branchId}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium disabled:bg-gray-50 disabled:text-gray-400"
                            >
                                <option value="">{formData.branchId ? 'Select Academic Year' : 'Select Branch first'}</option>
                                {academicYearsForBranch.map(ay => (
                                    <option key={ay._id} value={ay._id}>{ay.name} {ay.status === 'active' ? '(Active)' : ''}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                disabled={!formData.branchId}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium disabled:bg-gray-50 disabled:text-gray-400"
                            >
                                <option value="">{formData.branchId ? 'Select Department' : 'Select Branch first'}</option>
                                {departmentsForBranch.map((d) => (
                                    <option key={d._id} value={d.name}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                            <select
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                disabled={!formData.department}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium disabled:bg-gray-50 disabled:text-gray-400"
                            >
                                <option value="">{formData.department ? 'Select Designation' : 'Select Department first'}</option>
                                {designationsForDept.map((d) => (
                                    <option key={d.code} value={d.name}>{d.name}</option>
                                ))}
                            </select>
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

                        {/* Section 3: Documents */}
                        <div className="md:col-span-2 border-b border-gray-100 pb-2 pt-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <FileText size={14} /> Documents
                            </h4>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            {(formData.documents || []).map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <FileText size={16} className="text-indigo-500 shrink-0" />
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 truncate hover:underline">{doc.name}</a>
                                        <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">{doc.status || 'Pending'}</span>
                                    </div>
                                    <button type="button" onClick={() => removeDocument(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <label className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors ${docUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                                <Plus size={18} className="text-indigo-500" />
                                <span className="text-sm font-medium text-gray-600">{docUploading ? 'Uploading...' : 'Add Document'}</span>
                                <input type="file" className="hidden" accept=".pdf,.doc,.docx,image/*" onChange={handleDocumentUpload} />
                            </label>
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
