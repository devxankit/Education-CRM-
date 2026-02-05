import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, GraduationCap, Briefcase,
    Banknote, Receipt, Bus, Box, FileText,
    Bell, LifeBuoy, BarChart2, Shield, Settings, Lock
} from 'lucide-react';
import { useStaffAuth } from '../../context/StaffAuthContext';

const StaffSidebar = () => {
    const { user, permissions: contextPermissions, fetchPermissions } = useStaffAuth();
    const location = useLocation();

    // Refresh permissions on navigation
    useEffect(() => {
        if (fetchPermissions) {
            fetchPermissions();
        }
    }, [location.pathname, fetchPermissions]);

    // Menu Configuration
    const MENU_ITEMS = [
        {
            header: 'Main', items: [
                { path: '/staff/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            ]
        },
        {
            header: 'People', items: [
                { path: '/staff/students', icon: GraduationCap, label: 'Students' },
                { path: '/staff/teachers', icon: Users, label: 'Teachers' },
                { path: '/staff/employees', icon: Briefcase, label: 'Employees' },
            ]
        },
        {
            header: 'Finance', items: [
                { path: '/staff/fees', icon: Banknote, label: 'Fees Collection' },
                { path: '/staff/payroll', icon: Receipt, label: 'Payroll' },
                { path: '/staff/expenses', icon: BarChart2, label: 'Expenses' },
            ]
        },
        {
            header: 'Operations', items: [
                { path: '/staff/transport', icon: Bus, label: 'Transport' },
                { path: '/staff/assets', icon: Box, label: 'Assets & Inventory' },
                { path: '/staff/documents', icon: Shield, label: 'Documents' },
            ]
        },
        {
            header: 'Communication', items: [
                { path: '/staff/notices', icon: Bell, label: 'Notices' },
                { path: '/staff/support', icon: LifeBuoy, label: 'Helpdesk' },
            ]
        },
        {
            header: 'System', items: [
                { path: '/staff/reports', icon: FileText, label: 'Reports' },
                { path: '/staff/settings', icon: Settings, label: 'Settings' },
            ]
        }
    ];

    return (
        <aside className="w-64 h-full bg-white border-r border-gray-200 hidden md:flex flex-col overflow-y-auto">
            {/* Branding */}
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">E</div>
                <div>
                    <h1 className="text-lg font-bold text-gray-900 leading-none">EduCRM</h1>
                    <p className="text-xs text-indigo-600 font-bold mt-1">STAFF PORTAL</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-6">
                {MENU_ITEMS.map((section, idx) => (
                    <div key={idx}>
                        <h3 className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{section.header}</h3>
                        <div className="space-y-1">
                            {section.items.map(item => {
                                const Icon = item.icon;
                                const isActive = location.pathname.startsWith(item.path);

                                // Determine Permission Key from path
                                // e.g., /staff/students -> students
                                const permKey = item.path.split('/')[2];

                                // Permission Logic
                                // 1. Locate permissions object (flattened or nested), prefer fresh context permissions
                                const permissions = (Object.keys(contextPermissions || {}).length > 0)
                                    ? contextPermissions
                                    : (user?.permissions || user?.roleId?.permissions || {});

                                const hasPermissions = Object.keys(permissions).length > 0;
                                const roleCode = user?.roleId?.code || user?.role; // Code from populated role or flat role

                                let isRestricted = false;

                                // Allow Super Admin / Admin bypassing permissions
                                const isSuperUser = ['ROLE_SUPER_ADMIN', 'ADMIN', 'SUPER_ADMIN'].includes(roleCode);

                                if (!isSuperUser) {
                                    if (hasPermissions) {
                                        // Check explicit permission for ALL modules including dashboard
                                        // If permission key is missing, access is denied (Zero Trust)
                                        isRestricted = !permissions[permKey]?.accessible;
                                    } else {
                                        // No permissions configured -> Restrict access (Zero Trust)
                                        // This ensures newly created roles must be explicitly granted access
                                        isRestricted = true;
                                    }
                                }

                                if (isRestricted) {
                                    return null;
                                }

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm group ${isActive
                                            ? 'bg-indigo-50 text-indigo-700 font-bold'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon
                                            size={18}
                                            className={`transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                                        />
                                        {item.label}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Profile Snippet */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Staff User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.role || 'Access'}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default StaffSidebar;