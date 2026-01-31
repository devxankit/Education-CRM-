// useAttendance.js - Parent Module Attendance Hook
// Provides attendance data and loading state

import { useState, useEffect } from 'react';

/**
 * Hook for fetching child's attendance data
 * @param {string} childId - Child ID
 * @param {Object} filters - Optional filters (month, year)
 * @returns {Object} Attendance data and loading state
 */
export const useAttendance = (childId, filters = {}) => {
    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAttendance = async () => {
            if (!childId) return;

            setLoading(true);
            setError(null);

            try {
                // TODO: Replace with actual API call
                await new Promise(resolve => setTimeout(resolve, 400));

                // Mock attendance data
                setAttendanceData({
                    childId,
                    overall: 88,
                    present: 22,
                    absent: 3,
                    late: 1,
                    holidays: 4,
                    totalDays: 26,
                    monthData: generateMonthData()
                });
            } catch (err) {
                setError(err.message || 'Failed to load attendance');
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [childId, filters.month, filters.year]);

    return {
        attendanceData,
        loading,
        error,
    };
};

// Helper to generate mock month data
const generateMonthData = () => {
    const today = new Date();
    const data = [];
    for (let i = 1; i <= today.getDate(); i++) {
        const isWeekend = new Date(today.getFullYear(), today.getMonth(), i).getDay() % 6 === 0;
        data.push({
            date: i,
            status: isWeekend ? 'holiday' : (Math.random() > 0.1 ? 'present' : 'absent')
        });
    }
    return data;
};

export default useAttendance;
