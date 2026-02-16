import React, { useState, useEffect } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, User, Phone, Mail, MapPin, Briefcase, GraduationCap, Calendar, Shield, X, Loader2, Sparkles, Folder } from 'lucide-react';
import { useStaffStore } from '../../../store/staffStore';
import { useAdminStore } from '../../../store/adminStore';
import { API_URL } from '@/app/api';
import toast from 'react-hot-toast';

const AddTeacher = () => {
    const { user } = useStaffAuth();
    const navigate = useNavigate();
    const { teacherId } = useParams();
    const isEditMode = !!teacherId;

    const teachers = useStaffStore(state => state.teachers);
    const addTeacher = useStaffStore(state => state.addTeacher);
    const updateTeacher = useStaffStore(state => state.updateTeacher);

    const branches = useAdminStore(state => state.branches);
    const fetchBranches = useAdminStore(state => state.fetchBranches);

    const [isLoading, setIsLoading] = useState(false);
    const [departmentsForBranch, setDepartmentsForBranch] = useState([]);

    // Form State (Aligned with Admin + User extras)
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
        address: '',
        joiningDate: new Date().toISOString().split('T')[0],
        teachingStatus: 'Active',
        status: 'active',
        documents: [] // User extra
    });

    // Fetch Branches on Mount
    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    // Fetch Departments when Branch changes
    useEffect(() => {
        if (!formData.branchId) {
            setDepartmentsForBranch([]);
            return;
        }
        const staffUser = JSON.parse(localStorage.getItem('staff_user') || 'null');
        const token = staffUser?.token;

        if (token) {
            fetch(`${API_URL}/department?branchId=${formData.branchId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((r) => r.json())
                .then((data) => setDepartmentsForBranch(data.success ? data.data : []))
                .catch(() => setDepartmentsForBranch([]));
        }
    }, [formData.branchId]);

    // Handle Edit Mode Data Fetching
    useEffect(() => {
        if (isEditMode && teachers.length > 0) {
            const teacher = teachers.find(t => t.id === teacherId || t._id === teacherId);
            if (teacher) {
                setFormData({
                    firstName: teacher.firstName || '',
                    lastName: teacher.lastName || '',
                    email: teacher.email || teacher.contact?.email || '',
                    phone: teacher.phone || teacher.contact?.phone || '',
                    branchId: teacher.branchId?._id || teacher.branchId || '',
                    department: teacher.department || '',
                    designation: teacher.designation || '',
                    academicLevel: teacher.academicLevel || '',
                    experience: teacher.experience || '',
                    address: teacher.address || teacher.contact?.address || '',
                    joiningDate: teacher.joiningDate ? new Date(teacher.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    teachingStatus: teacher.teachingStatus || 'Active',
                    status: teacher.status || 'active',
                    documents: teacher.documents || []
                });
            }
        }
    }, [isEditMode, teacherId, teachers]);

    // Designations logic
    const selectedDept = departmentsForBranch.find((d) => d.name === formData.department);
    const designationsForDept = selectedDept?.designations?.filter((d) => d.status === 'Active') || [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const next = { ...prev, [name]: value };
            if (name === 'branchId') {
                next.department = '';
                next.designation = '';
            } else if (name === 'department') {
                next.designation = '';
            }
            return next;
        });
    };

    const handleDocumentAdd = () => {
        setFormData(prev => ({
            ...prev,
            documents: [...prev.documents, { name: '', url: '', status: 'Pending' }]
        }));
    };

    const handleDocumentChange = (index, field, value) => {
        const updatedDocs = [...formData.documents];
        updatedDocs[index][field] = value;
        setFormData({ ...formData, documents: updatedDocs });
    };

    const handleDocumentRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            documents: prev.documents.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let response;
            if (isEditMode) {
                response = await updateTeacher(teacherId, formData);
            } else {
                response = await addTeacher(formData);
            }

            if (response.success) {
                toast.success(`Teacher Record ${isEditMode ? 'Updated' : 'Created'} Successfully`);
                navigate('/staff/teachers');
            } else {
                toast.error(response.message || 'Operation failed');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-24 md:pb-12 min-h-screen bg-gray-50/50">
            {/* High-End Header */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 px-4 py-4 sm:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/staff/teachers')}
                            className="p-3 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-black text-gray-900 tracking-tight">
                                    {isEditMode ? 'Modify Faculty' : 'Add New Faculty'}
                                </h1>
                                <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    {isEditMode ? 'Edit Mode' : 'New Entry'}
                                </span>
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                Professional Staff Onboarding
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="px-4 py-8 sm:px-8 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Areas */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. Identity & Contact */}
                        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-2">
                                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm shadow-indigo-100">
                                    <User size={18} />
                                </div>
                                <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Identity & Contact</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <FormInput
                                    label="First Name"
                                    name="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="e.g. Rahul"
                                />
                                <FormInput
                                    label="Last Name"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="e.g. Sharma"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <FormInput
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    required
                                    icon={<Mail size={14} />}
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="rahul@example.com"
                                />
                                <FormInput
                                    label="Phone Number"
                                    name="phone"
                                    type="tel"
                                    icon={<Phone size={14} />}
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <MapPin size={12} className="text-indigo-400" /> Residential Address
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="2"
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-200 outline-none transition-all resize-none shadow-inner"
                                    placeholder="Full residential address..."
                                ></textarea>
                            </div>
                        </section>

                        {/* 2. Employment Details */}
                        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-2">
                                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 shadow-sm shadow-emerald-100">
                                    <Briefcase size={18} />
                                </div>
                                <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Employment Details</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Shield size={12} className="text-emerald-400" /> Branch Location <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="branchId" required
                                        value={formData.branchId} onChange={handleChange}
                                        className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-emerald-50 focus:bg-white focus:border-emerald-200 outline-none transition-all shadow-inner appearance-none"
                                    >
                                        <option value="">Select Branch</option>
                                        {branches.map(b => (
                                            <option key={b._id} value={b._id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        Department
                                    </label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        disabled={!formData.branchId}
                                        className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-emerald-50 focus:bg-white focus:border-emerald-200 outline-none transition-all shadow-inner appearance-none disabled:opacity-50"
                                    >
                                        <option value="">{formData.branchId ? 'Select Department' : 'Select Branch first'}</option>
                                        {departmentsForBranch.map((d) => (
                                            <option key={d._id} value={d.name}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        Designation
                                    </label>
                                    <select
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        disabled={!formData.department}
                                        className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-emerald-50 focus:bg-white focus:border-emerald-200 outline-none transition-all shadow-inner appearance-none disabled:opacity-50"
                                    >
                                        <option value="">{formData.department ? 'Select Designation' : 'Select Department first'}</option>
                                        {designationsForDept.map((d) => (
                                            <option key={d.code} value={d.name}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        Academic Level
                                    </label>
                                    <select
                                        name="academicLevel"
                                        value={formData.academicLevel} onChange={handleChange}
                                        className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-emerald-50 focus:bg-white focus:border-emerald-200 outline-none transition-all shadow-inner appearance-none"
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
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <FormInput
                                    label="Total Experience"
                                    name="experience"
                                    icon={<Sparkles size={14} />}
                                    value={formData.experience}
                                    onChange={handleChange}
                                    placeholder="e.g. 5 Years"
                                />
                                <FormInput
                                    label="Joining Date"
                                    name="joiningDate"
                                    type="date"
                                    icon={<Calendar size={14} />}
                                    value={formData.joiningDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </section>

                        {/* 3. Documents Section (User Extra) */}
                        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-50 rounded-xl text-amber-600 shadow-sm shadow-amber-100">
                                        <Folder size={18} />
                                    </div>
                                    <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Verification Documents</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleDocumentAdd}
                                    className="bg-amber-600 text-white p-2 rounded-xl hover:bg-amber-700 transition-colors shadow-lg shadow-amber-200"
                                >
                                    <Upload size={16} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.documents.map((doc, idx) => (
                                    <div key={idx} className="flex gap-4 items-end bg-gray-50/50 p-4 rounded-2xl border border-gray-100 animate-in slide-in-from-left-4 duration-300">
                                        <div className="flex-1 space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Document Name</label>
                                            <input
                                                type="text"
                                                value={doc.name}
                                                onChange={(e) => handleDocumentChange(idx, 'name', e.target.value)}
                                                className="w-full p-3 rounded-xl border border-gray-100 bg-white text-xs font-bold focus:ring-4 focus:ring-amber-50 outline-none transition-all"
                                                placeholder="e.g. Degree Certificate"
                                            />
                                        </div>
                                        <div className="flex-[2] space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Document URL / Path</label>
                                            <input
                                                type="text"
                                                value={doc.url}
                                                onChange={(e) => handleDocumentChange(idx, 'url', e.target.value)}
                                                className="w-full p-3 rounded-xl border border-gray-100 bg-white text-xs font-bold focus:ring-4 focus:ring-amber-50 outline-none transition-all"
                                                placeholder="Link to file..."
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleDocumentRemove(idx)}
                                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors border border-red-100"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                                {formData.documents.length === 0 && (
                                    <p className="text-center text-xs font-bold text-gray-400 py-4 italic">No documents attached yet.</p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Area - Status & Actions */}
                    <div className="space-y-8">
                        {/* Status Card */}
                        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">System Control</h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Teaching Status</label>
                                    <select
                                        name="teachingStatus"
                                        value={formData.teachingStatus} onChange={handleChange}
                                        className={`w-full p-4 rounded-2xl border border-gray-100 text-sm font-bold focus:ring-4 outline-none transition-all appearance-none 
                                            ${formData.teachingStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 ring-emerald-50' : 'bg-gray-50 text-gray-700 ring-gray-100'}`}
                                    >
                                        <option value="Active">🟢 Active Duty</option>
                                        <option value="On Leave">🟡 On Leave</option>
                                        <option value="Inactive">⚪ Inactive</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">System Status</label>
                                    <select
                                        name="status"
                                        value={formData.status} onChange={handleChange}
                                        className={`w-full p-4 rounded-2xl border border-gray-100 text-sm font-bold focus:ring-4 outline-none transition-all appearance-none
                                            ${formData.status === 'active' ? 'bg-blue-50 text-blue-700 ring-blue-50' : 'bg-rose-50 text-rose-700 ring-rose-50'}`}
                                    >
                                        <option value="active">Verified / Active</option>
                                        <option value="inactive">Draft / Inactive</option>
                                        <option value="suspended">Suspended Access</option>
                                    </select>
                                </div>

                                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                    <p className="text-[10px] font-bold text-indigo-700 leading-relaxed italic">
                                        * Credentials will be automatically generated and sent to the faculty email upon submission.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="space-y-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-[2rem] shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        {isEditMode ? 'Update Record' : 'Onboard Faculty'}
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/staff/teachers')}
                                className="w-full bg-white border border-gray-100 text-gray-600 font-black py-4 rounded-[2rem] hover:bg-gray-50 transition-all text-sm"
                            >
                                Discard Changes
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

// Internal Form Input Component
const FormInput = ({ label, icon, ...props }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            {icon && <span className="text-gray-400">{icon}</span>}
            {label}
            {props.required && <span className="text-red-500">*</span>}
        </label>
        <input
            {...props}
            className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-200 outline-none transition-all shadow-inner"
        />
    </div>
);

export default AddTeacher;
