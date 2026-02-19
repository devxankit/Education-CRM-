import axios from 'axios';
import { API_URL } from '@/app/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

/**
 * Mark a class as completed
 */
export const markClassCompletion = async (completionData) => {
    try {
        const response = await axios.post(
            `${API_URL}/teacher/class-completion`,
            completionData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error('Error marking class completion:', error);
        throw error.response?.data || { success: false, message: 'Failed to mark class completion' };
    }
};

/**
 * Get class completions with filters
 */
export const getClassCompletions = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.classId) params.append('classId', filters.classId);
        if (filters.sectionId) params.append('sectionId', filters.sectionId);
        if (filters.subjectId) params.append('subjectId', filters.subjectId);

        const response = await axios.get(
            `${API_URL}/teacher/class-completion?${params.toString()}`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching class completions:', error);
        throw error.response?.data || { success: false, message: 'Failed to fetch class completions' };
    }
};

/**
 * Get today's classes with completion status
 */
export const getTodayClassesWithCompletion = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/teacher/today-classes`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching today classes:', error);
        throw error.response?.data || { success: false, message: 'Failed to fetch today classes' };
    }
};
