
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/common/AdminSidebar';
import AdminHeader from '../components/common/AdminHeader';
import AdminBottomNav from '../components/common/AdminBottomNav';

const STORAGE_KEY = 'admin-sidebar-collapsed';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'false');
        } catch {
            return false;
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sidebarCollapsed));
    }, [sidebarCollapsed]);

    const toggleSidebar = () => setSidebarOpen((o) => !o);
    const closeSidebar = () => setSidebarOpen(false);
    const toggleSidebarCollapse = () => setSidebarCollapsed((c) => !c);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <div className="hidden md:block h-full shadow-xl z-30 shrink-0">
                <AdminSidebar
                    isOpen={true}
                    onClose={closeSidebar}
                    collapsed={sidebarCollapsed}
                    onCollapseToggle={toggleSidebarCollapse}
                />
            </div>

            <div className="md:hidden">
                <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} collapsed={false} />
            </div>

            <div className="flex-1 flex flex-col h-full relative min-w-0">
                <div className="sticky top-0 z-20 w-full">
                    <AdminHeader onMenuToggle={toggleSidebar} onSidebarCollapseToggle={toggleSidebarCollapse} sidebarCollapsed={sidebarCollapsed} />
                </div>

                {/* Page Content - Scrollable */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 pb-20 md:pb-8 pt-4 md:pt-6 px-4 md:px-6">
                    <Outlet />
                </main>

                {/* Mobile Bottom Nav - Visible ONLY on Mobile */}
                <AdminBottomNav />
            </div>
        </div>
    );
};

export default AdminLayout;
