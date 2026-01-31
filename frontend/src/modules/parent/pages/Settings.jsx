import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PARENT_DATA } from '../data/mockData';
import {
    ArrowLeft, User, Bell, Shield, Moon, Globe,
    ChevronRight, LogOut, HelpCircle, Phone, Mail
} from 'lucide-react';

const ParentSettingsPage = () => {
    const navigate = useNavigate();
    const parent = MOCK_PARENT_DATA.user;

    // Settings state (mock - will be replaced with actual settings from API)
    const [settings, setSettings] = useState({
        notifications: {
            attendance: true,
            homework: true,
            fees: true,
            notices: true,
            sms: false
        },
        privacy: {
            showPhone: true,
            showEmail: true
        },
        appearance: {
            darkMode: false,
            language: 'English'
        }
    });

    const handleToggle = (category, key) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: !prev[category][key]
            }
        }));
    };

    const SettingItem = ({ icon: Icon, label, description, rightContent, onClick }) => (
        <div
            onClick={onClick}
            className={`flex items-center justify-between p-4 bg-white ${onClick ? 'cursor-pointer active:bg-gray-50' : ''}`}
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon size={18} className="text-gray-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    {description && <p className="text-xs text-gray-500">{description}</p>}
                </div>
            </div>
            {rightContent}
        </div>
    );

    const Toggle = ({ enabled, onToggle }) => (
        <button
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
            />
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/parent')}
                        className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Settings</h1>
                </div>
            </div>

            {/* Profile Section */}
            <div className="p-4">
                <div
                    onClick={() => navigate('/parent/profile')}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 cursor-pointer active:bg-gray-50"
                >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                        {parent.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{parent.name}</h3>
                        <p className="text-sm text-gray-500">Parent Account</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                </div>
            </div>

            {/* Notifications Section */}
            <div className="mb-4">
                <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Notifications
                </p>
                <div className="bg-white border-y border-gray-200 divide-y divide-gray-100">
                    <SettingItem
                        icon={Bell}
                        label="Attendance Alerts"
                        description="Get notified about attendance updates"
                        rightContent={<Toggle enabled={settings.notifications.attendance} onToggle={() => handleToggle('notifications', 'attendance')} />}
                    />
                    <SettingItem
                        icon={Bell}
                        label="Homework Reminders"
                        description="Reminders for pending homework"
                        rightContent={<Toggle enabled={settings.notifications.homework} onToggle={() => handleToggle('notifications', 'homework')} />}
                    />
                    <SettingItem
                        icon={Bell}
                        label="Fee Reminders"
                        description="Payment due date reminders"
                        rightContent={<Toggle enabled={settings.notifications.fees} onToggle={() => handleToggle('notifications', 'fees')} />}
                    />
                    <SettingItem
                        icon={Bell}
                        label="School Notices"
                        description="Important announcements"
                        rightContent={<Toggle enabled={settings.notifications.notices} onToggle={() => handleToggle('notifications', 'notices')} />}
                    />
                </div>
            </div>

            {/* Privacy Section */}
            <div className="mb-4">
                <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Privacy
                </p>
                <div className="bg-white border-y border-gray-200 divide-y divide-gray-100">
                    <SettingItem
                        icon={Phone}
                        label="Show Phone to Teachers"
                        rightContent={<Toggle enabled={settings.privacy.showPhone} onToggle={() => handleToggle('privacy', 'showPhone')} />}
                    />
                    <SettingItem
                        icon={Mail}
                        label="Show Email to Teachers"
                        rightContent={<Toggle enabled={settings.privacy.showEmail} onToggle={() => handleToggle('privacy', 'showEmail')} />}
                    />
                </div>
            </div>

            {/* Appearance Section */}
            <div className="mb-4">
                <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Appearance
                </p>
                <div className="bg-white border-y border-gray-200 divide-y divide-gray-100">
                    <SettingItem
                        icon={Moon}
                        label="Dark Mode"
                        rightContent={<Toggle enabled={settings.appearance.darkMode} onToggle={() => handleToggle('appearance', 'darkMode')} />}
                    />
                    <SettingItem
                        icon={Globe}
                        label="Language"
                        rightContent={<span className="text-sm text-gray-500">{settings.appearance.language}</span>}
                        onClick={() => { }}
                    />
                </div>
            </div>

            {/* Support Section */}
            <div className="mb-4">
                <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Support
                </p>
                <div className="bg-white border-y border-gray-200 divide-y divide-gray-100">
                    <SettingItem
                        icon={HelpCircle}
                        label="Help & Support"
                        rightContent={<ChevronRight size={18} className="text-gray-400" />}
                        onClick={() => navigate('/parent/support')}
                    />
                </div>
            </div>

            {/* Logout */}
            <div className="px-4">
                <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 active:bg-red-100"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ParentSettingsPage;
