import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Bell, Lock, Globe, Moon, Shield, LogOut, ChevronRight,
    Smartphone, Mail
} from 'lucide-react';
import { colors } from '@/theme/colors';

const SettingItem = ({ icon: Icon, label, value, type = 'link', onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center justify-between p-4 bg-white border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer group`}
    >
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gray-50 text-gray-500 group-hover:text-indigo-600 transition-colors`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                {value && <p className="text-xs text-gray-400">{value}</p>}
            </div>
        </div>

        {type === 'toggle' ? (
            <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </div>
        ) : (
            <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
        )}
    </div>
);

const SettingsPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (confirm("Are you sure you want to logout?")) {
            // Mock Logout
            alert("Logged out successfully");
            navigate('/student/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center gap-3 max-w-lg mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Settings</h1>
                </div>
            </div>

            <main className="max-w-lg mx-auto px-4 pt-6 space-y-6">

                {/* Account Section */}
                <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Account</h3>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <SettingItem icon={Lock} label="Change Password" value="Last updated 3 months ago" onClick={() => alert("Password Change Flow")} />
                        <SettingItem icon={Mail} label="Email Preferences" value="Weekly Digest" onClick={() => { }} />
                        <SettingItem icon={Smartphone} label="Registered Devices" value="iPhone 13, Windows PC" onClick={() => { }} />
                    </div>
                </section>

                {/* Preferences Section */}
                <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">App Preferences</h3>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <SettingItem icon={Bell} label="Push Notifications" type="toggle" />
                        <SettingItem icon={Moon} label="Dark Mode" type="toggle" />
                        <SettingItem icon={Globe} label="Language" value="English (Default)" onClick={() => { }} />
                    </div>
                </section>

                {/* Support Section */}
                <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">About & Support</h3>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <SettingItem icon={Shield} label="Privacy Policy" onClick={() => { }} />
                        <SettingItem icon={LogOut} label="Log Out" onClick={handleLogout} />
                    </div>
                </section>

                <p className="text-center text-[10px] text-gray-400 pt-6">
                    App Version 2.4.0 (2026) • EducationCRM
                </p>

            </main>
        </div>
    );
};

export default SettingsPage;
