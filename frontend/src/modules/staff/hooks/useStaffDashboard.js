// useStaffDashboard.js - Staff Dashboard Data Hook
// Provides dashboard data and statistics

import { useState, useEffect } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';

/**
 * Hook for fetching dashboard data
 * @returns {Object} Dashboard data and loading state
 */
export const useStaffDashboard = () => {
    const { user } = useStaffAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);

            try {
                // TODO: Replace with actual API call based on user role
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));

                // Mock dashboard data based on role
                const mockData = {
                    role: user?.role,
                    stats: {
                        totalStudents: 450,
                        activeTickets: 12,
                        pendingFees: 85000,
                        todayAttendance: '94%',
                    },
                    quickActions: [],
                    recentActivity: [],
                };

                setDashboardData(mockData);
            } catch (err) {
                setError(err.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const refreshDashboard = () => {
        // Trigger a refresh
        setLoading(true);
        // Re-fetch will happen via useEffect
    };

    return {
        loading,
        error,
        dashboardData,
        refreshDashboard,
    };
};

export default useStaffDashboard;