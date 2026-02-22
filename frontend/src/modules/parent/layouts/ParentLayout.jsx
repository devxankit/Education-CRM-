
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ParentBottomNav from '../components/common/ParentBottomNav';
import { useParentStore } from '../../../store/parentStore';

const ParentLayout = () => {
    const user = useParentStore(state => state.user);
    const children = useParentStore(state => state.children);
    const fetchDashboardData = useParentStore(state => state.fetchDashboardData);

    // Ensure linked children are loaded on any parent page (e.g. direct nav, refresh)
    useEffect(() => {
        if (user && (!children || children.length === 0)) {
            fetchDashboardData();
        }
    }, [user, children, fetchDashboardData]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Outlet />
            <ParentBottomNav />
        </div>
    );
};

export default ParentLayout;
