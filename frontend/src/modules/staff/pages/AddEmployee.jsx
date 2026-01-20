import React, { useState } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Phone, Briefcase, Truck, Users } from 'lucide-react';

const AddEmployee = () => {
    const { user } = useStaffAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Safety: Only Data Entry
    React.useEffect(() => {
        if (user && user.role !== STAFF_ROLES.DATA_ENTRY) {
            navigate('/staff/employees');
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', employeeId: '', doj: '', type: 'Full-time',
        designation: '', department: 'Office',
        phone: '', address: '', emergencyContact: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate('/staff/employees');
        }, 1200);
    };

    return (
        <div className="max-w-3xl mx-auto pb-20 md:pb-10 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-gray-200 flex items-center gap-3 sticky top-0 z-10">
                <button onClick={() => navigate('/staff/employees')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Add Employee</h1>
                    <p className="text-xs text-gray-500">Register non-teaching staff</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">

                {/* 1. Basic Info */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <User size={16} className="text-indigo-600" /> Basic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="First Name" name="firstName" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} required />
                        <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} required />
                        <InputField label="Employee ID" name="employeeId" value={formData.employeeId} onChange={e => setFormData({ ...formData, employeeId: e.target.value })} required placeholder="e.g. EMP-D-102" />
                        <InputField label="Date of Joining" name="doj" type="date" value={formData.doj} onChange={e => setFormData({ ...formData, doj: e.target.value })} required />
                    </div>
                </div>

                {/* 2. Role & Department */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Briefcase size={16} className="text-indigo-600" /> Role Assignment
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Department</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Office', 'Transport', 'Maintenance', 'Security'].map(dept => (
                                    <label key={dept} className={`border rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer transition-all ${formData.department === dept ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                                        <input type="radio" name="department" value={dept} checked={formData.department === dept} onChange={e => setFormData({ ...formData, department: e.target.value })} className="hidden" />
                                        {dept === 'Transport' ? <Truck size={16} className="mb-1" /> : <Briefcase size={16} className="mb-1" />}
                                        <span className="text-xs font-bold">{dept}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <InputField label="Designation" name="designation" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} placeholder="e.g. Driver, Clerk" required />
                            <InputField label="Employment Type" name="type" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} placeholder="e.g. Full-time" />
                        </div>
                    </div>
                </div>

                {/* 3. Contact Info */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Phone size={16} className="text-indigo-600" /> Contact Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Mobile Number" name="phone" type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                        <InputField label="Emergency Contact" name="emergencyContact" type="tel" value={formData.emergencyContact} onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })} />
                        <div className="md:col-span-2">
                            <InputField label="Residential Address" name="address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex justify-end gap-3 md:sticky md:bottom-0 md:rounded-xl z-20">
                    <button type="button" onClick={() => navigate('/staff/employees')} className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button type="submit" disabled={isLoading} className={`px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg shadow-md flex items-center gap-2 ${isLoading ? 'opacity-70' : ''}`}>
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

export default AddEmployee;
