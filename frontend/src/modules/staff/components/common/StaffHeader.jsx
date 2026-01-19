
import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../../context/StaffAuthContext';

const StaffHeader = () => {
    const navigate = useNavigate();
    const { user, logout } = useStaffAuth();

    const handleLogout = () => {
        logout();
        navigate('/staff/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
            <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
            <div className="flex items-center gap-2 md:gap-4">
                <button
                    onClick={() => navigate('/staff/notices')}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors"
                    aria-label="Notifications"
                >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="h-6 w-px bg-gray-200 mx-1"></div>

                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate('/staff/profile')}
                >
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors uppercase">
                            {user?.name || 'Staff Member'}
                        </p>
                        <p className="text-xs text-gray-500">{user?.role || 'Staff User'}</p>
                    </div>
                    <div className="w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                        <User size={18} />
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
};

export default StaffHeader;