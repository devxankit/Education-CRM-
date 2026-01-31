// useHomework.js - Parent Module Homework Hook
// Provides homework data and loading state

import { useState, useEffect } from 'react';

/**
 * Hook for fetching child's homework data
 * @param {string} childId - Child ID
 * @param {Object} filters - Optional filters (status, subject)
 * @returns {Object} Homework data and loading state
 */
export const useHomework = (childId, filters = {}) => {
    const [homeworkList, setHomeworkList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHomework = async () => {
            if (!childId) return;

            setLoading(true);
            setError(null);

            try {
                // TODO: Replace with actual API call
                await new Promise(resolve => setTimeout(resolve, 400));

                // Mock homework data
                const mockData = [
                    { id: 'HW001', subject: 'Mathematics', title: 'Chapter 4 Exercises', dueDate: '2024-10-20', status: 'Pending', teacher: 'Mrs. Priya Sharma' },
                    { id: 'HW002', subject: 'Science', title: 'Lab Report - Photosynthesis', dueDate: '2024-10-22', status: 'Pending', teacher: 'Mr. Rajesh Kumar' },
                    { id: 'HW003', subject: 'English', title: 'Essay: My Favourite Book', dueDate: '2024-10-18', status: 'Submitted', teacher: 'Ms. Anjali Verma' },
                    { id: 'HW004', subject: 'Hindi', title: 'Kavita Yaad Karna', dueDate: '2024-10-19', status: 'Submitted', teacher: 'Mr. Vikram Singh' },
                ];

                // Apply filters
                let filtered = mockData;
                if (filters.status) {
                    filtered = filtered.filter(h => h.status === filters.status);
                }
                if (filters.subject) {
                    filtered = filtered.filter(h => h.subject === filters.subject);
                }

                setHomeworkList(filtered);
            } catch (err) {
                setError(err.message || 'Failed to load homework');
            } finally {
                setLoading(false);
            }
        };

        fetchHomework();
    }, [childId, filters.status, filters.subject]);

    /**
     * Get pending homework count
     * @returns {number}
     */
    const getPendingCount = () => {
        return homeworkList.filter(h => h.status === 'Pending').length;
    };

    return {
        homeworkList,
        pendingCount: getPendingCount(),
        loading,
        error,
    };
};

export default useHomework;
