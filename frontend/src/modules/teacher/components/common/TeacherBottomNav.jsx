import React, { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, BookOpen, ClipboardList, User } from 'lucide-react';
import { colors } from '@/theme/colors';

const TeacherBottomNav = () => {
    const location = useLocation();
    const activeTab = location.pathname.split('/').pop() || 'dashboard';

    const navItems = [
        { id: 'dashboard', icon: Home, label: 'Home', path: '/teacher/dashboard' },
        { id: 'classes', icon: Users, label: 'Classes', path: '/teacher/classes' },
        { id: 'homework', icon: BookOpen, label: 'Homework', path: '/teacher/homework' },
        { id: 'attendance', icon: ClipboardList, label: 'Attendance', path: '/teacher/attendance' },
        { id: 'profile', icon: User, label: 'Profile', path: '/teacher/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
            <div className="flex justify-between items-center max-w-2xl mx-auto">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className="flex flex-col items-center gap-1 w-16"
                        >
                            <div
                                className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-gray-900 text-white -translate-y-2 shadow-lg shadow-gray-200' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                <Icon size={20} className={isActive ? 'fill-current' : ''} />
                            </div>
                            <span
                                className={`text-[10px] font-bold transition-opacity duration-300 ${isActive ? 'opacity-100 text-gray-900' : 'opacity-0 h-0 hidden'}`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default TeacherBottomNav;
