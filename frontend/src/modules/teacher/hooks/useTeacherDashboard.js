/**
 * useTeacherDashboard Hook
 */

import { useState, useEffect, useCallback } from 'react';

export const useTeacherDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        // Simulated dashboard data
        setTimeout(() => {
            setData({
                stats: {
                    activeClasses: 4,
                    pendingHomework: 12,
                    totalStudents: 155,
                    attendanceToday: '94%'
                },
                upcomingClasses: [
                    { id: 1, time: '09:00 AM', name: 'Class 10-A', subject: 'Mathematics' },
                    { id: 2, time: '11:00 AM', name: 'Class 9-B', subject: 'Physics' }
                ]
            });
            setLoading(false);
        }, 500);
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return { data, loading, refetch: fetchDashboardData };
};

export default useTeacherDashboard;
