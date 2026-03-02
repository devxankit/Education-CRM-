
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ParentBottomNav from '../components/common/ParentBottomNav';
import { useParentStore } from '../../../store/parentStore';

const ParentLayout = () => {
    const user = useParentStore(state => state.user);
    const children = useParentStore(state => state.children);
    const fetchDashboardData = useParentStore(state => state.fetchDashboardData);
    const fetchInstituteProfile = useParentStore(state => state.fetchInstituteProfile);

    // Ensure linked children + institute profile loaded when parent logs in (avoid continuous re-fetch)
    useEffect(() => {
        if (!user) return;

        if (!children || children.length === 0) {
            fetchDashboardData();
        }

        fetchInstituteProfile();
        // dependency only on user so this runs once per login, not on every state change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Outlet />
            <ParentBottomNav />
        </div>
    );
};

export default ParentLayout;
