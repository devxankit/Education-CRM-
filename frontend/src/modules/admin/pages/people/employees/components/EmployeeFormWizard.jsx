
import React, { useState } from 'react';
import { Save, User, Briefcase, Lock, ChevronRight, Check } from 'lucide-react';

const EmployeeFormWizard = ({ onSave, onCancel }) => {

    // Steps: 1. Personal, 2. Employment, 3. Access
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        // Step 1
        firstName: '',
        lastName: '',
        gender: 'Male',
        dob: '',
        mobile: '',
        email: '',
        aadhaar: '',

        // Step 2
        employeeType: 'Teacher', // Teacher, Non-Teaching, Contract
        employmentType: 'Permanent', // Permanent, Probation, Contract
        department: '',
        designation: '',
        branch: 'Main Branch',
        dateOfJoining: '',
        reportingManager: '',

        // Step 3
        createLogin: false,
        role: '',
        loginMethod: 'Password' // Password, OTP, Both
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = () => {
        onSave({
            ...formData,
            name: `${formData.firstName} ${formData.lastName}`,
            code: `EMP-${Math.floor(Math.random() * 10000)}`,
            status: 'Draft'
        });
    };

    const getStepLabel = (s) => {
        if (s === 1) return 'Personal Info';
        if (s === 2) return 'Employment';
        if (s === 3) return 'System Access';
    };

    return (
        <div className="flex flex-col h-full bg-white">

            {/* Step Indicator */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${step === s ? 'bg-indigo-600 border-indigo-600 text-white' : step > s ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                {step > s ? <Check size={12} /> : s}
                            </div>
                            {s < 3 && <div className={`w-8 h-0.5 mx-2 ${step > s ? 'bg-green-500' : 'bg-gray-200'}`}></div>}
                        </div>
                    ))}
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase">{getStepLabel(step)}</span>
            </div>

            {/* Content Scroller */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Step 1: Personal Details */}
                {step === 1 && (
                    <div className="space-y-4 fade-in">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                            <User size={14} /> Basic Information
                        </h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                                <input type="text" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="John" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                                <input type="text" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Doe" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input type="date" value={formData.dob} onChange={(e) => handleChange('dob', e.target.value)} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                                <input type="tel" value={formData.mobile} onChange={(e) => handleChange('mobile', e.target.value)} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="+91 99999 99999" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-xs text-gray-400">(Optional)</span></label>
                                <input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="john@school.edu" />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar / Govt ID <span className="text-xs text-gray-400">(Encrypted)</span></label>
                                <input type="text" value={formData.aadhaar} onChange={(e) => handleChange('aadhaar', e.target.value)} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 font-mono" placeholder="XXXX-XXXX-XXXX" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Employment */}
                {step === 2 && (
                    <div className="space-y-4 fade-in">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                            <Briefcase size={14} /> Employment Details
                        </h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Type</label>
                                <select value={formData.employeeType} onChange={(e) => handleChange('employeeType', e.target.value)} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="Teacher">Teaching Staff</option>
                                    <option value="Non-Teaching">Non-Teaching Staff</option>
                                    <option value="Contract">Contract / Outsourced</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nature of Employment</label>
                                <select value={formData.employmentType} onChange={(e) => handleChange('employmentType', e.target.value)} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="Permanent">Permanent</option>
                                    <option value="Probation">Probation</option>
                                    <option value="Contract">Fixed Term Contract</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select value={formData.department} onChange={(e) => handleChange('department', e.target.value)} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="">Select Department</option>
                                    <option value="Science">Science</option>
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="Administration">Administration</option>
                                    <option value="Transport">Transport</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                                <input type="text" value={formData.designation} onChange={(e) => handleChange('designation', e.target.value)} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Senior Lecturer" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
                                <input type="date" value={formData.dateOfJoining} onChange={(e) => handleChange('dateOfJoining', e.target.value)} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Manager</label>
                                <input type="text" value={formData.reportingManager} onChange={(e) => handleChange('reportingManager', e.target.value)} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Manager Name" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Access */}
                {step === 3 && (
                    <div className="space-y-4 fade-in">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                            <Lock size={14} /> System Access
                        </h4>

                        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-bold text-indigo-900 block">Create Login Account</label>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.createLogin}
                                        onChange={(e) => handleChange('createLogin', e.target.checked)}
                                    />
                                    <div className={`w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600`}></div>
                                </label>
                            </div>
                            <p className="text-xs text-indigo-700 mb-4">
                                If enabled, the employee will receive credentials via email/SMS.
                            </p>

                            {formData.createLogin && (
                                <div className="space-y-3 pt-3 border-t border-indigo-200">
                                    <div>
                                        <label className="block text-xs font-bold text-indigo-800 mb-1">Assign Role</label>
                                        <select value={formData.role} onChange={(e) => handleChange('role', e.target.value)} className="w-full text-sm border border-indigo-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                                            <option value="">Select Role</option>
                                            <option value="Teacher">Teacher (Standard)</option>
                                            <option value="Accountant">Accountant</option>
                                            <option value="HR Admin">HR Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-indigo-800 mb-1">Authentication Method</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 text-sm text-indigo-900">
                                                <input type="radio" name="auth" value="Password" checked={formData.loginMethod === 'Password'} onChange={(e) => handleChange('loginMethod', e.target.value)} /> Password
                                            </label>
                                            <label className="flex items-center gap-2 text-sm text-indigo-900">
                                                <input type="radio" name="auth" value="OTP" checked={formData.loginMethod === 'OTP'} onChange={(e) => handleChange('loginMethod', e.target.value)} /> OTP Only
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between rounded-b-xl">
                <button
                    onClick={step === 1 ? onCancel : handleBack}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    {step === 1 ? 'Cancel' : 'Back'}
                </button>

                {step < 3 ? (
                    <button
                        onClick={handleNext}
                        className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-2"
                    >
                        Next Step <ChevronRight size={16} />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 shadow-sm flex items-center gap-2"
                    >
                        <Save size={16} /> Create Employee
                    </button>
                )}
            </div>
        </div>
    );
};

export default EmployeeFormWizard;
