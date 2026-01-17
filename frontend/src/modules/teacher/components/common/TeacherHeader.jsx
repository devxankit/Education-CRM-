import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Menu } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const TeacherHeader = ({ user }) => {
    const navigate = useNavigate();
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3"
        >
            <div className="flex items-center justify-between max-w-2xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            src={user?.avatar}
                            alt={user?.name}
                            className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50 object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium">Good Morning,</p>
                        <h1 className="text-sm font-bold text-gray-900 leading-tight">
                            {user?.name}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate('/teacher/notices')}
                        className="relative p-2 rounded-full hover:bg-gray-50 transition-colors text-gray-600"
                    >
                        <Bell size={20} />
                        {user?.unreadNotifications > 0 && (
                            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        )}
                    </button>
                    <div
                        onClick={() => navigate('/teacher/profile')}
                        className='cursor-pointer'
                    >
                        {/* Profile Area Clickable */}
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default TeacherHeader;
