/**
 * useAttendance Hook for Teacher Module
 */

import { useState, useCallback } from 'react';
import * as attendanceApi from '../services/attendance.api';

export const useAttendance = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submitAttendance = useCallback(async (classId, date, records) => {
        setLoading(true);
        setError(null);
        try {
            const response = await attendanceApi.submitAttendance(classId, date, records);
            return response;
        } catch (err) {
            setError('Submission failed');
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStudents = useCallback(async (classId) => {
        setLoading(true);
        try {
            const response = await attendanceApi.getStudentsByClass(classId);
            return response.data || [];
        } catch (err) {
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        submitAttendance,
        fetchStudents,
        loading,
        error
    };
};

export default useAttendance;
