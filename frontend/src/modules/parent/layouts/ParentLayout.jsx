
import React from 'react';
import { Outlet } from 'react-router-dom';
import ParentBottomNav from '../components/common/ParentBottomNav';

const ParentLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Outlet />
            <ParentBottomNav />
        </div>
    );
};

export default ParentLayout;
