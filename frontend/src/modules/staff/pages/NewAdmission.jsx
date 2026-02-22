import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Save, CheckCircle, FileText, User as UserIcon, Calendar, MapPin, Mail, Phone, Truck, Home, CreditCard, School } from 'lucide-react';
import { useStaffStore } from '../../../store/staffStore';
import { useAdminStore } from '../../../store/adminStore';
import { useAppStore } from '../../../store';
import { getAllClasses, getSections } from '../services/class.api';

const NewAdmission = () => {
    const navigate = useNavigate();
    const { studentId } = useParams();
    const isEditMode = !!studentId;

    const students = useStaffStore(state => state.students);
    const addStudent = useStaffStore(state => state.addStudent);
    const updateStudent = useStaffStore(state => state.updateStudent);

    const user = useAppStore(state => state.user);
    const branches = useAdminStore(state => state.branches);
    const fetchBranches = useAdminStore(state => state.fetchBranches);
    const feeStructures = useAdminStore(state => state.feeStructures);
    const fetchFeeStructures = useAdminStore(state => state.fetchFeeStructures);
    const transportRoutes = useAdminStore(state => state.transportRoutes);
    const fetchTransportRoutes = useAdminStore(state => state.fetchTransportRoutes);
    const academicYears = useAdminStore(state => state.academicYears);
    const fetchAcademicYears = useAdminStore(state => state.fetchAcademicYears);
    const courses = useAdminStore(state => state.courses);
    const fetchCourses = useAdminStore(state => state.fetchCourses);

    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        dob: '',
        gender: '',
        bloodGroup: '',
        nationality: 'Indian',
        religion: '',
        category: '',

        branchId: '',
        academicYearId: '',
        classId: '',
        sectionId: '',
        courseId: '',
        admissionDate: new Date().toISOString().split('T')[0],
        admissionNo: `ADM-${new Date().getFullYear()}-XXXX`,
        prevSchool: '',
        lastClass: '',

        parentName: '',
        parentMobile: '',
        parentEmail: '',
        address: '',
        city: '',
        pincode: '',

        transportRequired: false,
        routeId: '',
        stopId: '',
        hostelRequired: false,
        bedType: '',
        roomType: '',

        documents: {},
        admissionFee: {
            collectNow: false,
            feeStructureId: '',
            amount: '',
            paymentMethod: 'Cash',
            transactionId: '',
            remarks: ''
        }
    });

    // Fetch Initial Data
    useEffect(() => {
        fetchBranches();
        fetchAcademicYears();
        fetchTransportRoutes('main');
    }, [fetchBranches, fetchAcademicYears, fetchTransportRoutes]);

    // Handle initial branch assignment
    useEffect(() => {
        if (!formData.branchId && branches.length > 0) {
            const defaultBranch = (user?.role === 'Staff' && user?.branchId !== 'all')
                ? user.branchId
                : branches[0]._id;
            if (defaultBranch) {
                setFormData(prev => ({ ...prev, branchId: defaultBranch }));
            }
        }
    }, [branches, user, formData.branchId]);

    // Fetch Classes based on branch
    useEffect(() => {
        if (formData.branchId) {
            const fetchClassesForBranch = async () => {
                const data = await getAllClasses(formData.branchId);
                setClasses(data);
            };
            fetchClassesForBranch();
        }
    }, [formData.branchId]);

    // Fetch Fee Structures and Courses when branch/year changes
    useEffect(() => {
        if (formData.branchId) {
            const activeYear = academicYears.find(y => y.status === 'active') || academicYears[0];
            if (activeYear) {
                if (!formData.academicYearId) {
                    setFormData(prev => ({ ...prev, academicYearId: activeYear._id }));
                }
                fetchFeeStructures(formData.branchId, formData.academicYearId || activeYear._id);
                fetchCourses(formData.branchId, formData.academicYearId || activeYear._id);
            }
        }
    }, [formData.branchId, formData.academicYearId, academicYears, fetchFeeStructures, fetchCourses]);

    // Fetch Sections when Class changes
    useEffect(() => {
        const fetchSectionsData = async () => {
            if (formData.classId && formData.classId.length === 24) {
                const data = await getSections(formData.classId);
                setSections(data);
            } else {
                setSections([]);
            }
        };
        fetchSectionsData();
    }, [formData.classId]);

    // Fetch data for edit mode
    useEffect(() => {
        if (isEditMode && students.length > 0) {
            const student = students.find(s => s.id === studentId || s._id === studentId);
            if (student) {
                setFormData({
                    ...student,
                    firstName: student.firstName || '',
                    lastName: student.lastName || '',
                    classId: student.classId?._id || student.classId || '',
                    sectionId: student.sectionId?._id || student.sectionId || '',
                    courseId: student.courseId?._id || student.courseId || '',
                    parentName: student.parentId?.name || '',
                    parentMobile: student.parentId?.mobile || '',
                    parentEmail: student.parentEmail || student.email || '',
                    branchId: student.branchId?._id || student.branchId || '',
                    documents: student.documents || formData.documents,
                    admissionFee: student.admissionFee || formData.admissionFee
                });
            }
        }
    }, [isEditMode, studentId, students]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Mutual exclusion: Class and Course cannot be selected together
        if (name === 'classId') {
            // If class is selected, clear course
            setFormData({ ...formData, classId: value, sectionId: value ? formData.sectionId : '', courseId: '' });
        } else if (name === 'courseId') {
            // If course is selected, clear class and section
            setFormData({ ...formData, courseId: value, classId: '', sectionId: '' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e, docKey) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('File size should be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    [docKey]: {
                        name: file.name,
                        status: 'in_review',
                        date: new Date().toLocaleDateString(),
                        base64: reader.result
                    }
                }
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation: Either Class OR Course must be selected (mutual exclusion)
        if (!formData.classId && !formData.courseId) {
            alert("Please select either Class or Course/Program before submitting.");
            return;
        }
        
        // Ensure both are not selected (should not happen due to UI, but double-check)
        if (formData.classId && formData.courseId) {
            alert("Cannot select both Class and Course/Program. Please select only one.");
            return;
        }
        
        setLoading(true);

        try {
            // Default branchId if not in formData (usually provided by backend from req.user but good to be safe)
            const submissionData = {
                ...formData,
                status: 'in_review', // Explicitly set as requested
                // Remove empty courseId if not selected
                ...(formData.courseId === '' && { courseId: undefined })
            };

            if (isEditMode) {
                await updateStudent(studentId, submissionData);
            } else {
                await addStudent(submissionData);
            }

            setLoading(false);
            alert(`Student record ${isEditMode ? 'updated' : 'created'} successfully!`);
            navigate('/staff/students');
        } catch (error) {
            setLoading(false);
            alert(`Error: ${error.message || 'Operation failed'}`);
            console.error(error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 md:pb-6 min-h-screen p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all border border-transparent hover:border-gray-100">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">{isEditMode ? 'Update Record' : 'New Admission'}</h1>
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-0.5">
                            Academic Session {academicYears.find(y => y._id === formData.academicYearId)?.name || 'Loading...'}
                        </p>
                    </div>
                </div>
                {!isEditMode && (
                    <div className="hidden md:flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Default Status: In Review</span>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-8">
                    {/* 1. Student Details */}
                    <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <UserIcon size={18} />
                            </div>
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Personal Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    type="text"
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-200 outline-none transition-all"
                                    placeholder="First Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Middle Name</label>
                                <input
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                    type="text"
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-200 outline-none transition-all"
                                    placeholder="Middle Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    type="text"
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-200 outline-none transition-all"
                                    placeholder="Last Name"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    type="date"
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-200 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Age</label>
                                <div className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/80 text-sm font-bold text-gray-700">
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
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender <span className="text-red-500">*</span></label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-200 outline-none transition-all appearance-none"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Blood Group</label>
                                <select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-200 outline-none transition-all appearance-none"
                                >
                                    <option value="">Select</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nationality</label>
                                <input
                                    name="nationality"
                                    value={formData.nationality}
                                    onChange={handleChange}
                                    type="text"
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-200 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Religion</label>
                                <select
                                    name="religion"
                                    value={formData.religion}
                                    onChange={handleChange}
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-200 outline-none transition-all appearance-none"
                                >
                                    <option value="">Select</option>
                                    <option value="Hindu">Hindu</option>
                                    <option value="Muslim">Muslim</option>
                                    <option value="Christian">Christian</option>
                                    <option value="Sikh">Sikh</option>
                                    <option value="Jain">Jain</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-200 outline-none transition-all appearance-none"
                                >
                                    <option value="">Select</option>
                                    <option value="General">General</option>
                                    <option value="OBC">OBC</option>
                                    <option value="SC">SC</option>
                                    <option value="ST">ST</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* 2. Campus Selection */}
                    <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <MapPin size={18} />
                            </div>
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Campus Selection</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Campus <span className="text-red-500">*</span></label>
                                <select
                                    required
                                    name="branchId"
                                    value={formData.branchId}
                                    onChange={handleChange}
                                    disabled={user?.role === 'Staff' && user?.branchId !== 'all'}
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-200 outline-none transition-all disabled:opacity-50 appearance-none"
                                >
                                    <option value="">Select Campus</option>
                                    {branches.map(b => (
                                        <option key={b._id} value={b._id}>{b.name} ({b.code})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* 3. Academic Details */}
                    <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                <Calendar size={18} />
                            </div>
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Academic Enrollment</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Academic Year <span className="text-red-500">*</span></label>
                                <select
                                    required
                                    name="academicYearId"
                                    value={formData.academicYearId}
                                    onChange={handleChange}
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-purple-50 focus:bg-white focus:border-purple-200 outline-none transition-all appearance-none"
                                >
                                    <option value="">Select Year</option>
                                    {academicYears.map(ay => (
                                        <option key={ay._id} value={ay._id}>{ay.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Admission Number</label>
                                <input
                                    readOnly
                                    value={formData.admissionNo}
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-100/50 text-sm font-bold text-gray-500 outline-none cursor-not-allowed font-mono"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Admission Date <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    name="admissionDate"
                                    value={formData.admissionDate}
                                    onChange={handleChange}
                                    type="date"
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-purple-50 focus:bg-white focus:border-purple-200 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Class <span className="text-red-500">*</span></label>
                                <select
                                    required
                                    name="classId"
                                    value={formData.classId}
                                    onChange={handleChange}
                                    disabled={!!formData.courseId}
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-purple-50 focus:bg-white focus:border-purple-200 outline-none transition-all appearance-none disabled:opacity-50"
                                >
                                    <option value="">{formData.courseId ? 'Cannot select - Course selected' : 'Select Class'}</option>
                                    {classes.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Section</label>
                                <select
                                    required
                                    name="sectionId"
                                    value={formData.sectionId}
                                    onChange={handleChange}
                                    disabled={!formData.classId || !!formData.courseId}
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-purple-50 focus:bg-white focus:border-purple-200 outline-none transition-all appearance-none disabled:opacity-50"
                                >
                                    <option value="">{formData.classId ? (formData.courseId ? 'Cannot select - Course selected' : 'Select Section') : 'Select Class First'}</option>
                                    {sections.map(s => (
                                        <option key={s._id} value={s._id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                    <School size={12} /> Course / Program
                                </label>
                                <select
                                    name="courseId"
                                    value={formData.courseId}
                                    onChange={handleChange}
                                    disabled={!formData.branchId || !formData.academicYearId || !!formData.classId}
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-purple-50 focus:bg-white focus:border-purple-200 outline-none transition-all appearance-none disabled:opacity-50"
                                >
                                    <option value="">{formData.branchId && formData.academicYearId ? (formData.classId ? 'Cannot select - Class selected' : 'Select Course (Optional)') : 'Select Branch & Academic Year First'}</option>
                                    {(courses || []).map(c => (
                                        <option key={c._id} value={c._id}>{c.name} {c.code ? `(${c.code})` : ''}</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-gray-400 mt-1">Optional: Cannot select if Class is selected.</p>
                            </div>
                        </div>

                        {/* 4. Previous History */}
                        <div className="pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                    <School size={18} />
                                </div>
                                <h2 className="text-[11px] font-black text-gray-800 uppercase tracking-[0.2em]">Previous History</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Previous School Name</label>
                                    <input
                                        name="prevSchool"
                                        value={formData.prevSchool}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-amber-50 focus:bg-white focus:border-amber-200 outline-none transition-all"
                                        placeholder="Last Attended School"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Class Passed</label>
                                    <input
                                        name="lastClass"
                                        value={formData.lastClass}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-amber-50 focus:bg-white focus:border-amber-200 outline-none transition-all"
                                        placeholder="e.g. Class 5"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. Services (Optional) */}
                    <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                                <Truck size={18} />
                            </div>
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Services (Optional)</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Transport */}
                            <div className="space-y-4 p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Truck size={16} className="text-pink-500" />
                                        <span className="text-[11px] font-black uppercase text-gray-700">Transport</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, transportRequired: !formData.transportRequired })}
                                        className={`w-10 h-5 rounded-full transition-all relative ${formData.transportRequired ? 'bg-pink-500' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.transportRequired ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>
                                {formData.transportRequired && (
                                    <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Route</label>
                                            <select
                                                name="routeId"
                                                value={formData.routeId}
                                                onChange={handleChange}
                                                className="w-full p-3 rounded-xl border border-gray-100 bg-white text-xs font-bold focus:ring-4 focus:ring-pink-50 outline-none transition-all appearance-none"
                                            >
                                                <option value="">Select Route</option>
                                                {transportRoutes.map(r => (
                                                    <option key={r._id} value={r._id}>{r.name} ({r.code})</option>
                                                ))}
                                            </select>
                                        </div>
                                        {formData.routeId && (
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Stop</label>
                                                <select
                                                    name="stopId"
                                                    value={formData.stopId}
                                                    onChange={handleChange}
                                                    className="w-full p-3 rounded-xl border border-gray-100 bg-white text-xs font-bold focus:ring-4 focus:ring-pink-50 outline-none transition-all appearance-none"
                                                >
                                                    <option value="">Select Stop</option>
                                                    {transportRoutes.find(r => r._id === formData.routeId)?.stops?.map(s => (
                                                        <option key={s._id} value={s._id}>{s.name} ({s.pickupTime})</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Hostel */}
                            <div className="space-y-4 p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Home size={16} className="text-indigo-500" />
                                        <span className="text-[11px] font-black uppercase text-gray-700">Hostel</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, hostelRequired: !formData.hostelRequired })}
                                        className={`w-10 h-5 rounded-full transition-all relative ${formData.hostelRequired ? 'bg-indigo-500' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.hostelRequired ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>
                                {formData.hostelRequired && (
                                    <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-top-2 duration-300">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Room Preference</label>
                                                <select
                                                    name="roomType"
                                                    value={formData.roomType}
                                                    onChange={handleChange}
                                                    className="w-full p-3 rounded-xl border border-gray-100 bg-white text-xs font-bold focus:ring-4 focus:ring-indigo-50 outline-none transition-all appearance-none"
                                                >
                                                    <option value="">Select Room</option>
                                                    <option value="AC">AC Room</option>
                                                    <option value="Non-AC">Non-AC Room</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bed Type</label>
                                                <select
                                                    name="bedType"
                                                    value={formData.bedType}
                                                    onChange={handleChange}
                                                    className="w-full p-3 rounded-xl border border-gray-100 bg-white text-xs font-bold focus:ring-4 focus:ring-indigo-50 outline-none transition-all appearance-none"
                                                >
                                                    <option value="">Select Bed</option>
                                                    <option value="Single">Single Bed</option>
                                                    <option value="Bunk">Bunk Bed</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* 4. Parent / Guardian */}
                    <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <UserIcon size={18} />
                            </div>
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Parent & Contact Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Parent/Guardian Name <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <UserIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        required
                                        name="parentName"
                                        value={formData.parentName}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-emerald-50 focus:bg-white focus:border-emerald-200 outline-none transition-all"
                                        placeholder="e.g. Rajesh Kumar"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Parent Mobile <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        required
                                        name="parentMobile"
                                        value={formData.parentMobile}
                                        onChange={handleChange}
                                        type="tel"
                                        className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-emerald-50 focus:bg-white focus:border-emerald-200 outline-none transition-all"
                                        placeholder="e.g. 9876543210"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Parent/Guardian Email <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        required
                                        name="parentEmail"
                                        value={formData.parentEmail}
                                        onChange={handleChange}
                                        type="email"
                                        className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-emerald-50 focus:bg-white focus:border-emerald-200 outline-none transition-all"
                                        placeholder="parent@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Residential Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="2"
                                className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-emerald-50 focus:bg-white focus:border-emerald-200 outline-none transition-all resize-none"
                                placeholder="#123, Street, Landmark"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City / District</label>
                                <input
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    type="text"
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-emerald-50 focus:bg-white focus:border-emerald-200 outline-none transition-all"
                                    placeholder="City"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pincode</label>
                                <input
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    type="text"
                                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-emerald-50 focus:bg-white focus:border-emerald-200 outline-none transition-all"
                                    placeholder="6-digit Pincode"
                                />
                            </div>
                        </div>
                    </section>

                    {/* 5. Admission Fee Collection */}
                    <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <CreditCard size={18} />
                            </div>
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Admission Fee</h2>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <input
                                type="checkbox"
                                checked={formData.admissionFee.collectNow}
                                onChange={(e) => setFormData({ ...formData, admissionFee: { ...formData.admissionFee, collectNow: e.target.checked } })}
                                className="w-5 h-5 text-indigo-600 rounded-lg border-gray-200 focus:ring-4 focus:ring-indigo-50"
                            />
                            <span className="text-xs font-black text-gray-700 uppercase tracking-widest">Collect admission fee now</span>
                        </div>

                        {formData.admissionFee.collectNow && (
                            <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-top-2 duration-300">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Fee Structure <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        value={formData.admissionFee.feeStructureId}
                                        onChange={(e) => {
                                            const fs = feeStructures.find(f => f._id === e.target.value);
                                            const amt = fs?.installments?.[0]?.amount ?? fs?.totalAmount ?? '';
                                            setFormData({ ...formData, admissionFee: { ...formData.admissionFee, feeStructureId: e.target.value, amount: amt } });
                                        }}
                                        className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-200 outline-none transition-all appearance-none"
                                    >
                                        <option value="">Select Structure</option>
                                        {feeStructures.filter(fs => {
                                            if (!fs.applicableClasses?.length) return true;
                                            if (!formData.classId) return true;
                                            return fs.applicableClasses.map(c => c._id || c).includes(formData.classId);
                                        }).map(fs => (
                                            <option key={fs._id} value={fs._id}>
                                                {fs.name} {fs.totalAmount ? `– ₹${fs.totalAmount.toLocaleString('en-IN')}` : ''}
                                            </option>
                                        ))}
                                        {feeStructures.filter(fs => {
                                            if (!fs.applicableClasses?.length) return true;
                                            if (!formData.classId) return true;
                                            return fs.applicableClasses.map(c => c._id || c).includes(formData.classId);
                                        }).length === 0 && (
                                                <option value="" disabled>No fee structure for this branch/year</option>
                                            )}
                                    </select>
                                    {feeStructures.filter(fs => {
                                        if (!fs.applicableClasses?.length) return true;
                                        if (!formData.classId) return true;
                                        return fs.applicableClasses.map(c => c._id || c).includes(formData.classId);
                                    }).length === 0 && formData.branchId && (
                                            <p className="text-[10px] text-amber-600 mt-1 font-bold">Add a fee structure under Finance for this branch and academic year.</p>
                                        )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Amount (₹) <span className="text-red-500">*</span></label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.admissionFee.amount}
                                            onChange={(e) => setFormData({ ...formData, admissionFee: { ...formData.admissionFee, amount: e.target.value } })}
                                            className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-200 outline-none transition-all"
                                            placeholder={(() => {
                                                const fs = feeStructures.find(f => f._id === formData.admissionFee.feeStructureId);
                                                const suggested = fs?.installments?.[0]?.amount ?? fs?.totalAmount;
                                                return suggested ? `Suggested: ${suggested}` : 'Enter amount';
                                            })()}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Method</label>
                                        <select
                                            value={formData.admissionFee.paymentMethod}
                                            onChange={(e) => setFormData({ ...formData, admissionFee: { ...formData.admissionFee, paymentMethod: e.target.value } })}
                                            className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-200 outline-none transition-all appearance-none"
                                        >
                                            <option>Cash</option>
                                            <option>Cheque</option>
                                            <option>Bank Transfer</option>
                                            <option>Online</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Transaction / Reference ID</label>
                                        <input
                                            type="text"
                                            value={formData.admissionFee.transactionId}
                                            onChange={(e) => setFormData({ ...formData, admissionFee: { ...formData.admissionFee, transactionId: e.target.value } })}
                                            className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-200 outline-none transition-all"
                                            placeholder="Optional"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Remarks</label>
                                        <input
                                            type="text"
                                            value={formData.admissionFee.remarks}
                                            onChange={(e) => setFormData({ ...formData, admissionFee: { ...formData.admissionFee, remarks: e.target.value } })}
                                            className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm font-bold focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-200 outline-none transition-all"
                                            placeholder="e.g. First installment"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                <div className="space-y-8">
                    {/* 3. Documents Upload */}
                    <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                <FileText size={18} />
                            </div>
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Documents</h2>
                        </div>

                        <div className="space-y-4">
                            {[
                                { key: 'photo', name: 'Student Photograph', type: 'Image' },
                                { key: 'birthCert', name: 'Birth Certificate', type: 'PDF' },
                                { key: 'transferCert', name: 'Transfer Certificate (TC)', type: 'PDF' },
                                { key: 'aadhar', name: 'Aadhaar Card Copy', type: 'PDF' },
                                { key: 'prevMarksheet', name: 'Previous Year Marksheet', type: 'PDF' }
                            ].map((docType) => (
                                <div key={docType.key} className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{docType.name}</label>
                                    <div className="relative group overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 rounded-2xl transition-all cursor-pointer">
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(e, docType.key)}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            accept={docType.type === 'Image' ? "image/*" : ".pdf,.doc,.docx"}
                                        />
                                        <div className="p-4 flex items-center gap-4">
                                            {formData.documents[docType.key] ? (
                                                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0">
                                                    <CheckCircle size={20} />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 border border-gray-100 shrink-0">
                                                    <Upload size={18} />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-xs font-black text-gray-700 truncate">{formData.documents[docType.key]?.name || 'Click to upload'}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase">{formData.documents[docType.key] ? 'Ready for Cloud' : 'Max size 5MB'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 border-dashed">
                            <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                                Documents will be uploaded to Cloudinary Secure storage. Initial verification status will be determined by your account permissions.
                            </p>
                        </div>
                    </section>

                    {/* Submit Card */}
                    <div className="bg-gray-900 p-8 rounded-[2rem] shadow-xl shadow-gray-200 text-white space-y-6 sticky top-8">
                        <div>
                            <h3 className="text-lg font-black tracking-tight">System Checks</h3>
                            <p className="text-[11px] text-gray-400 font-bold mt-1">Review your data before finalizing</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-[11px] font-bold text-gray-300">
                                <CheckCircle size={14} className="text-emerald-400" /> Auto-ID Generation
                            </div>
                            <div className="flex items-center gap-3 text-[11px] font-bold text-gray-300">
                                <CheckCircle size={14} className="text-emerald-400" /> Parent Portal Sync
                            </div>
                            <div className="flex items-center gap-3 text-[11px] font-bold text-gray-300">
                                <CheckCircle size={14} className="text-emerald-400" /> Cloudinary Secure Upload
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all text-xs uppercase tracking-widest"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Save size={18} /> {isEditMode ? 'Update Admission' : 'Register Student'}
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default NewAdmission;
