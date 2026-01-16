import React from 'react';
import { Outlet } from 'react-router-dom';
import TeacherBottomNav from '../components/common/TeacherBottomNav';

const TeacherLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <Outlet />
            <TeacherBottomNav />
        </div>
    );
};

export default TeacherLayout;
