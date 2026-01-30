
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User, Phone, MapPin, Mail, CreditCard, FileText,
    Bus, Ticket, ArrowLeft, Shield, AlertCircle, Clock, Briefcase, CheckCircle, Upload
} from 'lucide-react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import RoleBasedSection from '../components/students/RoleBasedSection';

// --- MOCK DATA ---
const MOCK_STUDENT_DETAIL = {
    id: 'STU-2024-001',
    name: 'Aarav Gupta',
    class: 'X-A',
    admissionDate: '2022-04-15',
    status: 'Active',
    contact: { phone: '9876543210', email: 'parent.aarav@example.com', address: '12, Greenfield Avenue, Delhi' },
    fees: { total: 125000, paid: 75000, pending: 50000, status: 'Partial' },
    transport: { route: 'Route-A (North)', bus: 'DL-1PC-4502', status: 'Pickup & Drop' },
    documents: [
        { name: 'Aadhaar Card', status: 'Verified' },
        { name: 'Transfer Certificate', status: 'Pending' }
    ],
    support: [
        { id: 'TKT-901', category: 'Fees', status: 'Closed' }
    ]
};

const StaffStudentDetail = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const { user } = useStaffAuth();

    // Use real role
    const currentRole = user?.role;

    const [student, setStudent] = useState(MOCK_STUDENT_DETAIL);

    // --- UI HELPERS ---

    const InfoField = ({ label, value, icon: Icon, disabled }) => (
        <div className={`space-y-1.5 ${disabled ? 'opacity-70' : ''}`}>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                {Icon && <Icon size={12} />}
                {label}
            </label>
            <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-1 w-full truncate">
                    {value || '-'}
                </p>
                {disabled && (
                    <span className="text-[10px] text-gray-400 italic shrink-0">Read Only</span>
                )}
            </div>
        </div>
    );

    const StatusBadge = ({ status, type }) => {
        let colors = 'bg-gray-100 text-gray-700';
        if (status === 'Active' || status === 'Paid' || status === 'Verified') colors = 'bg-green-50 text-green-700 border-green-200';
        if (status === 'Pending' || status === 'Partial' || status === 'Due') colors = 'bg-amber-50 text-amber-700 border-amber-200';
        if (status === 'Inactive' || status === 'Overdue' || status === 'Missing') colors = 'bg-red-50 text-red-700 border-red-200';

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${colors}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="max-w-5xl mx-auto pb-12">
            {/* 1. Header Navigation */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/staff/students')}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
                >
                    <ArrowLeft size={16} />
                    Back to Students
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

            {/* 2. Role-Based Details View */}

            {/* SECTION 1: BASIC INFO (All Roles) */}
            <RoleBasedSection
                title="Basic Information"
                role={currentRole}
                allowedRoles={Object.values(STAFF_ROLES)} // Visible to all
                editable={currentRole === STAFF_ROLES.DATA_ENTRY}
            >
                <InfoField label="Full Name" value={student.name} icon={User} disabled={currentRole !== STAFF_ROLES.DATA_ENTRY} />
                <InfoField label="Admission Date" value={student.admissionDate} icon={Clock} disabled={currentRole !== STAFF_ROLES.DATA_ENTRY} />
                <InfoField label="Class & Section" value={student.class} icon={Briefcase} disabled={currentRole !== STAFF_ROLES.DATA_ENTRY} />
            </RoleBasedSection>

            {/* SECTION 2: CONTACT INFO (Front Desk Edit, Others View) */}
            <RoleBasedSection
                title="Contact Details"
                role={currentRole}
                allowedRoles={Object.values(STAFF_ROLES)}
                editable={currentRole === STAFF_ROLES.FRONT_DESK || currentRole === STAFF_ROLES.DATA_ENTRY}
            >
                <InfoField label="Mobile Number" value={student.contact.phone} icon={Phone} disabled={currentRole !== STAFF_ROLES.FRONT_DESK && currentRole !== STAFF_ROLES.DATA_ENTRY} />
                <InfoField label="Email Address" value={student.contact.email} icon={Mail} disabled={currentRole !== STAFF_ROLES.FRONT_DESK && currentRole !== STAFF_ROLES.DATA_ENTRY} />
                <InfoField label="Current Address" value={student.contact.address} icon={MapPin} disabled={currentRole !== STAFF_ROLES.FRONT_DESK && currentRole !== STAFF_ROLES.DATA_ENTRY} />
            </RoleBasedSection>

            {/* SECTION 3: FEES INFO (Accounts Full, others read-only) */}
            <RoleBasedSection
                title="Financial Information"
                role={currentRole}
                allowedRoles={[STAFF_ROLES.ACCOUNTS, STAFF_ROLES.FRONT_DESK, STAFF_ROLES.SUPPORT, STAFF_ROLES.DATA_ENTRY]}
                editable={currentRole === STAFF_ROLES.ACCOUNTS}
            >
                <InfoField label="Total Annual Fee" value={`₹${student.fees.total.toLocaleString()}`} icon={CreditCard} disabled={true} />
                <InfoField label="Amount Paid" value={`₹${student.fees.paid.toLocaleString()}`} icon={CheckCircle} disabled={true} />

                <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                    <label className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">Pending Amount</label>
                    <p className="text-xl font-bold text-red-700">₹{student.fees.pending.toLocaleString()}</p>
                </div>

                <div className="flex items-center mt-2">
                    <span className="text-sm font-medium mr-2 text-gray-500">Current Status:</span>
                    <StatusBadge status={student.fees.status} />
                </div>
            </RoleBasedSection>

            {/* SECTION 4: DOCUMENTS (Front Desk/Data Entry/Support) */}
            <RoleBasedSection
                title="Documents & Certificates"
                role={currentRole}
                allowedRoles={[STAFF_ROLES.FRONT_DESK, STAFF_ROLES.DATA_ENTRY, STAFF_ROLES.SUPPORT]}
                editable={currentRole === STAFF_ROLES.FRONT_DESK || currentRole === STAFF_ROLES.DATA_ENTRY}
            >
                <div className="col-span-1 md:col-span-2 space-y-3">
                    {student.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-3">
                                <FileText size={18} className="text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">{doc.name}</span>
                            </div>
                            <StatusBadge status={doc.status} />
                        </div>
                    ))}

                    {(currentRole === STAFF_ROLES.FRONT_DESK || currentRole === STAFF_ROLES.DATA_ENTRY) && (
                        <button className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 mt-2 px-1">
                            <Upload size={16} />
                            Upload New Document
                        </button>
                    )}
                </div>
            </RoleBasedSection>

            {/* SECTION 5: TRANSPORT (Transport Role) */}
            <RoleBasedSection
                title="Transport Details"
                role={currentRole}
                allowedRoles={[STAFF_ROLES.TRANSPORT, STAFF_ROLES.SUPPORT, STAFF_ROLES.DATA_ENTRY]}
                editable={currentRole === STAFF_ROLES.TRANSPORT}
            >
                <InfoField label="Assigned Route" value={student.transport.route} icon={MapPin} disabled={currentRole !== STAFF_ROLES.TRANSPORT} />
                <InfoField label="Bus Number" value={student.transport.bus} icon={Bus} disabled={currentRole !== STAFF_ROLES.TRANSPORT} />
                <InfoField label="Service Type" value={student.transport.status} icon={Ticket} disabled={currentRole !== STAFF_ROLES.TRANSPORT} />
            </RoleBasedSection>

        </div>
    );
};

export default StaffStudentDetail;
