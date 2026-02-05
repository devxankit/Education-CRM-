import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useParentStore } from '../../../../store/parentStore';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ parentName, onNotificationClick }) => {
    const logout = useParentStore(state => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/parent/login');
    };

    return (
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
            <div>
                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Parent Portal</h1>
                <p className="text-xs font-semibold text-gray-500">Hello, {parentName}</p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onNotificationClick}
                    className="relative p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                >
                    <Bell size={18} />
                    <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
                </button>
                <button
                    onClick={handleLogout}
                    className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
