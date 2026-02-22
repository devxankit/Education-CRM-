// useParentDashboard.js - Parent Module Dashboard Hook
// Uses parentStore for dynamic data

import { useEffect } from 'react';
import { useParentStore } from '../../../store/parentStore';

/**
 * Hook for parent dashboard data (uses parentStore)
 * @param {string} childId - Selected child ID
 * @returns {Object} Dashboard data and loading state
 */
export const useParentDashboard = (childId) => {
    const user = useParentStore(state => state.user);
    const children = useParentStore(state => state.children);
    const notices = useParentStore(state => state.notices);
    const fetchDashboardData = useParentStore(state => state.fetchDashboardData);
    const isLoading = useParentStore(state => state.isLoading);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const child = children?.find(c => (c._id || c.id) === childId) || children?.[0];
    const dashboardData = child ? {
        parent: user,
        child,
        alerts: child.alerts || [],
        academics: child.academics,
        fees: child.fees,
        notices: notices || []
    } : null;

    const refresh = () => fetchDashboardData();

    return {
        dashboardData,
        loading: isLoading,
        error: null,
        refresh,
    };
};

export default useParentDashboard;
