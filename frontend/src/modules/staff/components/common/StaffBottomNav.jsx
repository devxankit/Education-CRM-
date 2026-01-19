
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart2, User, FileText, Bus, Banknote, LifeBuoy, CheckSquare } from 'lucide-react';
import { useStaffAuth } from '../../context/StaffAuthContext';
import { STAFF_ROLES } from '../../config/roles';

const StaffBottomNav = () => {
    const location = useLocation();
    const { user } = useStaffAuth();

    // Helper to check active state including sub-routes
    const isActive = (path) => location.pathname.startsWith(path);

    // Determine the primary operational module based on role
    const getRoleModule = () => {
        const role = user?.role;
        switch (role) {
            case STAFF_ROLES.ACCOUNTS:
                return { path: '/staff/fees', icon: Banknote, label: 'Fees' };
            case STAFF_ROLES.TRANSPORT:
                return { path: '/staff/transport', icon: Bus, label: 'Transport' };
            case STAFF_ROLES.DATA_ENTRY:
                return { path: '/staff/documents', icon: FileText, label: 'Docs' };
            case STAFF_ROLES.SUPPORT:
                return { path: '/staff/support', icon: LifeBuoy, label: 'Support' };
            case STAFF_ROLES.FRONT_DESK:
                return { path: '/staff/documents', icon: FileText, label: 'Docs' };
            default:
                return { path: '/staff/notices', icon: CheckSquare, label: 'Notices' }; // Fallback
        }
    };

    const roleModule = getRoleModule();

    const navItems = [
        { path: '/staff/dashboard', icon: LayoutDashboard, label: 'Home' },
        { path: '/staff/students', icon: Users, label: 'Students' },
        // Dynamic Role-Based Tab
        roleModule,
        { path: '/staff/reports', icon: BarChart2, label: 'Reports' },
        { path: '/staff/profile', icon: User, label: 'Profile' },
    ];

    if (!user) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-40 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    // Check active state
                    const active = isActive(item.path);

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 relative ${active ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-500'
                                }`}
                        >
                            {/* Active Indicator Line */}
                            {active && (
                                <span className="absolute top-0 w-8 h-1 bg-indigo-600 rounded-b-full"></span>
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
