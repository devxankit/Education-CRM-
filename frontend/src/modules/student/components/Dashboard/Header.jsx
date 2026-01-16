import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, HelpCircle } from 'lucide-react';
import { colors } from '@/theme/colors';
import { motion } from 'framer-motion';

const Header = ({ user }) => {
    const navigate = useNavigate();
    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 pb-4"
        >
            <div className="flex items-center justify-between max-w-md mx-auto">
                <div className="flex items-center gap-3">
                    <div className="border border-indigo-100 p-0.5 rounded-full">
                        <img
                            src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Student"}
                            alt="Profile"
                            className="w-10 h-10 rounded-full bg-indigo-50"
                        />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium">Good Morning,</p>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">
                            {user?.name || 'Student'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => navigate('/student/help')}
                        className="p-2 rounded-full hover:bg-gray-50 transition-colors text-gray-600"
                    >
                        <HelpCircle size={22} />
                    </button>
                    <button
                        onClick={() => navigate('/student/notifications')}
                        className="relative p-2 rounded-full hover:bg-gray-50 transition-colors"
                    >
                        <Bell size={22} className="text-gray-600" />
                        {(user?.unreadNotifications > 0) && (
                            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        )}
                    </button>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;
