import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import {
    ArrowLeft, User, Phone, MapPin, Briefcase, Clock,
    FileText, CheckCircle, Shield, AlertCircle, Calendar, Truck
} from 'lucide-react';
import RoleBasedSection from '../components/students/RoleBasedSection';

// --- MOCK DETAILS ---
const MOCK_EMPLOYEE_DETAIL = {
    id: 'EMP-2024-001',
    name: 'Ramesh Singh',
    employeeId: 'EMP-D-101',
    doj: '2022-01-10',
    type: 'Full-time',
    status: 'Active',
    designation: 'Senior Driver',
    department: 'Transport',
    contact: { phone: '9876543210', emergency: '9988776655', address: '12, Transport Nagar, Delhi' },
    assignment: { bus: 'DL-1PC-4502', route: 'Route-A' },
    payroll: { salary: 22000, type: 'Monthly', deductions: 500, status: 'Paid' },
    documents: [
        { name: 'Driving License', status: 'Verified' },
        { name: 'Police Verification', status: 'Pending' },
        { name: 'Aadhaar Card', status: 'Verified' }
    ],
    attendance: { present: 24, leave: 2, overtime: '8 hrs' }
};

const EmployeeDetail = () => {
    const { employeeId } = useParams();
    const navigate = useNavigate();
    const { user } = useStaffAuth();

    // In real app, fetch execution would be here
    const [employee, setEmployee] = useState(MOCK_EMPLOYEE_DETAIL);

    if (!employee) return <div className="p-10 text-center">Loading...</div>;

    const currentRole = user?.role || STAFF_ROLES.FRONT_DESK;

    // Helper for consistency
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
                <button onClick={() => navigate('/staff/employees')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-bold text-gray-900 truncate">{employee.name}</h1>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">{employee.employeeId}</span>
                        <span>•</span>
                        <span className={employee.status === 'Active' ? 'text-green-600 font-bold' : 'text-amber-600'}>{employee.status}</span>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">

                {/* 1. Basic Info (All Roles except Front Desk ideally, but simplified) */}
                <RoleBasedSection
                    title="Profile Overview"
                    role={currentRole}
                    allowedRoles={[STAFF_ROLES.DATA_ENTRY, STAFF_ROLES.ACCOUNTS, STAFF_ROLES.TRANSPORT, STAFF_ROLES.SUPPORT, STAFF_ROLES.ADMIN]}
                    editable={currentRole === STAFF_ROLES.DATA_ENTRY}
                >
                    <InfoField label="Full Name" value={employee.name} icon={User} />
                    <InfoField label="Employee ID" value={employee.employeeId} icon={Shield} />
                    <InfoField label="Employment Type" value={employee.type} icon={Briefcase} />
                    <InfoField label="Date of Joining" value={employee.doj} icon={Calendar} />
                </RoleBasedSection>

                {/* 2. Department & Assignment */}
                <RoleBasedSection
                    title="Work Assignment"
                    role={currentRole}
                    allowedRoles={[STAFF_ROLES.DATA_ENTRY, STAFF_ROLES.TRANSPORT, STAFF_ROLES.ADMIN]}
                    editable={currentRole === STAFF_ROLES.DATA_ENTRY}
                >
                    <InfoField label="Department" value={employee.department} icon={Briefcase} />
                    <InfoField label="Designation" value={employee.designation} icon={User} />
                    {employee.department === 'Transport' && (
                        <>
                            <InfoField label="Assigned Bus" value={employee.assignment.bus} icon={Truck} />
                            <InfoField label="Route" value={employee.assignment.route} icon={MapPin} />
                        </>
                    )}
                </RoleBasedSection>

                {/* 3. Payroll Info (Accounts Only) */}
                <RoleBasedSection
                    title="Payroll & Compensation"
                    role={currentRole}
                    allowedRoles={[STAFF_ROLES.ACCOUNTS, STAFF_ROLES.ADMIN]}
                    editable={currentRole === STAFF_ROLES.ACCOUNTS}
                >
                    <InfoField label="Base Salary" value={`₹${employee.payroll.salary.toLocaleString()}`} icon={Briefcase} />
                    <InfoField label="Payment Cycle" value={employee.payroll.type} icon={Clock} />
                    <InfoField label="Deductions" value={`₹${employee.payroll.deductions}`} icon={AlertCircle} />

                    <div className="md:col-span-2 pt-2 border-t border-gray-100 mt-2 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500">Last Pay Status: <span className="text-green-600">{employee.payroll.status}</span></span>
                        <button className="text-indigo-600 text-xs font-bold hover:underline">View Payslips</button>
                    </div>
                </RoleBasedSection>

                {/* 4. Attendance Summary (All View) */}
                <RoleBasedSection
                    title="Attendance Summary"
                    role={currentRole}
                    allowedRoles={[STAFF_ROLES.DATA_ENTRY, STAFF_ROLES.ACCOUNTS, STAFF_ROLES.ADMIN, STAFF_ROLES.TRANSPORT]}
                    editable={false}
                >
                    <div className="flex gap-4">
                        <div className="text-center">
                            <p className="text-xs text-gray-400 font-bold uppercase">Present</p>
                            <p className="text-lg font-bold text-green-600">{employee.attendance.present}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-400 font-bold uppercase">Leave</p>
                            <p className="text-lg font-bold text-amber-600">{employee.attendance.leave}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-400 font-bold uppercase">Overtime</p>
                            <p className="text-lg font-bold text-indigo-600">{employee.attendance.overtime}</p>
                        </div>
                    </div>
                </RoleBasedSection>

                {/* 5. Documents */}
                <RoleBasedSection
                    title="Documents"
                    role={currentRole}
                    allowedRoles={[STAFF_ROLES.DATA_ENTRY, STAFF_ROLES.ACCOUNTS, STAFF_ROLES.ADMIN]}
                    editable={currentRole === STAFF_ROLES.DATA_ENTRY}
                >
                    <div className="col-span-1 md:col-span-2 space-y-3">
                        {employee.documents.map((doc, idx) => (
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

export default EmployeeDetail;
