
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { adminMenuConfig } from '../../config/menuConfig';
import { ChevronDown, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useAppStore } from '../../../../store/index';

const AdminSidebar = ({ isOpen, onClose, collapsed = false, onCollapseToggle }) => {
    const user = useAppStore(state => state.user);
    const location = useLocation();
    const [expandedMenus, setExpandedMenus] = useState({});

    const toggleMenu = (menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const isParentActive = (item) => {
        if (item.path === location.pathname) return true;
        return item.subItems?.some(sub => isActive(sub.path));
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:sticky top-0 left-0 h-screen bg-gradient-to-b from-black to-blue-900 
                    text-white flex flex-col z-50 transition-all duration-300 ease-in-out
                    ${collapsed ? 'md:w-[4.5rem]' : 'w-72'}
                    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Header */}
                <div className={`border-b border-white/10 flex items-center justify-between shrink-0 ${collapsed ? 'p-3 flex-col gap-2' : 'p-6 flex-row'}`}>
                    {!collapsed && (
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold font-['Poppins'] truncate">Admin Panel</h1>
                            <p className="text-blue-200 text-sm mt-1 truncate">
                                {user?.instituteName || user?.name || user?.legalName || user?.shortName || 'Super Controller'}
                            </p>
                        </div>
                    )}
                    {collapsed && (
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                            {(user?.instituteName || user?.name || user?.legalName || user?.shortName || 'A')
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        {onCollapseToggle && (
                            <button
                                onClick={onCollapseToggle}
                                className="hidden md:flex p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            >
                                <ChevronLeft size={18} className={collapsed ? 'rotate-180' : ''} />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className={`flex-1 overflow-y-auto custom-scrollbar ${collapsed ? 'py-3 px-2' : 'py-4 px-3'}`}>
                    <div className="space-y-1">
                        {adminMenuConfig.map((item) => {
                            const Icon = item.icon;
                            const hasSubItems = item.subItems && item.subItems.length > 0;
                            const isExpanded = expandedMenus[item.id];
                            const isItemActive = isParentActive(item);

                            if (collapsed) {
                                return (
                                    <div key={item.id} className="relative group/collapsed">
                                        {hasSubItems ? (
                                            <button
                                                onClick={() => toggleMenu(item.id)}
                                                className={`
                                                    w-full flex items-center justify-center p-3 rounded-lg
                                                    transition-all duration-200
                                                    ${isItemActive ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-gray-300'}
                                                `}
                                                title={item.label}
                                            >
                                                <Icon size={22} />
                                            </button>
                                        ) : (
                                            <Link
                                                to={item.path}
                                                onClick={onClose}
                                                className={`
                                                    flex items-center justify-center p-3 rounded-lg transition-all duration-200
                                                    ${isActive(item.path) ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-gray-300'}
                                                `}
                                                title={item.label}
                                            >
                                                <Icon size={22} />
                                            </Link>
                                        )}
                                        {/* Collapsed flyout for submenus */}
                                        {hasSubItems && collapsed && (
                                            <div className="absolute left-full top-0 ml-1 py-2 min-w-[12rem] bg-gray-900 border border-white/10 rounded-lg shadow-xl z-[60] opacity-0 invisible group-hover/collapsed:opacity-100 group-hover/collapsed:visible transition-all duration-150 pointer-events-none group-hover/collapsed:pointer-events-auto">
                                                <div className="px-3 py-1.5 text-xs font-semibold text-blue-200 border-b border-white/10">{item.label}</div>
                                                {item.subItems.map((subItem) => (
                                                    <Link
                                                        key={subItem.id}
                                                        to={subItem.path}
                                                        onClick={onClose}
                                                        className={`block px-4 py-2.5 text-sm rounded-none first:rounded-t-none
                                                            ${isActive(subItem.path) ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}
                                                        `}
                                                    >
                                                        {subItem.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <div key={item.id}>
                                    {hasSubItems ? (
                                        <button
                                            onClick={() => toggleMenu(item.id)}
                                            className={`
                                                w-full flex items-center justify-between px-4 py-3 rounded-lg
                                                transition-all duration-200 group
                                                ${isItemActive ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/10 text-gray-300'}
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon size={20} className={isItemActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                                                <span className="font-medium text-sm">{item.label}</span>
                                            </div>
                                            {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                                        </button>
                                    ) : (
                                        <Link
                                            to={item.path}
                                            onClick={onClose}
                                            className={`
                                                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                                                ${isActive(item.path) ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/10 text-gray-300'}
                                            `}
                                        >
                                            <Icon size={20} className={isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                                            <span className="font-medium text-sm">{item.label}</span>
                                        </Link>
                                    )}

                                    {hasSubItems && isExpanded && (
                                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-white/10 pl-4">
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.id}
                                                    to={subItem.path}
                                                    onClick={onClose}
                                                    className={`
                                                        block px-4 py-2.5 rounded-lg text-sm transition-all duration-200
                                                        ${isActive(subItem.path) ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                                                    `}
                                                >
                                                    {subItem.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer */}
                <div className={`border-t border-white/10 shrink-0 ${collapsed ? 'p-2' : 'p-4'}`}>
                    {collapsed ? (
                        <div className="bg-white/5 rounded-lg p-2 flex items-center justify-center" title="Admin v1.0.0">
                            <span className="text-[10px] font-bold text-blue-200">v1</span>
                        </div>
                    ) : (
                        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                            <p className="text-xs text-gray-400">Admin Version</p>
                            <p className="text-sm font-semibold">v1.0.0</p>
                        </div>
                    )}
                </div>
            </aside>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }
            `}</style>
        </>
    );
};

export default AdminSidebar;
