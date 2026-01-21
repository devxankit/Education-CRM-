
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/common/AdminSidebar';
import AdminHeader from '../components/common/AdminHeader';
import AdminBottomNav from '../components/common/AdminBottomNav';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Desktop Sidebar - Hidden on Mobile */}
            <div className="hidden md:block h-full shadow-xl z-30">
                <AdminSidebar isOpen={true} onClose={closeSidebar} />
            </div>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
                <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full relative">
                {/* Header - Sticky on Desktop & Mobile */}
                <div className="sticky top-0 z-20 w-full">
                    <AdminHeader onMenuToggle={toggleSidebar} />
                </div>

                {/* Page Content - Scrollable */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 pb-20 md:pb-6 px-4 md:px-6 pt-4 md:pt-6">
                    <Outlet />
                </main>

                {/* Mobile Bottom Nav - Visible ONLY on Mobile */}
                <AdminBottomNav />
            </div>
        </div>
    );
};

export default AdminLayout;
