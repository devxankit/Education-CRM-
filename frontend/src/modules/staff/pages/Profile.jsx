import React, { useState } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useStaffAuth();
    const navigate = useNavigate();

    // Mock Data (fallback if user context missing details)
    const profile = {
        name: user?.name || 'Staff Member',
        role: user?.role || 'Admin',
        email: user?.email || 'staff@school.com',
        phone: '+91 9876543210',
        dob: '15 Aug 1990',
        joinDate: '01 June 2020',
        department: 'Science',
        address: '123, School Campus, Main Block',
        employeeId: 'EMP-2020-001'
    };

    return (
        <div className="max-w-2xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            {/* Header / Cover */}
            <div className="bg-indigo-600 h-32 relative">
                <div className="absolute -bottom-10 left-6">
                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg relative">
                        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl font-bold">
                            {profile.name.charAt(0)}
                        </div>
                        <button className="absolute bottom-0 right-0 p-1.5 bg-gray-900 text-white rounded-full border-2 border-white hover:bg-gray-800">
                            <Camera size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="pt-12 px-5 pb-5">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
                        <p className="text-sm text-gray-500 font-medium">{profile.role} • {profile.department}</p>
                    </div>
                    <button
                        onClick={() => navigate('/staff/settings')}
                        className="text-xs font-bold bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            <div className="px-4 space-y-4">

                {/* ID Card Info */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Briefcase size={16} className="text-indigo-600" /> Employment Details
                    </h3>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                        <ProfileField label="Employee ID" value={profile.employeeId} />
                        <ProfileField label="Date of Joining" value={profile.joinDate} />
                        <ProfileField label="Department" value={profile.department} />
                        <ProfileField label="Role" value={profile.role} />
                    </div>
                </div>

                {/* Personal Info */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <User size={16} className="text-indigo-600" /> Personal Information
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail size={16} className="text-gray-400" />
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                                <p className="text-sm font-bold text-gray-900">{profile.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone size={16} className="text-gray-400" />
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Phone</p>
                                <p className="text-sm font-bold text-gray-900">{profile.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar size={16} className="text-gray-400" />
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Date of Birth</p>
                                <p className="text-sm font-bold text-gray-900">{profile.dob}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin size={16} className="text-gray-400" />
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Address</p>
                                <p className="text-sm font-bold text-gray-900">{profile.address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Status */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield size={20} className="text-green-600" />
                        <div>
                            <p className="text-sm font-bold text-gray-900">Account Active</p>
                            <p className="text-xs text-gray-500">Full access granted to modules.</p>
                        </div>
                    </div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Verified</span>
                </div>

            </div>
        </div>
    );
};

const ProfileField = ({ label, value }) => (
    <div>
        <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">{label}</p>
        <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
);

export default Profile;
