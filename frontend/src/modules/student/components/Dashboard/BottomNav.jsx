import React from 'react';
import { Home, BookOpen, FileText, Bell, User } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { colors } from '@/theme/colors';

const BottomNav = () => {
    const location = useLocation();
    const activeTab = location.pathname.split('/').pop() || 'dashboard';

    const navItems = [
        { id: 'dashboard', icon: Home, label: 'Home', path: '/student/dashboard' },
        { id: 'academics', icon: BookOpen, label: 'Academics', path: '/student/academics' },
        { id: 'homework', icon: FileText, label: 'Homework', path: '/student/homework' },
        { id: 'notices', icon: Bell, label: 'Notices', path: '/student/notices' },
        { id: 'profile', icon: User, label: 'Profile', path: '/student/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id || (item.id === 'dashboard' && activeTab === '');
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className="flex flex-col items-center gap-1 w-16"
                        >
                            <div
                                className={`p-2 rounded-full transition-all duration-300 ${isActive ? 'bg-primary/10 -translate-y-1' : ''
                                    }`}
                                style={{
                                    color: isActive ? colors.student.primary : colors.student.muted,
                                    backgroundColor: isActive ? colors.student.highlight : 'transparent',
                                }}
                            >
                                <Icon size={20} className={isActive ? 'fill-current' : ''} />
                            </div>
                            <span
                                className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? 'text-primary' : 'text-gray-400'
                                    }`}
                                style={{ color: isActive ? colors.student.primary : colors.student.muted }}
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

export default BottomNav;
