/**
 * useExamMarks Hook for Teacher Module
 */

import { useState, useCallback } from 'react';
import * as examApi from '../services/exam.api';

export const useExamMarks = (examId = null) => {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);

    const fetchStudents = useCallback(async (id) => {
        setLoading(true);
        const response = await examApi.getExamStudents(id || examId);
        if (response.success) {
            setStudents(response.data);
        }
        setLoading(false);
    }, [examId]);

    const saveMarks = useCallback(async (id, marksData) => {
        setLoading(true);
        const response = await examApi.saveMarks(id || examId, marksData);
        setLoading(false);
        return response;
    }, [examId]);

    return {
        students,
        loading,
        fetchStudents,
        saveMarks
    };
};

export default useExamMarks;
