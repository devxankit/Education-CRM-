import React from 'react';
import { motion } from 'framer-motion';
import { Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherHeader = ({ user }) => {
    const navigate = useNavigate();

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Get display name
    const displayName = user?.firstName
        ? `${user.firstName} ${user.lastName || ''}`.trim()
        : user?.name || 'Teacher';

    // Generate avatar URL if not present
    const avatarUrl = user?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4F46E5&color=fff`;

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3"
        >
            <div className="flex items-center justify-between max-w-2xl mx-auto">
                <div className="flex items-center gap-3">
                    <div
                        className="relative cursor-pointer"
                        onClick={() => navigate('/teacher/profile')}
                    >
                        <img
                            src={avatarUrl}
                            alt={displayName}
                            className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50 object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4F46E5&color=fff`;
                            }}
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium">{getGreeting()},</p>
                        <h1 className="text-sm font-bold text-gray-900 leading-tight">
                            {displayName}
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
                </div>
            </div>
        </motion.header>
    );
};

export default TeacherHeader;
