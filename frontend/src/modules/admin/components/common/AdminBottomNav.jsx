
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, BarChart3, Cog } from 'lucide-react';

const AdminBottomNav = () => {
    const location = useLocation();

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { id: 'users', label: 'Users', icon: Users, path: '/admin/users/admins' },
        { id: 'academics', label: 'Academic', icon: GraduationCap, path: '/admin/academics/classes' },
        { id: 'reports', label: 'Reports', icon: BarChart3, path: '/admin/reports/academic' },
        { id: 'settings', label: 'Settings', icon: Cog, path: '/admin/settings/general' }
    ];

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
            <div className="flex items-center justify-around px-2 py-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${active ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default AdminBottomNav;
