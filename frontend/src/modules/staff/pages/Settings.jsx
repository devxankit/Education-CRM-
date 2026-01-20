import React, { useState } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import {
    User, Bell, Lock, Smartphone, Globe, Moon, Shield, LogOut, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { user, logout } = useStaffAuth();
    const navigate = useNavigate();

    return (
        <div className="max-w-3xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 py-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">Settings & Profile</h1>
                <p className="text-xs text-gray-500">Manage account preferences</p>
            </div>

            <div className="p-4 md:p-6 space-y-6">

                {/* Profile Card */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-2xl font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">{user?.name}</h2>
                        <p className="text-sm text-gray-500">{user?.role} Staff</p>
                        <p className="text-xs text-indigo-600 font-bold mt-1 max-w-[150px] truncate">{user?.email}</p>
                    </div>
                    <button className="ml-auto text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200">
                        Edit
                    </button>
                </div>

                {/* Settings list */}
                <div className="space-y-4">

                    <SettingsSection title="Account Security">
                        <SettingsItem icon={Lock} label="Change Password" sub="Last changed 30 days ago" />
                        <SettingsItem icon={Smartphone} label="Two-Factor Auth" sub="Enabled" toggle />
                    </SettingsSection>

                    <SettingsSection title="Preferences">
                        <SettingsItem icon={Bell} label="Notifications" sub="Push & Email" toggle defaultChecked />
                        <SettingsItem icon={Moon} label="Dark Mode" sub="Coming Soon" toggle disabled />
                        <SettingsItem icon={Globe} label="Language" sub="English (US)" />
                    </SettingsSection>

                    <SettingsSection title="Support">
                        <SettingsItem icon={Shield} label="Privacy Policy" />
                        <SettingsItem icon={User} label="Help & Support" onClick={() => navigate('/staff/support')} />
                    </SettingsSection>

                    <button
                        onClick={logout}
                        className="w-full bg-white p-4 rounded-xl border border-red-100 flex items-center justify-between text-red-600 font-bold hover:bg-red-50 transition-colors"
                    >
                        <span className="flex items-center gap-3"><LogOut size={20} /> Sign Out</span>
                    </button>

                </div>

            </div>
        </div>
    );
};

const SettingsSection = ({ title, children }) => (
    <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">{title}</h3>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-50">
            {children}
        </div>
    </div>
);

const SettingsItem = ({ icon: Icon, label, sub, toggle, disabled, defaultChecked, onClick }) => (
    <div
        onClick={!toggle && !disabled ? onClick : undefined}
        className={`p-4 flex items-center justify-between transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}`}
    >
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                <Icon size={18} />
            </div>
            <div>
                <p className="text-sm font-bold text-gray-800">{label}</p>
                {sub && <p className="text-xs text-gray-400">{sub}</p>}
            </div>
        </div>
        {toggle ? (
            <div className={`w-10 h-5 rounded-full relative transition-colors ${defaultChecked ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${defaultChecked ? 'left-5.5' : 'left-0.5'}`}></div>
            </div>
        ) : (
            <ChevronRight size={16} className="text-gray-300" />
        )}
    </div>
);

export default Settings;
