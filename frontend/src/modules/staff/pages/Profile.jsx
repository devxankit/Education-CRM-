
import React from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { useNavigate }
    from 'react-router-dom';
import { User, LogOut, Shield, Mail, Phone, Building, Info, ChevronRight, Lock } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useStaffAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/staff/login');
    };

    if (!user) return null;

    return (
        <div className="max-w-md mx-auto pb-24 md:pb-6 min-h-screen relative">

            {/* 1. Header & Identity */}
            <div className="bg-white p-6 rounded-b-3xl shadow-sm border-b border-gray-100 mb-4 text-center">
                <div className="w-20 h-20 bg-indigo-50 border-4 border-white rounded-full mx-auto shadow-md flex items-center justify-center text-indigo-500 mb-3">
                    <User size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 leading-tight">{user.name || 'Staff Member'}</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 mb-2">{user.staffId || 'ID: ST-0000'}</p>

                <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border border-indigo-100">
                    <Shield size={10} /> {user.role}
                </div>
            </div>

            {/* 2. Details Card */}
            <div className="px-4 space-y-3">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-3 border-b border-gray-50 flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Mail size={16} /></div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Email</p>
                            <p className="text-sm font-semibold text-gray-800">staff@example.com</p>
                        </div>
                    </div>
                    <div className="p-3 border-b border-gray-50 flex items-center gap-3">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Phone size={16} /></div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Phone</p>
                            <p className="text-sm font-semibold text-gray-800">+91 98765 43210</p>
                        </div>
                    </div>
                    <div className="p-3 flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Building size={16} /></div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Department</p>
                            <p className="text-sm font-semibold text-gray-800">{user.role}</p>
                        </div>
                    </div>
                </div>

                {/* 3. Settings / Actions */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50">
                        <div className="flex items-center gap-3">
                            <Lock size={18} className="text-gray-400" />
                            <span className="text-sm font-bold text-gray-700">Change Password</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-300" />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <LogOut size={18} className="text-red-500" />
                            <span className="text-sm font-bold text-red-600">Logout</span>
                        </div>
                    </button>
                </div>

                {/* 4. Footer */}
                <div className="text-center pt-4 opacity-50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Education CRM v1.0.0</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;