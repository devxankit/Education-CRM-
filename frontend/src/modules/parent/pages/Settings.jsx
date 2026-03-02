import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParentStore } from '../../../store/parentStore';
import {
    ArrowLeft, User, Bell, Shield, Moon, Globe,
    ChevronRight, LogOut, HelpCircle, Phone, Mail, Lock, Building2, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ParentSettingsPage = () => {
    const navigate = useNavigate();
    const user = useParentStore(state => state.user);
    const instituteProfile = useParentStore(state => state.instituteProfile);
    const logout = useParentStore(state => state.logout);
    const changePassword = useParentStore(state => state.changePassword);

    // Settings state
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

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isChanging, setIsChanging] = useState(false);

    const handleToggle = (category, key) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: !prev[category][key]
            }
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        setIsChanging(true);
        const res = await changePassword({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword
        });
        setIsChanging(false);
        if (res.success) {
            alert("Password changed successfully");
            setIsPasswordModalOpen(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            alert(res.message);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/parent/login');
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
                        {user?.name?.charAt(0) || 'P'}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{user?.name || 'Parent'}</h3>
                        <p className="text-sm text-gray-500">Parent Account</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                </div>
            </div>

            {/* Security Section */}
            <div className="mb-4">
                <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Security
                </p>
                <div className="bg-white border-y border-gray-200 divide-y divide-gray-100">
                    <SettingItem
                        icon={Lock}
                        label="Change Password"
                        description="Keep your account secure"
                        rightContent={<ChevronRight size={18} className="text-gray-400" />}
                        onClick={() => setIsPasswordModalOpen(true)}
                    />
                </div>
            </div>

            {/* Institute Details Card */}
            {instituteProfile && (
                <div className="px-4 mb-5">
                    <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100/70 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-4 pt-4 flex items-center justify-between">
                            <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-[0.18em] flex items-center gap-2">
                                <Building2 size={14} className="text-indigo-400" />
                                Institute Details
                            </p>
                            <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                                {(instituteProfile.type || 'school').toUpperCase()}
                            </span>
                        </div>

                        <div className="px-4 pb-4 pt-3 flex gap-3">
                            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
                                {(instituteProfile.shortName || instituteProfile.legalName || 'I')
                                    .toString()
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-gray-900 truncate">
                                    {instituteProfile.legalName || instituteProfile.shortName || 'Institute'}
                                </h3>
                                {instituteProfile.shortName && instituteProfile.legalName && (
                                    <p className="text-xs text-gray-500 truncate">
                                        Short name: {instituteProfile.shortName}
                                    </p>
                                )}
                                {instituteProfile.affiliations && instituteProfile.affiliations.length > 0 && (
                                    <p className="mt-1 text-[11px] text-gray-500 leading-snug line-clamp-2">
                                        Affiliations: {instituteProfile.affiliations.join(', ')}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="px-4 pb-4 space-y-2 border-t border-indigo-100/60 bg-white/60">
                            <div className="flex items-start gap-2">
                                <MapPin size={14} className="mt-0.5 text-gray-400 shrink-0" />
                                <div className="text-xs text-gray-700 leading-snug">
                                    {instituteProfile.address && (
                                        <p className="font-medium">{instituteProfile.address}</p>
                                    )}
                                    {(instituteProfile.city || instituteProfile.state) && (
                                        <p className="text-gray-500">
                                            {[instituteProfile.city, instituteProfile.state]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {(instituteProfile.phone || instituteProfile.website) && (
                                <div className="flex items-center justify-between text-[11px] text-gray-600 pt-1">
                                    {instituteProfile.phone && (
                                        <span className="flex items-center gap-1">
                                            <Phone size={12} className="text-indigo-500" />
                                            <span className="font-medium">{instituteProfile.phone}</span>
                                        </span>
                                    )}
                                    {instituteProfile.website && (
                                        <span className="flex items-center gap-1 truncate max-w-[150px] justify-end">
                                            <Mail size={12} className="text-indigo-500" />
                                            <span className="text-indigo-600 font-medium truncate">
                                                {instituteProfile.website}
                                            </span>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications Section */}
            <div className="mb-4">
                <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Notifications
                </p>
                <div className="bg-white border-y border-gray-200 divide-y divide-gray-100">
                    <SettingItem
                        icon={Bell}
                        label="Attendance Alerts"
                        rightContent={<Toggle enabled={settings.notifications.attendance} onToggle={() => handleToggle('notifications', 'attendance')} />}
                    />
                    <SettingItem
                        icon={Bell}
                        label="Homework Reminders"
                        rightContent={<Toggle enabled={settings.notifications.homework} onToggle={() => handleToggle('notifications', 'homework')} />}
                    />
                    <SettingItem
                        icon={Bell}
                        label="Fee Reminders"
                        rightContent={<Toggle enabled={settings.notifications.fees} onToggle={() => handleToggle('notifications', 'fees')} />}
                    />
                </div>
            </div>

            {/* Logout */}
            <div className="px-4 mt-8">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 active:bg-red-100"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>

            {/* Password Modal */}
            <AnimatePresence>
                {isPasswordModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsPasswordModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-xl"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <input
                                    type="password"
                                    placeholder="Current Password"
                                    required
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                                    value={passwordForm.currentPassword}
                                    onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                                />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    required
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                                    value={passwordForm.newPassword}
                                    onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    required
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                                    value={passwordForm.confirmPassword}
                                    onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                                />
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm">Cancel</button>
                                    <button type="submit" disabled={isChanging} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm disabled:opacity-50">
                                        {isChanging ? 'Changing...' : 'Update'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ParentSettingsPage;
