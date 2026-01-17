
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import StaffSidebar from '../components/common/StaffSidebar';
import StaffHeader from '../components/common/StaffHeader';
import StaffBottomNav from '../components/common/StaffBottomNav';

const StaffLayout = () => {
    const location = useLocation();

    // Auth Check Simualtion:
    // In real app, check context for isAuthenticated
    // if (!isAuthenticated && location.pathname !== '/staff/login') return <Navigate to="/staff/login" />;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Desktop Sidebar - Hidden on Mobile */}
            <div className="hidden md:block h-full shadow-xl z-30">
                <StaffSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full relative">

                {/* Header - Sticky on Desktop & Mobile */}
                <div className="sticky top-0 z-20 w-full">
                    <StaffHeader />
                </div>

                {/* Page Content - Scrollable */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 pb-20 md:pb-6 px-4 md:px-6 pt-4 md:pt-6">
                    <Outlet />
                </main>

                {/* Mobile Bottom Nav - Visible ONLY on Mobile */}
                <StaffBottomNav />
            </div>
        </div>
    );
};

export default StaffLayout;
