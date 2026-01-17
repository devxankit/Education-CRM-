
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, BarChart2, User, FileText, Bus } from 'lucide-react';

const StaffBottomNav = () => {
    const location = useLocation();

    // Helper to check active state including sub-routes
    const isActive = (path) => location.pathname.startsWith(path);

    const navItems = [
        { path: '/staff/dashboard', icon: LayoutDashboard, label: 'Home' },
        { path: '/staff/students', icon: Users, label: 'Students' },
        // Tasks section handles role-specific operational modules
        {
            path: '/staff/tasks', icon: CheckSquare, label: 'Tasks',
            // For demo, we direct 'Tasks' to Fees/Transport based on context or generic list
            // In real implementation, this could dynamically change or be a Tasks hub
            linkTo: '/staff/fees' // Default to fees or context-aware link
        },
        { path: '/staff/reports', icon: BarChart2, label: 'Reports' },
        { path: '/staff/profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-40 md:hidden shadow-lg shadow-gray-200">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    const linkTarget = item.linkTo || item.path;

                    return (
                        <NavLink
                            key={item.path}
                            to={linkTarget}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 relative ${active ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-500'
                                }`}
                        >
                            {/* Active Indicator Line */}
                            {active && (
                                <span className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-b-full"></span>
                            )}

                            <Icon
                                size={active ? 24 : 22}
                                strokeWidth={active ? 2.5 : 2}
                                className={`transition-all duration-200 ${active ? '-translate-y-0.5' : ''}`}
                            />
                            <span className="text-[10px] font-medium tracking-tight">
                                {item.label}
                            </span>
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default StaffBottomNav;
