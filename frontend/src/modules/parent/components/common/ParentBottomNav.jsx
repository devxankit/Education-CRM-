import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PieChart, CreditCard, Bell, User } from 'lucide-react';

const ParentBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { id: 'dashboard', label: 'Home', icon: Home, path: '/parent/dashboard' },
        { id: 'results', label: 'Results', icon: PieChart, path: '/parent/exams' },
        { id: 'fees', label: 'Fees', icon: CreditCard, path: '/parent/fees' },
        { id: 'notices', label: 'Notices', icon: Bell, path: '/parent/notices' },
        { id: 'profile', label: 'Profile', icon: User, path: '/parent/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 pb-safe-bottom z-50 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-300 ${isActive ? 'text-indigo-600 -translate-y-1' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'drop-shadow-lg' : ''} />
                        <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-0 scale-0'} transition-all duration-300 absolute -bottom-1`}>
                            {/* Optional text label if needed, keeping it minimal for now or showing only on active */}
                            {/* {item.label} */}
                        </span>
                        {isActive && <span className="absolute -bottom-2 w-1 h-1 bg-indigo-600 rounded-full"></span>}
                    </button>
                );
            })}
        </div>
    );
};

export default ParentBottomNav;
