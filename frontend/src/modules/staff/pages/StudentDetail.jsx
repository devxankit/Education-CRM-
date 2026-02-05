
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User, Phone, MapPin, Mail, FileText,
    Bus, ArrowLeft, Shield, AlertCircle, Clock, Briefcase, CheckCircle, BookOpen, CreditCard, Upload, Ticket
} from 'lucide-react';
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
        if (['Active', 'Paid', 'Verified'].includes(status)) colors = 'bg-green-50 text-green-700 border-green-200';
        if (['Pending', 'Partial', 'Due'].includes(status)) colors = 'bg-amber-50 text-amber-700 border-amber-200';
        if (['Inactive', 'Overdue', 'Missing'].includes(status)) colors = 'bg-red-50 text-red-700 border-red-200';

        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${colors}`}>{status}</span>;
    };

    return (
        <div className="max-w-5xl mx-auto pb-12 p-4">
            <div className="mb-6">
                <button onClick={() => navigate('/staff/students')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4">
                    <ArrowLeft size={16} /> Back to Students
                </button>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">{student.id}</span>
                            <span>•</span>
                            <span>Class {student.class}</span>
                            <span>•</span>
                            <StatusBadge status={student.status} />
                        </div>
                    </div>
                </div>
            </div>

            <RoleBasedSection
                title="Profile & Basic Information"
                role={currentRole}
                allowedRoles={Object.values(STAFF_ROLES)}
                editable={currentRole === STAFF_ROLES.DATA_ENTRY}
                onEdit={() => navigate(`/staff/students/${studentId}/edit`)}
            >
                <InfoField label="Full Name" value={student.name} icon={User} />
                <InfoField label="Class" value={student.class} icon={BookOpen} />
                <InfoField label="Admission No" value={student.id} icon={Shield} />
            </RoleBasedSection>

            <RoleBasedSection
                title="Contact Details"
                role={currentRole}
                allowedRoles={Object.values(STAFF_ROLES)}
                editable={currentRole === STAFF_ROLES.FRONT_DESK || currentRole === STAFF_ROLES.DATA_ENTRY}
                onEdit={() => navigate(`/staff/students/${studentId}/edit`)}
            >
                <InfoField label="Phone" value={student.contact} icon={Phone} />
                <InfoField label="Email" value={student.email} icon={Mail} />
                <InfoField label="Address" value={student.address} icon={MapPin} />
            </RoleBasedSection>

            <RoleBasedSection
                title="Documents"
                role={currentRole}
                allowedRoles={Object.values(STAFF_ROLES)}
                editable={currentRole === STAFF_ROLES.DATA_ENTRY}
                onEdit={() => navigate(`/staff/students/${studentId}/edit`)}
            >
                <div className="col-span-2">
                    <StatusBadge status={student.docsStatus} />
                </div>
            </RoleBasedSection>
        </div>
    );
};

export default StudentDetail;
