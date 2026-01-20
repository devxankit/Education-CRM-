import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart2, User, FileText, Bus, Banknote, LifeBuoy, Menu, X, ChevronRight } from 'lucide-react';
import { useStaffAuth } from '../../context/StaffAuthContext';
import { STAFF_ROLES } from '../../config/roles';

const StaffBottomNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useStaffAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Helper to check active state including sub-routes
    const isActive = (path) => location.pathname.startsWith(path);

    // Determine the primary operational module based on role
    const getRoleModule = () => {
        const role = user?.role;
        switch (role) {
            case STAFF_ROLES.ACCOUNTS:
                return { path: '/staff/fees', icon: Banknote, label: 'Finance' };
            case STAFF_ROLES.TRANSPORT:
                return { path: '/staff/transport', icon: Bus, label: 'Transport' };
            case STAFF_ROLES.DATA_ENTRY:
                return { path: '/staff/teachers', icon: FileText, label: 'Registry' };
            case STAFF_ROLES.SUPPORT:
                return { path: '/staff/support', icon: LifeBuoy, label: 'Support' };
            case STAFF_ROLES.FRONT_DESK:
                return { path: '/staff/support', icon: LifeBuoy, label: 'Inquiry' };
            default:
                return { path: '/staff/notices', icon: FileText, label: 'Notices' };
        }
    };

    const roleModule = getRoleModule();

    const navItems = [
        { path: '/staff/dashboard', icon: LayoutDashboard, label: 'Home' },
        { path: '/staff/students', icon: Users, label: 'People' }, // Renamed from Students
        roleModule,
        { path: '/staff/reports', icon: BarChart2, label: 'Reports' },
    ];

    return (
        <>
            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-40 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-around h-16">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 relative ${active ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-500'
                                    }`}
                            >
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

                    {/* Menu Trigger */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 relative ${isMenuOpen ? 'text-indigo-600' : 'text-gray-400'}`}
                    >
                        <Menu size={22} strokeWidth={2} />
                        <span className="text-[10px] font-medium tracking-tight">Menu</span>
                    </button>
                </div>
            </div>

            {/* Menu Drawer Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 md:hidden animate-fade-in" onClick={() => setIsMenuOpen(false)}>
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 animate-slide-up"
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

                        {/* Grid Menu */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <MenuLink to="/staff/profile" icon={User} label="Profile" onClick={() => setIsMenuOpen(false)} />
                            <MenuLink to="/staff/documents" icon={FileText} label="Docs" onClick={() => setIsMenuOpen(false)} />
                            <MenuLink to="/staff/settings" icon={LifeBuoy} label="Settings" onClick={() => setIsMenuOpen(false)} />
                            <MenuLink to="/staff/transport" icon={Bus} label="Transport" onClick={() => setIsMenuOpen(false)} />
                        </div>

                        {/* Additional Links List */}
                        <div className="space-y-2 mb-6">
                            <div className="bg-gray-50 rounded-xl overflow-hidden">
                                <button onClick={() => { navigate('/staff/fees'); setIsMenuOpen(false); }} className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors border-b border-gray-100">
                                    <span className="text-sm font-bold text-gray-700 flex items-center gap-3">
                                        <Banknote size={18} className="text-gray-400" /> Fees & Finance
                                    </span>
                                    <ChevronRight size={16} className="text-gray-300" />
                                </button>
                                <button onClick={() => { navigate('/staff/teachers'); setIsMenuOpen(false); }} className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors">
                                    <span className="text-sm font-bold text-gray-700 flex items-center gap-3">
                                        <Users size={18} className="text-gray-400" /> Teachers Directory
                                    </span>
                                    <ChevronRight size={16} className="text-gray-300" />
                                </button>
                            </div>
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
const MenuLink = ({ to, icon: Icon, label, onClick }) => (
    <NavLink to={to} onClick={onClick} className="flex flex-col items-center gap-2 group">
        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors border border-gray-100">
            <Icon size={20} />
        </div>
        <span className="text-[10px] font-medium text-gray-600">{label}</span>
    </NavLink>
);

export default StaffBottomNav;
