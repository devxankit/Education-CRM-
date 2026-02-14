
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User, Phone, MapPin, Mail, FileText,
    Bus, ArrowLeft, Shield, AlertCircle, Clock, Briefcase, CheckCircle, BookOpen, CreditCard, Upload, Ticket
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import RoleBasedSection from '../components/students/RoleBasedSection';
import { useStaffStore } from '../../../store/staffStore';

const StudentDetail = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const { user } = useStaffAuth();
    const students = useStaffStore(state => state.students);
    const fetchStudents = useStaffStore(state => state.fetchStudents);

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentRole = user?.role || STAFF_ROLES.FRONT_DESK;
    const canManage = [STAFF_ROLES.DATA_ENTRY, STAFF_ROLES.PRINCIPAL, STAFF_ROLES.FRONT_DESK, STAFF_ROLES.ADMIN].includes(user?.role);

    const handleConfirmAdmission = async () => {
        if (!window.confirm("Confirm admission as per workflow policy? (Docs verified, fee paid, approval role required)")) return;
        const loadingToast = toast.loading("Confirming admission...");
        try {
            await useStaffStore.getState().confirmAdmission(student.id || student._id);
            setStudent(prev => prev ? { ...prev, status: 'active' } : null);
            toast.success("Admission confirmed successfully!", { id: loadingToast });
        } catch (error) {
            const msg = typeof error === 'object' && error?.message ? error.message : (error?.message || "Failed to confirm");
            toast.error(msg, { id: loadingToast });
        }
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);

            if (students.length === 0) {
                await fetchStudents();
            }

            const found = students.find(s => s.id === studentId || s._id === studentId);
            if (found) {
                setStudent(found);
            } else {
                if (students.length > 0) setError('Student not found');
            }
            setLoading(false);
        };
        load();
    }, [studentId, students, fetchStudents]);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto p-10 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading student details...</p>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="max-w-5xl mx-auto p-10 text-center">
                <p className="text-red-600 font-bold">{error || 'Student not found'}</p>
                <button onClick={() => navigate('/staff/students')} className="mt-4 text-indigo-600 hover:underline">
                    ← Back to Students
                </button>
            </div>
        );
    }

    const InfoField = ({ label, value, icon: Icon, disabled }) => (
        <div className={`space-y-1.5 ${disabled ? 'opacity-70' : ''}`}>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                {Icon && <Icon size={12} />} {label}
            </label>
            <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-1 w-full truncate">
                    {value || '-'}
                </p>
            </div>
        </div>
    );

    const StatusBadge = ({ status }) => {
        let colors = 'bg-gray-100 text-gray-700';
        const s = status?.toLowerCase();
        if (['active', 'paid', 'verified', 'uploaded'].includes(s)) colors = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (['pending', 'partial', 'due'].includes(s)) colors = 'bg-amber-50 text-amber-700 border-amber-200';
        if (['inactive', 'overdue', 'missing'].includes(s)) colors = 'bg-red-50 text-red-700 border-red-200';

        return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${colors}`}>{status || '-'}</span>;
    };

    const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
    const studentClass = student.classId?.name || '-';
    const studentAdmissionNo = student.admissionNo || student.id || student._id;

    return (
        <div className="max-w-5xl mx-auto pb-12 p-4 pt-6">
            <div className="mb-6">
                <button onClick={() => navigate('/staff/students')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
                    <ArrowLeft size={16} /> Back to Students
                </button>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden bg-indigo-50 border-4 border-white shadow-xl">
                        {student?.documents?.photo?.url ? (
                            <img
                                src={student.documents.photo.url}
                                alt={fullName}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + student.firstName + '+' + student.lastName; }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-indigo-300">
                                <User size={48} />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
                            <StatusBadge status={student.status} />
                            {canManage && (student.status === 'in_review' || student.status === 'pending') && (
                                <button
                                    onClick={handleConfirmAdmission}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-sm"
                                >
                                    <CheckCircle size={18} />
                                    Confirm Admission
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-lg font-mono text-gray-700">
                                <Shield size={14} className="text-gray-400" />
                                {studentAdmissionNo}
                            </div>
                            <div className="flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1 rounded-lg font-bold text-indigo-700">
                                <BookOpen size={14} />
                                Class {studentClass} {student.sectionId?.name ? `- ${student.sectionId.name}` : ''}
                            </div>
                            {student.rollNo && (
                                <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold text-emerald-700">
                                    Roll No: {student.rollNo}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RoleBasedSection
                    title="Basic Information"
                    role={currentRole}
                    allowedRoles={Object.values(STAFF_ROLES)}
                    editable={currentRole === STAFF_ROLES.DATA_ENTRY}
                    onEdit={() => navigate(`/staff/students/${studentId}/edit`)}
                >
                    <InfoField label="Gender" value={student.gender} icon={User} />
                    <InfoField label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString() : '-'} icon={Clock} />
                    <InfoField label="Blood Group" value={student.bloodGroup} icon={AlertCircle} />
                    <InfoField label="Religion" value={student.religion} icon={Shield} />
                    <InfoField label="Category" value={student.category} icon={Briefcase} />
                    <InfoField label="Nationality" value={student.nationality} icon={MapPin} />
                </RoleBasedSection>

                <RoleBasedSection
                    title="Admission Details"
                    role={currentRole}
                    allowedRoles={Object.values(STAFF_ROLES)}
                    editable={currentRole === STAFF_ROLES.DATA_ENTRY}
                    onEdit={() => navigate(`/staff/students/${studentId}/edit`)}
                >
                    <InfoField label="Admission Date" value={student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : '-'} icon={Clock} />
                    <InfoField label="Previous School" value={student.prevSchool} icon={BookOpen} />
                    <InfoField label="Last Class" value={student.lastClass} icon={BookOpen} />
                    <InfoField label="Transport Required" value={student.transportRequired ? 'Yes' : 'No'} icon={Bus} />
                    <InfoField label="Hostel Required" value={student.hostelRequired ? 'Yes' : 'No'} icon={MapPin} />
                </RoleBasedSection>

                <RoleBasedSection
                    title="Parent/Contact Details"
                    role={currentRole}
                    allowedRoles={Object.values(STAFF_ROLES)}
                    editable={currentRole === STAFF_ROLES.FRONT_DESK || currentRole === STAFF_ROLES.DATA_ENTRY}
                    onEdit={() => navigate(`/staff/students/${studentId}/edit`)}
                >
                    <InfoField label="Parent Name" value={student.parentId?.name} icon={User} />
                    <InfoField label="Mobile" value={student.parentId?.mobile} icon={Phone} />
                    <InfoField label="Parent Email" value={student.parentEmail || student.parentId?.email} icon={Mail} />
                    <InfoField label="Relationship" value={student.parentId?.relationship} icon={Shield} />
                    <InfoField label="Address" value={student.address} icon={MapPin} />
                    <InfoField label="City" value={student.city} icon={MapPin} />
                </RoleBasedSection>

                <RoleBasedSection
                    title="Documents"
                    role={currentRole}
                    allowedRoles={Object.values(STAFF_ROLES)}
                    editable={currentRole === STAFF_ROLES.DATA_ENTRY}
                    onEdit={() => navigate(`/staff/students/${studentId}/edit`)}
                >
                    {student.documents && Object.entries(student.documents).map(([key, doc]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-400">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900 uppercase">{key}</p>
                                    <p className="text-[10px] text-gray-500">{doc.name || 'document'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <StatusBadge status={doc.status} />
                                {doc.url && (
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded">
                                        <Upload size={14} />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                    {!student.documents && <p className="text-sm text-gray-500 italic">No documents uploaded</p>}
                </RoleBasedSection>
            </div>
        </div>
    );
};

export default StudentDetail;
