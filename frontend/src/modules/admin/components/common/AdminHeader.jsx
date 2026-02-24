import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, User, ChevronDown, LogOut, UserCircle, PanelLeftClose, PanelLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '../../../../store/index';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '@/app/api';

const AdminHeader = ({ onMenuToggle, onSidebarCollapseToggle, sidebarCollapsed }) => {
    const user = useAppStore(state => state.user);
    const logout = useAppStore(state => state.logout);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, next: false, confirm: false });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            logout();
            navigate('/admin/login');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setPasswordError('Please fill all fields.');
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters.');
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('New password and confirm password do not match.');
            return;
        }

        try {
            setChangingPassword(true);
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/institute/change-password`,
                {
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setPasswordSuccess('Password updated successfully.');
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => {
                    setShowPasswordModal(false);
                    setPasswordSuccess('');
                }, 1200);
            } else {
                setPasswordError(response.data.message || 'Failed to update password.');
            }
        } catch (error) {
            setPasswordError(error.response?.data?.message || 'Failed to update password.');
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm relative z-50">
            <div className="flex items-center justify-between px-4 md:px-6 py-4">
                {/* Left Section */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={onMenuToggle}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu size={24} className="text-gray-700" />
                    </button>

                    {/* Desktop: Sidebar Collapse Toggle */}
                    {onSidebarCollapseToggle && (
                        <button
                            onClick={onSidebarCollapseToggle}
                            className="hidden md:flex p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {sidebarCollapsed ? <PanelLeft size={22} /> : <PanelLeftClose size={22} />}
                        </button>
                    )}

                    {/* Search Bar - Hidden on Mobile */}
                    <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 w-96 max-w-[24rem]">
                        <Search size={20} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search across all modules..."
                            className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* Mobile Search Icon */}
                    <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Search size={20} className="text-gray-600" />
                    </button>

                    {/* Notifications */}
                    <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell size={20} className="text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Profile Dropdown */}
                    <div className="flex items-center gap-3 pl-3 border-l border-gray-200 relative" ref={dropdownRef}>
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-semibold text-gray-800">{user?.adminName || user?.name || 'Super Admin'}</p>
                            <p className="text-xs text-gray-500">{user?.email || 'admin@institution.com'}</p>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                {user?.adminName ? user.adminName.charAt(0).toUpperCase() : <User size={18} />}
                            </div>
                            <ChevronDown size={16} className={`text-gray-600 hidden md:block transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-2 border-b border-gray-50 md:hidden">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{user?.adminName || user?.name || 'Super Admin'}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@institution.com'}</p>
                                </div>
                                <button
                                    onClick={() => { navigate('/admin/institution/profile'); setIsMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    <UserCircle size={18} /> Profile
                                </button>
                                <button
                                    onClick={() => { setIsMenuOpen(false); setShowPasswordModal(true); }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    <Lock size={18} /> Change Password
                                </button>
                                <div className="h-px bg-gray-100 my-1"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={18} /> Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Lock size={18} /> Change Password
                            </h2>
                            <button
                                onClick={() => !changingPassword && setShowPasswordModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            {passwordError && (
                                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                    {passwordError}
                                </div>
                            )}
                            {passwordSuccess && (
                                <div className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                                    {passwordSuccess}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? 'text' : 'password'}
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-9 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.next ? 'text' : 'password'}
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-9 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, next: !prev.next }))}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.next ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-9 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => !changingPassword && setShowPasswordModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={changingPassword}
                                    className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-70"
                                >
                                    {changingPassword ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </header>
    );
};

export default AdminHeader;
