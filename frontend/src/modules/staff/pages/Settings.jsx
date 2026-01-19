import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Bell, Moon, LogOut, ChevronRight, Smartphone } from 'lucide-react';
import { useStaffAuth } from '../context/StaffAuthContext';

const StaffSettings = () => {
    const navigate = useNavigate();
    const { logout, user } = useStaffAuth();

    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/staff/login');
    };

    const SettingItem = ({ icon: Icon, title, subtitle, toggle, value, onClick, danger }) => (
        <div
            onClick={onClick}
            className={`flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl mb-3 ${onClick ? 'cursor-pointer active:scale-[0.99] transition-transform' : ''}`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${danger ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className={`text-sm font-bold ${danger ? 'text-red-600' : 'text-gray-900'}`}>{title}</h3>
                    {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
                </div>
            </div>
            {toggle ? (
                <div
                    onClick={(e) => { e.stopPropagation(); toggle(!value); }}
                    className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${value ? 'bg-indigo-600' : 'bg-gray-300'}`}
                >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
            ) : (
                <ChevronRight size={18} className="text-gray-300" />
            )}
        </div>
    );

    return (
        <div className="max-w-md mx-auto pb-24 md:pb-6 min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Settings</h1>
                    <p className="text-xs text-gray-500">App preferences</p>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Account</h2>
                <SettingItem
                    icon={Lock}
                    title="Change Password"
                    subtitle="Update your easy-to-guess password"
                    onClick={() => { }} // Placeholder
                />
                <SettingItem
                    icon={Smartphone}
                    title="Two-Factor Auth"
                    subtitle="Enabled"
                    onClick={() => { }}
                />
            </div>

            <div className="mb-6">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Preferences</h2>
                <SettingItem
                    icon={Bell}
                    title="Push Notifications"
                    subtitle="Receive updates instantly"
                    toggle={setNotifications}
                    value={notifications}
                />
                <SettingItem
                    icon={Moon}
                    title="Dark Mode"
                    subtitle="Reduce eye strain"
                    toggle={setDarkMode}
                    value={darkMode}
                />
            </div>

            <div className="mt-8">
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl border border-red-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                    <LogOut size={20} /> Sign Out
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">Version 1.2.0 (Build 450)</p>
            </div>
        </div>
    );
};

export default StaffSettings;