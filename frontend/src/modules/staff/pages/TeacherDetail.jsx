import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import {
    ArrowLeft, User, Phone, MapPin, Mail, Briefcase, BookOpen, Clock,
    FileText, CheckCircle, Shield, AlertCircle, Calendar
} from 'lucide-react';
import RoleBasedSection from '../components/students/RoleBasedSection';
import { useStaffStore } from '../../../store/staffStore';

// --- MOCK DATA REMOVED ---

const TeacherDetail = () => {
    const { teacherId } = useParams();
    const navigate = useNavigate();
    const { user } = useStaffAuth();
    const teachers = useStaffStore(state => state.teachers);

    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentRole = user?.role || STAFF_ROLES.FRONT_DESK;

    // Fetch teacher data from store based on ID
    useEffect(() => {
        setLoading(true);
        setError(null);

        // Simulate small delay for feel
        setTimeout(() => {
            const foundTeacher = teachers.find(t => t.id === teacherId);
            if (foundTeacher) {
                setTeacher(foundTeacher);
            } else {
                setError('Teacher not found');
            }
            setLoading(false);
        }, 100);
    }, [teacherId, teachers]);

    // Loading state
    if (loading) {
        return (
            <div className="max-w-5xl mx-auto p-10 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading teacher details...</p>
            </div>
        );
    }

    // Error state
    if (error || !teacher) {
        return (
            <div className="max-w-5xl mx-auto p-10 text-center">
                <p className="text-red-600 font-bold">{error || 'Teacher not found'}</p>
                <button
                    onClick={() => navigate('/staff/teachers')}
                    className="mt-4 text-indigo-600 hover:underline"
                >
                    ← Back to Teachers
                </button>
            </div>
        );
    }

    const InfoField = ({ label, value, icon: Icon }) => (
        <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                {Icon && <Icon size={10} />} {label}
            </label>
            <p className="text-sm font-bold text-gray-800 break-words">{value || '-'}</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto pb-20 md:pb-10 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-gray-200 sticky top-0 z-20 flex items-center gap-4 shadow-sm">
                <button onClick={() => navigate('/staff/teachers')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-bold text-gray-900 truncate">{teacher.name}</h1>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">{teacher.employeeId}</span>
                        <span>•</span>
                        <span className={teacher.status === 'Active' ? 'text-green-600 font-bold' : 'text-amber-600'}>{teacher.status}</span>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">

                {/* 1. Basic Info (All Roles) */}
                <RoleBasedSection
                    title="Profile & Overview"
                    role={currentRole}
                    allowedRoles={Object.values(STAFF_ROLES)}
                    editable={currentRole === STAFF_ROLES.DATA_ENTRY}
                    onEdit={() => navigate(`/staff/teachers/${teacherId}/edit`)}
                >
                    <InfoField label="Full Name" value={teacher.name} icon={User} />
                    <InfoField label="Employee ID" value={teacher.employeeId} icon={Shield} />
                    <InfoField label="Employment Type" value={teacher.type} icon={Briefcase} />
                    <InfoField label="Date of Joining" value={teacher.doj} icon={Calendar} />
                </RoleBasedSection>

                {/* 2. Academic Info (All Roles - Read Only) */}
                <RoleBasedSection
                    title="Academic Assignments"
                    role={currentRole}
                    allowedRoles={Object.values(STAFF_ROLES)}
                    editable={false} // Admin only usually
                >
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Assigned Subjects</label>
                            <div className="flex flex-wrap gap-2">
                                {teacher.academics.subjects.map(sub => (
                                    <span key={sub} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100">
                                        {sub}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Assigned Classes</label>
                            <div className="flex flex-wrap gap-2">
                                {teacher.academics.classes.map(cls => (
                                    <span key={cls} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200">
                                        {cls}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </RoleBasedSection>

                {/* 3. Contact Info (Front Desk / Data Entry) */}
                <RoleBasedSection
                    title="Contact Information"
                    role={currentRole}
                    allowedRoles={[STAFF_ROLES.FRONT_DESK, STAFF_ROLES.DATA_ENTRY, STAFF_ROLES.ADMIN, STAFF_ROLES.SUPPORT]}
                    editable={currentRole === STAFF_ROLES.DATA_ENTRY}
                    onEdit={() => navigate(`/staff/teachers/${teacherId}/edit`)}
                >
                    <InfoField label="Mobile Number" value={teacher.contact.phone} icon={Phone} />
                    <InfoField label="Email Address" value={teacher.contact.email} icon={Mail} />
                    <div className="md:col-span-2">
                        <InfoField label="Residential Address" value={teacher.contact.address} icon={MapPin} />
                    </div>
                </RoleBasedSection>

                {/* 4. Payroll Info (Accounts Only) */}
                <RoleBasedSection
                    title="Payroll & Salary"
                    role={currentRole}
                    allowedRoles={[STAFF_ROLES.ACCOUNTS, STAFF_ROLES.ADMIN]}
                    editable={currentRole === STAFF_ROLES.ACCOUNTS}
                    onEdit={() => navigate(`/staff/teachers/${teacherId}/edit`)}
                >
                    <InfoField label="Base Salary" value={`₹${teacher.payroll.salary.toLocaleString()}`} icon={Briefcase} />
                    <InfoField label="Pay Cycle" value={teacher.payroll.type} icon={Clock} />
                    <InfoField label="Deductions" value={`₹${teacher.payroll.deductions}`} icon={AlertCircle} />

                    <div className="md:col-span-2 pt-2 border-t border-gray-100 mt-2 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500">Last Pay Status: <span className="text-green-600">{teacher.payroll.status}</span></span>
                        <button className="text-indigo-600 text-xs font-bold hover:underline">View Full Payslip history</button>
                    </div>
                </RoleBasedSection>

                {/* 5. Documents (Data Entry / Admin) */}
                <RoleBasedSection
                    title="Documents"
                    role={currentRole}
                    allowedRoles={[STAFF_ROLES.DATA_ENTRY, STAFF_ROLES.ACCOUNTS, STAFF_ROLES.ADMIN, STAFF_ROLES.SUPPORT]}
                    editable={currentRole === STAFF_ROLES.DATA_ENTRY}
                    onEdit={() => navigate(`/staff/teachers/${teacherId}/edit`)}
                >
                    <div className="col-span-1 md:col-span-2 space-y-3">
                        {teacher.documents.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded text-gray-500"><FileText size={16} /></div>
                                    <span className="text-sm font-medium text-gray-800">{doc.name}</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${doc.status === 'Verified' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}>
                                    {doc.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </RoleBasedSection>

            </div>
        </div>
    );
};

export default TeacherDetail;
