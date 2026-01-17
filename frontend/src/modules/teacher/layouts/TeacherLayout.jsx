import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TeacherBottomNav from '../components/common/TeacherBottomNav';

const TeacherLayout = () => {
    const location = useLocation();
    const hideNavPaths = ['/teacher/help'];
    const shouldHideNav = hideNavPaths.some(path => location.pathname === path || location.pathname.startsWith(path + '/'));

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Outlet />
            {!shouldHideNav && <TeacherBottomNav />}
        </div>
    );
};

export default TeacherLayout;
