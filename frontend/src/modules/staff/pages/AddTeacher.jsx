import React, { useState, useEffect } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, User, Phone, Mail, MapPin, Briefcase, BookOpen, Clock } from 'lucide-react';
import { useStaffStore } from '../../../store/staffStore';

const AddTeacher = () => {
    const { user } = useStaffAuth();
    const navigate = useNavigate();
    const { teacherId } = useParams();
    const isEditMode = !!teacherId;

    const { teachers, addTeacher, updateTeacher } = useStaffStore(state => ({
        teachers: state.teachers,
        addTeacher: state.addTeacher,
        updateTeacher: state.updateTeacher
    }));

    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        employeeId: '',
        doj: '',
        type: 'Permanent',
        email: '',
        phone: '',
        address: '',
        subjects: [],
        qualification: ''
    });

    // Handle Edit Mode Data Fetching
    useEffect(() => {
        if (isEditMode) {
            const teacher = teachers.find(t => t.id === teacherId);
            if (teacher) {
                setFormData({
                    ...teacher,
                    name: teacher.name || '',
                    employeeId: teacher.employeeId || '',
                    doj: teacher.doj || '',
                    type: teacher.type || 'Permanent',
                    email: teacher.contact?.email || '',
                    phone: teacher.contact?.phone || '',
                    address: teacher.contact?.address || '',
                    subjects: teacher.subjects || [],
                    qualification: teacher.qualification || ''
                });
            }
        }
    }, [isEditMode, teacherId, teachers]);

    // Redirect if not authorized (Safety Check)
    useEffect(() => {
        if (user && user.role !== STAFF_ROLES.DATA_ENTRY && user.role !== STAFF_ROLES.ADMIN) {
            navigate('/staff/teachers');
        }
    }, [user, navigate]);

    const handleSubjectChange = (e) => {
        const val = e.target.value;
        setFormData({ ...formData, subjects: val.split(',').map(s => s.trim()).filter(s => s !== '') });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            const finalData = {
                ...formData,
                contact: {
                    phone: formData.phone,
                    email: formData.email,
                    address: formData.address
                }
            };

            if (isEditMode) {
                updateTeacher(teacherId, finalData);
            } else {
                addTeacher(finalData);
            }

            setIsLoading(false);
            alert(`Teacher Record ${isEditMode ? 'Updated' : 'Created'} Successfully`);
            navigate('/staff/teachers');
        }, 1200);
    };

    return (
        <div className="max-w-3xl mx-auto pb-20 md:pb-10 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-gray-200 flex items-center gap-3 sticky top-0 z-10">
                <button onClick={() => navigate('/staff/teachers')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-900">{isEditMode ? 'Edit Teacher Record' : 'Add New Teacher'}</h1>
                    <p className="text-xs text-gray-500">{isEditMode ? 'Update faculty details' : 'Create a new faculty record'}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">

                {/* 1. Basic Information */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <User size={16} className="text-indigo-600" /> Basic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <InputField label="Full Name" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <InputField label="Employee ID" name="employeeId" value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} placeholder="e.g. EMP-T-101" required />
                        <InputField label="Date of Joining" name="doj" type="date" value={formData.doj} onChange={(e) => setFormData({ ...formData, doj: e.target.value })} required />

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Employment Type</label>
                            <div className="flex gap-4">
                                {['Permanent', 'Contract', 'Guest'].map(type => (
                                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            value={type}
                                            checked={formData.type === type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700 font-medium">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Contact Details */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Phone size={16} className="text-indigo-600" /> Contact Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Mobile Number" name="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                        <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                        <div className="md:col-span-2">
                            <InputField label="Residential Address" name="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* 3. Academic Info */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <BookOpen size={16} className="text-indigo-600" /> Academic & Qualification
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Subjects (Comma Separated)</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. Math, Physics, Science"
                                onChange={handleSubjectChange}
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Leave classes as Admin assigned only.</p>
                        </div>
                        <InputField label="Highest Qualification" name="qualification" value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} placeholder="e.g. M.Sc. Physics" />
                    </div>
                </div>

                {/* Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex justify-end gap-3 md:sticky md:bottom-0 md:rounded-xl z-20">
                    <button
                        type="button"
                        onClick={() => navigate('/staff/teachers')}
                        className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Saving...' : <><Save size={16} /> Save Record</>}
                    </button>
                </div>

            </form>
        </div>
    );
};

// Helper Input
const InputField = ({ label, type = "text", ...props }) => (
    <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{label}</label>
        <input
            type={type}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-300 font-medium text-gray-900"
            {...props}
        />
    </div>
);

export default AddTeacher;
