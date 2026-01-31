// useParentDashboard.js - Parent Module Dashboard Hook
// Provides dashboard data and loading state

import { useState, useEffect } from 'react';
import { MOCK_PARENT_DATA } from '../data/mockData';

/**
 * Hook for fetching parent dashboard data
 * @param {string} childId - Selected child ID
 * @returns {Object} Dashboard data and loading state
 */
export const useParentDashboard = (childId) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);
            setError(null);

            try {
                // TODO: Replace with actual API call
                await new Promise(resolve => setTimeout(resolve, 500));

                const child = MOCK_PARENT_DATA.children.find(c => c.id === childId);

                if (child) {
                    setDashboardData({
                        parent: MOCK_PARENT_DATA.user,
                        child: child,
                        alerts: child.alerts,
                        academics: child.academics,
                        fees: child.fees,
                        notices: MOCK_PARENT_DATA.notices
                    });
                } else {
                    setError('Child not found');
                }
            } catch (err) {
                setError(err.message || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (childId) {
            fetchDashboard();
        }
    }, [childId]);

    /**
     * Refresh dashboard data
     */
    const refresh = () => {
        setLoading(true);
        // Re-trigger effect by changing a dependency
    };

    return {
        dashboardData,
        loading,
        error,
        refresh,
    };
};

export default useParentDashboard;
