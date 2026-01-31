/**
 * useSubmissions Hook for Teacher Module
 */

import { useState, useCallback } from 'react';
import * as submissionApi from '../services/submission.api';

export const useSubmissions = (homeworkId = null) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSubmissions = useCallback(async (id) => {
        setLoading(true);
        const response = await submissionApi.getSubmissionsByHomework(id || homeworkId);
        if (response.success) {
            setSubmissions(response.data);
        }
        setLoading(false);
    }, [homeworkId]);

    const gradeSubmission = useCallback(async (submissionId, status, feedback) => {
        setLoading(true);
        const response = await submissionApi.updateSubmissionStatus(submissionId, status, feedback);
        setLoading(false);
        return response;
    }, []);

    return {
        submissions,
        loading,
        fetchSubmissions,
        gradeSubmission
    };
};

export default useSubmissions;
