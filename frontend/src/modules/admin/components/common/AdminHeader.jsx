import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, User, ChevronDown, LogOut, Settings, UserCircle } from 'lucide-react';
import { useAppStore } from '../../../../store/index';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ onMenuToggle }) => {
    const user = useAppStore(state => state.user);
    const logout = useAppStore(state => state.logout);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
            navigate('/login');
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm relative z-50">
            <div className="flex items-center justify-between px-4 md:px-6 py-4">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={onMenuToggle}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu size={24} className="text-gray-700" />
                    </button>

                    {/* Search Bar - Hidden on Mobile */}
                    <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 w-96">
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
                                    onClick={() => { navigate('/admin/settings/profile'); setIsMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    <UserCircle size={18} /> Profile Settings
                                </button>
                                <button
                                    onClick={() => { navigate('/admin/settings'); setIsMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    <Settings size={18} /> System Settings
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
        </header>
    );
};

export default AdminHeader;
