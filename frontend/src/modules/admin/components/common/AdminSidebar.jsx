
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { adminMenuConfig } from '../../config/menuConfig';
import { ChevronDown, ChevronRight, X } from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
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
                    text-white w-72 flex flex-col z-50 transition-transform duration-300
                    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold font-['Poppins']">Admin Panel</h1>
                        <p className="text-blue-200 text-sm mt-1">Super Controller</p>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
                    <div className="space-y-1">
                        {adminMenuConfig.map((item) => {
                            const Icon = item.icon;
                            const hasSubItems = item.subItems && item.subItems.length > 0;
                            const isExpanded = expandedMenus[item.id];
                            const isItemActive = isParentActive(item);

                            return (
                                <div key={item.id}>
                                    {/* Main Menu Item */}
                                    {hasSubItems ? (
                                        <button
                                            onClick={() => toggleMenu(item.id)}
                                            className={`
                                                w-full flex items-center justify-between px-4 py-3 rounded-lg
                                                transition-all duration-200 group
                                                ${isItemActive
                                                    ? 'bg-blue-600 text-white shadow-lg'
                                                    : 'hover:bg-white/10 text-gray-300'
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon size={20} className={isItemActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                                                <span className="font-medium text-sm">{item.label}</span>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronDown size={16} className="text-gray-400" />
                                            ) : (
                                                <ChevronRight size={16} className="text-gray-400" />
                                            )}
                                        </button>
                                    ) : (
                                        <Link
                                            to={item.path}
                                            onClick={onClose}
                                            className={`
                                                flex items-center gap-3 px-4 py-3 rounded-lg
                                                transition-all duration-200 group
                                                ${isActive(item.path)
                                                    ? 'bg-blue-600 text-white shadow-lg'
                                                    : 'hover:bg-white/10 text-gray-300'
                                                }
                                            `}
                                        >
                                            <Icon size={20} className={isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                                            <span className="font-medium text-sm">{item.label}</span>
                                        </Link>
                                    )}

                                    {/* Sub Menu Items */}
                                    {hasSubItems && isExpanded && (
                                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-white/10 pl-4">
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.id}
                                                    to={subItem.path}
                                                    onClick={onClose}
                                                    className={`
                                                        block px-4 py-2.5 rounded-lg text-sm
                                                        transition-all duration-200
                                                        ${isActive(subItem.path)
                                                            ? 'bg-white/10 text-white font-medium'
                                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                        }
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
                <div className="p-4 border-t border-white/10">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                        <p className="text-xs text-gray-400">Admin Version</p>
                        <p className="text-sm font-semibold">v1.0.0</p>
                    </div>
                </div>
            </aside>

            <style jsx>{`
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
