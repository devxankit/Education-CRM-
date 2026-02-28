import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/common/AdminSidebar';
import AdminHeader from '../components/common/AdminHeader';
import AdminBottomNav from '../components/common/AdminBottomNav';
import { useAdminStore } from '@/store/adminStore';
import { FlaskConical } from 'lucide-react';

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
    const testMode = useAdminStore((s) => s.testMode);
    const fetchAppConfig = useAdminStore((s) => s.fetchAppConfig);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sidebarCollapsed));
    }, [sidebarCollapsed]);

    useEffect(() => {
        fetchAppConfig();
    }, [fetchAppConfig]);

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

                {testMode && (
                    <div className="bg-amber-500 text-amber-950 px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium shrink-0">
                        <FlaskConical size={18} />
                        <span>Test Mode — Emails are not sent; actions are simulated.</span>
                    </div>
                )}

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
