
import React, { useState, useEffect } from 'react';
import { Save, User, Phone, MapPin, Briefcase, Building2, GraduationCap, FileText, Plus, Trash2, Upload } from 'lucide-react';
import StudentLinkPanel from './StudentLinkPanel';
import { useAdminStore } from '../../../../../../store/adminStore';
import { API_URL } from '@/app/api';

const ParentForm = ({ parent: initialData, onSave, onCancel }) => {
    const branches = useAdminStore(state => state.branches);
    const academicYears = useAdminStore(state => state.academicYearsForSelect || state.academicYears || []);
    const fetchAcademicYears = useAdminStore(state => state.fetchAcademicYears);

    const [formData, setFormData] = useState({
        name: '',
        relationship: 'Father',
        mobile: '',
        email: '',
        occupation: '',
        address: '',
        status: 'Active',
        branchId: '',
        academicYearId: '',
        documents: [],
        linkedStudents: []
    });
    const [docUploading, setDocUploading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...initialData,
                documents: initialData.documents || [],
                linkedStudents: initialData.linkedStudents || prev.linkedStudents
            }));
        } else if (branches.length > 0) {
            setFormData(prev => ({ ...prev, branchId: branches[0]._id }));
        }
    }, [initialData, branches]);

    useEffect(() => {
        if (formData.branchId) {
            fetchAcademicYears(formData.branchId);
        }
    }, [formData.branchId, fetchAcademicYears]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDocumentUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setDocUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('folder', 'parents/documents');
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
                alert(data.message || 'Document upload failed');
            }
        } catch (error) {
            console.error('Parent document upload failed:', error);
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
        const { academicYearId, linkedStudents, ...rest } = formData;
        const submissionData = {
            ...rest,
            studentIds: linkedStudents.map(s => s._id).filter(Boolean)
        };
        onSave(submissionData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white">

            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Basic Info */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                        <User size={14} /> Basic Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g. Robert Smith"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                <Building2 size={12} className="text-gray-400" /> Campus / Branch
                            </label>
                            <select
                                required
                                value={formData.branchId}
                                onChange={(e) => { handleChange('branchId', e.target.value); handleChange('academicYearId', ''); }}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={initialData?._id}
                            >
                                <option value="" disabled>Select Campus</option>
                                {branches.map(b => (
                                    <option key={b._id} value={b._id}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                <GraduationCap size={12} className="text-gray-400" /> Academic Year
                            </label>
                            <select
                                required={!initialData?._id}
                                value={formData.academicYearId}
                                onChange={(e) => handleChange('academicYearId', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={initialData?._id || !formData.branchId}
                            >
                                <option value="" disabled>Select Academic Year</option>
                                {academicYears.map(ay => (
                                    <option key={ay._id} value={ay._id}>{ay.name || ay.label || ay.code || ay._id}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship <span className="text-red-500">*</span></label>
                            <select
                                value={formData.relationship}
                                onChange={(e) => handleChange('relationship', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="Father">Father</option>
                                <option value="Mother">Mother</option>
                                <option value="Guardian">Guardian</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Contact */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                        <Phone size={14} /> Contact Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                            <input
                                type="tel"
                                required
                                value={formData.mobile}
                                onChange={(e) => handleChange('mobile', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="+91 ...."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="parent@example.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Additional */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                        <Briefcase size={14} /> Other Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                            <input
                                type="text"
                                value={formData.occupation}
                                onChange={(e) => handleChange('occupation', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                rows="1"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                            <FileText size={14} /> Certificates & Documents
                        </h4>
                        <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-colors ${docUploading ? 'opacity-60 pointer-events-none border-gray-200 text-gray-400' : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50 cursor-pointer'}`}>
                            {docUploading ? <Upload size={14} /> : <Plus size={14} />}
                            {docUploading ? 'Uploading...' : 'Add Other'}
                            <input type="file" className="hidden" accept=".pdf,.doc,.docx,image/*" onChange={handleDocumentUpload} />
                        </label>
                    </div>

                    <div className="space-y-2">
                        {(formData.documents || []).map((doc, index) => (
                            <div key={`${doc.url || doc.name}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="p-2 bg-white rounded-lg border border-gray-200 text-indigo-500">
                                        <FileText size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="block text-sm font-medium text-indigo-600 truncate hover:underline">
                                            {doc.name}
                                        </a>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">{doc.status || 'Pending'}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeDocument(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                        {(!formData.documents || formData.documents.length === 0) && (
                            <div className="p-4 rounded-lg border border-dashed border-gray-200 text-xs text-gray-400 text-center">
                                No documents added yet.
                            </div>
                        )}
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Student Links */}
                <StudentLinkPanel
                    parentId={initialData?._id}
                    branchId={formData.branchId}
                    academicYearId={formData.academicYearId}
                    initialLinkedStudents={formData.linkedStudents}
                    onChange={(newList) => handleChange('linkedStudents', newList)}
                />

            </div>

            {/* Footer Button */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 rounded-b-xl">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-2"
                >
                    <Save size={16} /> Save Parent
                </button>
            </div>
        </form>
    );
};

export default ParentForm;
