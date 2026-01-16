import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/Dashboard/BottomNav';

const StudentLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <Outlet />
            <BottomNav />
        </div>
    );
};

export default StudentLayout;
