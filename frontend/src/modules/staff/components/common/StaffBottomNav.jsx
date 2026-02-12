import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, BarChart2, User, FileText, Bus, Banknote,
    LifeBuoy, Menu, X, ChevronRight, Lock, Briefcase, Receipt, Box, Bell, Shield, ClipboardCheck
} from 'lucide-react';
import { useStaffAuth } from '../../context/StaffAuthContext';
import { STAFF_ROLES } from '../../config/roles';

const StaffBottomNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, permissions: contextPermissions, fetchPermissions } = useStaffAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Permissions are managed globally by StaffAuthContext (Initial Fetch + Socket Updates)

    // Check Access
    const checkAccess = (path) => {
        if (!path) return false;
        const key = path.split('/')[2];

        const permissions = (Object.keys(contextPermissions || {}).length > 0)
            ? contextPermissions
            : (user?.permissions || user?.roleId?.permissions || {});

        const hasPermissions = Object.keys(permissions).length > 0;
        const roleCode = user?.roleId?.code || user?.role;
        const isSuperUser = ['ROLE_SUPER_ADMIN', 'ADMIN', 'SUPER_ADMIN'].includes(roleCode);

        if (isSuperUser) return true;
        // if (key === 'dashboard') return true; // Removed absolute bypass to respect permission settings
        if (key === 'profile') return true; // Always allow profile

        if (hasPermissions) {
            return permissions[key]?.accessible === true;
        } else {
            // Zero Trust: No permissions = No Access
            return false;
        }
    };

    // Helper to check active state including sub-routes
    const isActive = (path) => location.pathname.startsWith(path);

    // All possible navigation options in priority order
    // Ensure this list covers ALL available Sidebar modules so they appear if allowed
    const allNavOptions = [
        { path: '/staff/dashboard', icon: LayoutDashboard, label: 'Home' },
        { path: '/staff/students', icon: Users, label: 'Students' },
        { path: '/staff/fees', icon: Banknote, label: 'Fees' },
        { path: '/staff/payroll', icon: Receipt, label: 'Payroll' },
        { path: '/staff/expenses', icon: BarChart2, label: 'Expenses' },
        { path: '/staff/transport', icon: Bus, label: 'Transport' },
        { path: '/staff/teachers', icon: FileText, label: 'Teachers' },
        { path: '/staff/teacher-attendance', icon: ClipboardCheck, label: 'T.Attendance' },
        { path: '/staff/employees', icon: Briefcase, label: 'Staff' },
        { path: '/staff/assets', icon: Box, label: 'Assets' },
        { path: '/staff/reports', icon: FileText, label: 'Reports' },
        { path: '/staff/documents', icon: Shield, label: 'Docs' },
        { path: '/staff/notices', icon: Bell, label: 'Notices' },
        { path: '/staff/support', icon: LifeBuoy, label: 'Support' },
    ];

    // Filter allowed modules
    const allowedNavs = allNavOptions.filter(item => checkAccess(item.path));

    // Logic: If role has 6 or fewer modules, show ALL of them directly.
    // Otherwise show 5 + Menu (Total 6 slots).
    // This accommodates roles with slightly more permissions (like Accountant with 6).
    const showMenu = allowedNavs.length > 6;
    const visibleItems = showMenu ? allowedNavs.slice(0, 5) : allowedNavs;
    const hiddenItems = showMenu ? allowedNavs.slice(5) : [];

    return (
        <>
            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 pb-safe z-40 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-around h-20 px-2">
                    {visibleItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 group ${active ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                <div className={`relative p-2 rounded-xl transition-all duration-300 ${active ? 'bg-indigo-50 shadow-sm -translate-y-1' : 'group-hover:bg-gray-50'}`}>
                                    <Icon
                                        size={22}
                                        strokeWidth={active ? 2.5 : 2}
                                        className={`transition-all duration-300 ${active ? 'text-indigo-600' : 'text-gray-400'}`}
                                    />
                                    {active && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full"></span>}
                                </div>
                                <span className={`mt-1 text-[10px] font-bold tracking-wide transition-all duration-300 ${active ? 'text-indigo-700' : 'text-gray-500'}`}>
                                    {item.label}
                                </span>
                            </NavLink>
                        );
                    })}

                    {/* Menu Trigger - Only if items overflow > 5 */}
                    {showMenu && (
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 group ${isMenuOpen ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <div className={`p-2 rounded-xl transition-all duration-300 ${isMenuOpen ? 'bg-indigo-50 shadow-sm -translate-y-1' : 'group-hover:bg-gray-50'}`}>
                                <Menu size={22} strokeWidth={isMenuOpen ? 2.5 : 2} />
                            </div>
                            <span className={`mt-1 text-[10px] font-bold tracking-wide transition-all duration-300 ${isMenuOpen ? 'text-indigo-700' : 'text-gray-500'}`}>
                                Menu
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {/* Menu Drawer Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 md:hidden animate-fade-in" onClick={() => setIsMenuOpen(false)}>
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 animate-slide-up max-h-[85vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Drawer Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                    {user?.name?.charAt(0) || 'S'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{user?.name}</h3>
                                    <p className="text-xs text-gray-500 font-medium">{user?.role} Staff</p>
                                </div>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Additional/Hidden Items Grid */}
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">More Apps</h4>
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <MenuLink to="/staff/profile" icon={User} label="Profile" onClick={() => setIsMenuOpen(false)} allowed={true} />
                            <MenuLink to="/staff/settings" icon={LifeBuoy} label="Settings" onClick={() => setIsMenuOpen(false)} allowed={checkAccess('/staff/settings')} />

                            {hiddenItems.map(item => (
                                <MenuLink
                                    key={item.path}
                                    to={item.path}
                                    icon={item.icon}
                                    label={item.label}
                                    onClick={() => setIsMenuOpen(false)}
                                    allowed={true}
                                />
                            ))}
                        </div>

                        {/* Logout */}
                        <button
                            onClick={logout}
                            className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl text-sm hover:bg-red-100 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

// Helper for Grid Menu Item
const MenuLink = ({ to, icon: Icon, label, onClick, allowed = true }) => {
    if (!allowed) return null;

    return (
        <NavLink to={to} onClick={onClick} className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors border border-gray-100">
                <Icon size={20} />
            </div>
            <span className="text-[10px] font-medium text-gray-600">{label}</span>
        </NavLink>
    );
};

export default StaffBottomNav;
