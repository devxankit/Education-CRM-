
import React, { useState, useEffect } from 'react';
import { X, Save, User, BookOpen, Truck, ShieldCheck, FileText, Loader2, Camera, MapPin, School, Calendar, Mail, Flag } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

const StudentEditPortal = ({ student, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');

    // Admin Store Data
    const branches = useAdminStore(state => state.branches);
    const fetchBranches = useAdminStore(state => state.fetchBranches);
    const classes = useAdminStore(state => state.classes);
    const fetchClasses = useAdminStore(state => state.fetchClasses);
    const sectionsObj = useAdminStore(state => state.sections);
    const fetchSections = useAdminStore(state => state.fetchSections);
    const academicYears = useAdminStore(state => state.academicYears);
    const fetchAcademicYears = useAdminStore(state => state.fetchAcademicYears);
    const courses = useAdminStore(state => state.courses);
    const fetchCourses = useAdminStore(state => state.fetchCourses);
    const transportRoutes = useAdminStore(state => state.transportRoutes);
    const fetchTransportRoutes = useAdminStore(state => state.fetchTransportRoutes);

    useEffect(() => {
        if (isOpen) {
            fetchBranches();
            fetchAcademicYears();
            fetchTransportRoutes('main');
        }
    }, [isOpen, fetchBranches, fetchAcademicYears, fetchTransportRoutes]);

    useEffect(() => {
        if (student) {
            setFormData({
                ...student,
                branchId: student.branchId?._id || student.branchId,
                classId: student.classId?._id || student.classId,
                sectionId: student.sectionId?._id || student.sectionId,
                academicYearId: student.academicYearId?._id || student.academicYearId,
                courseId: student.courseId?._id || student.courseId,
                routeId: student.routeId,
                stopId: student.stopId,
            });
        }
    }, [student, isOpen]);

    useEffect(() => {
        if (formData.branchId) {
            fetchClasses(formData.branchId);
            if (formData.academicYearId) {
                fetchCourses(formData.branchId, formData.academicYearId);
            }
        }
    }, [formData.branchId, formData.academicYearId, fetchClasses, fetchCourses]);

    useEffect(() => {
        if (formData.classId) {
            fetchSections(formData.classId);
        }
    }, [formData.classId, fetchSections]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        // Mutual exclusion: Class and Course cannot be selected together
        if (field === 'classId') {
            setFormData(prev => ({ ...prev, classId: value, sectionId: '', courseId: '' }));
        } else if (field === 'courseId') {
            setFormData(prev => ({ ...prev, courseId: value, classId: '', sectionId: '' }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleBranchChange = (branchId) => {
        setFormData(prev => ({ ...prev, branchId, classId: '', sectionId: '', courseId: '' }));
    };

    const handleFileUpload = (field, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    documents: {
                        ...prev.documents,
                        [field]: {
                            ...prev.documents?.[field],
                            base64: reader.result,
                            name: file.name,
                            status: 'Uploaded',
                            date: new Date().toLocaleDateString()
                        }
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(formData._id || student._id, formData);
            onClose();
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'personal', label: 'Personal', icon: User },
        { id: 'academic', label: 'Academic', icon: BookOpen },
        { id: 'logistics', label: 'Logistics', icon: Truck },
        { id: 'documents', label: 'Documents', icon: FileText },
    ];

    const currentSections = sectionsObj[formData.classId] || [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>

            <div className="relative w-full max-w-4xl bg-gray-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full max-h-[95vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
                <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Edit Student Profile</h2>
                        <p className="text-xs text-gray-500 font-medium tracking-tight">Updating: {student.firstName} {student.lastName} • {student.admissionNo}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="bg-white px-6 flex border-b border-gray-100 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap
                                ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600 bg-indigo-50/10' : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <form id="edit-student-form" onSubmit={handleSubmit} className="space-y-6">

                        {activeTab === 'personal' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">First Name</label>
                                        <input type="text" value={formData.firstName || ''} onChange={(e) => handleChange('firstName', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Middle Name</label>
                                        <input type="text" value={formData.middleName || ''} onChange={(e) => handleChange('middleName', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Last Name</label>
                                        <input type="text" value={formData.lastName || ''} onChange={(e) => handleChange('lastName', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Date of Birth</label>
                                        <input type="date" value={formData.dob ? formData.dob.split('T')[0] : ''} onChange={(e) => handleChange('dob', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Age</label>
                                        <div className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-500">
                                            {formData.dob
                                                ? (() => {
                                                    const dob = new Date(formData.dob);
                                                    const today = new Date();
                                                    let age = today.getFullYear() - dob.getFullYear();
                                                    const m = today.getMonth() - dob.getMonth();
                                                    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
                                                    return `${age} ${age === 1 ? 'year' : 'years'}`;
                                                })()
                                                : '—'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Gender</label>
                                        <select value={formData.gender || ''} onChange={(e) => handleChange('gender', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold">
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Blood Group</label>
                                        <select value={formData.bloodGroup || ''} onChange={(e) => handleChange('bloodGroup', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold">
                                            <option value="">Select</option>
                                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Nationality</label>
                                        <input type="text" value={formData.nationality || 'Indian'} onChange={(e) => handleChange('nationality', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Religion</label>
                                        <select value={formData.religion || ''} onChange={(e) => handleChange('religion', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold">
                                            <option value="">Select</option>
                                            {['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Other'].map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Category</label>
                                        <select value={formData.category || 'General'} onChange={(e) => handleChange('category', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold">
                                            {['General', 'OBC', 'SC', 'ST'].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
                                    <h4 className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2"><Mail size={12} /> Contact & Family Access</h4>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Parent Email (Account Login)</label>
                                        <input type="email" value={formData.parentEmail || ''} onChange={(e) => handleChange('parentEmail', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold" />
                                    </div>
                                </div>
                                <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
                                    <h4 className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2"><MapPin size={12} /> Address Details</h4>
                                    <textarea value={formData.address || ''} onChange={(e) => handleChange('address', e.target.value)} rows="2" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold resize-none" placeholder="Residential Address"></textarea>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">City</label>
                                            <input type="text" value={formData.city || ''} onChange={(e) => handleChange('city', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Pincode</label>
                                            <input type="text" value={formData.pincode || ''} onChange={(e) => handleChange('pincode', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'academic' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Campus / Branch</label>
                                        <select value={formData.branchId || ''} onChange={(e) => handleBranchChange(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold">
                                            <option value="">Select Campus</option>
                                            {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Academic Year</label>
                                        <select value={formData.academicYearId || ''} onChange={(e) => handleChange('academicYearId', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold">
                                            <option value="">Select Year</option>
                                            {academicYears.map(ay => <option key={ay._id} value={ay._id}>{ay.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Admission Date</label>
                                        <input type="date" value={formData.admissionDate ? formData.admissionDate.split('T')[0] : ''} onChange={(e) => handleChange('admissionDate', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Class</label>
                                        <select value={formData.classId || ''} onChange={(e) => handleChange('classId', e.target.value)} disabled={!!formData.courseId} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold disabled:opacity-50">
                                            <option value="">{formData.courseId ? 'Cannot select - Course selected' : 'Select Class'}</option>
                                            {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Section</label>
                                        <select value={formData.sectionId || ''} onChange={(e) => handleChange('sectionId', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold text-black disabled:opacity-50" disabled={!formData.classId || !!formData.courseId}>
                                            <option value="">{formData.classId ? (formData.courseId ? 'Cannot select - Course selected' : 'Select Section') : 'Select Class First'}</option>
                                            {currentSections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider flex items-center gap-1"><School size={10} /> Course / Program</label>
                                        <select value={formData.courseId || ''} onChange={(e) => handleChange('courseId', e.target.value)} disabled={!!formData.classId} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold disabled:opacity-50">
                                            <option value="">{formData.classId ? 'Cannot select - Class selected' : 'Select Course'}</option>
                                            {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Roll No</label>
                                        <input type="text" value={formData.rollNo || ''} onChange={(e) => handleChange('rollNo', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Profile Status</label>
                                        <select value={formData.status || 'active'} onChange={(e) => handleChange('status', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold">
                                            {['active', 'inactive'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
                                    <h4 className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2"><Calendar size={12} /> Previous Academic History</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Previous School Name</label>
                                            <input type="text" value={formData.prevSchool || ''} onChange={(e) => handleChange('prevSchool', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Last Class Passed</label>
                                            <input type="text" value={formData.lastClass || ''} onChange={(e) => handleChange('lastClass', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'logistics' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className={`p-6 rounded-2xl border transition-all ${formData.transportRequired ? 'bg-white border-indigo-200 shadow-lg ring-1 ring-indigo-50' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${formData.transportRequired ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'}`}><Truck size={20} /></div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">School Transport</h4>
                                                <p className="text-[10px] text-gray-400 font-medium tracking-tight">Daily commute bus service</p>
                                            </div>
                                        </div>
                                        <input type="checkbox" checked={formData.transportRequired || false} onChange={(e) => handleChange('transportRequired', e.target.checked)} className="w-6 h-6 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-transform active:scale-90" />
                                    </div>
                                    {formData.transportRequired && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Select Route</label>
                                                <select
                                                    value={formData.routeId || ''}
                                                    onChange={(e) => handleChange('routeId', e.target.value)}
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500 font-bold"
                                                >
                                                    <option value="">Select Route</option>
                                                    {transportRoutes.map(r => (
                                                        <option key={r._id} value={r._id}>{r.name} ({r.code})</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {formData.routeId && (
                                                <div>
                                                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Select Stop</label>
                                                    <select
                                                        value={formData.stopId || ''}
                                                        onChange={(e) => handleChange('stopId', e.target.value)}
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500 font-bold"
                                                    >
                                                        <option value="">Select Stop</option>
                                                        {transportRoutes.find(r => r._id === formData.routeId)?.stops?.map(s => (
                                                            <option key={s._id} value={s._id}>{s.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className={`p-6 rounded-2xl border transition-all ${formData.hostelRequired ? 'bg-white border-orange-200 shadow-lg ring-1 ring-orange-100' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${formData.hostelRequired ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-500'}`}><BookOpen size={20} /></div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">Hostel Required</h4>
                                                <p className="text-[10px] text-gray-400 font-medium tracking-tight">On-campus residential facility</p>
                                            </div>
                                        </div>
                                        <input type="checkbox" checked={formData.hostelRequired || false} onChange={(e) => handleChange('hostelRequired', e.target.checked)} className="w-6 h-6 rounded-lg border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer transition-transform active:scale-90" />
                                    </div>
                                    {formData.hostelRequired && (
                                        <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Room Preference</label>
                                                <select value={formData.roomType || ''} onChange={(e) => handleChange('roomType', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500 font-bold">
                                                    <option value="">Select Room</option>
                                                    <option value="AC">AC Room</option>
                                                    <option value="Non-AC">Non-AC Room</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Bed Type</label>
                                                <select value={formData.bedType || ''} onChange={(e) => handleChange('bedType', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500 font-bold">
                                                    <option value="">Select Bed</option>
                                                    <option value="Single">Single Bed</option>
                                                    <option value="Bunk">Bunk Bed</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'documents' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                                <div className="group relative text-center">
                                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-wider text-left">Student Photo</label>
                                    <div className="aspect-square w-40 rounded-3xl bg-white border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden relative group-hover:border-indigo-400 transition-all mx-auto shadow-sm">
                                        {formData.documents?.photo?.url || formData.documents?.photo?.base64 ? (
                                            <img src={formData.documents.photo.base64 || formData.documents.photo.url} alt="Student" className="w-full h-full object-cover" />
                                        ) : (
                                            <Camera size={40} className="text-gray-300" />
                                        )}
                                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload('photo', e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full">CHANGE PHOTO</span></div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Verification Documents</label>
                                    {[
                                        { id: 'birthCert', label: 'Birth Certificate' },
                                        { id: 'transferCert', label: 'Transfer Certificate' },
                                        { id: 'aadhar', label: 'Aadhaar Card Copy' },
                                        { id: 'prevMarksheet', label: 'Previous Marksheet' }
                                    ].map(doc => (
                                        <div key={doc.id} className="p-3 border border-gray-200 rounded-2xl bg-white flex items-center justify-between group-hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-lg ${formData.documents?.[doc.id]?.url ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}><FileText size={16} /></div>
                                                <span className="text-xs font-bold text-gray-700">{doc.label}</span>
                                            </div>
                                            <input type="file" onChange={(e) => handleFileUpload(doc.id, e)} className="text-[10px] text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer max-w-[120px]" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                    <button type="submit" form="edit-student-form" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-2.5 rounded-xl font-bold shadow-xl shadow-indigo-100 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50">
                        {isSaving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Update Profile</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentEditPortal;
