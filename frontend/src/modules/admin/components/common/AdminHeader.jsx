
import React from 'react';
import { Menu, Bell, Search, User, ChevronDown } from 'lucide-react';

const AdminHeader = ({ onMenuToggle }) => {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
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
                    <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-semibold text-gray-800">Super Admin</p>
                            <p className="text-xs text-gray-500">admin@institution.com</p>
                        </div>
                        <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                                <User size={18} className="text-white" />
                            </div>
                            <ChevronDown size={16} className="text-gray-600 hidden md:block" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
