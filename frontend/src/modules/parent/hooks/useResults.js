// useResults.js - Parent Module Results/Exams Hook
// Provides exam results data and loading state

import { useState, useEffect } from 'react';

/**
 * Hook for fetching child's exam results
 * @param {string} childId - Child ID
 * @returns {Object} Results data and loading state
 */
export const useResults = (childId) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!childId) return;

            setLoading(true);
            setError(null);

            try {
                // TODO: Replace with actual API call
                await new Promise(resolve => setTimeout(resolve, 400));

                // Mock results data
                setResults([
                    {
                        id: 'EX001',
                        name: 'Mid-Term Examination',
                        date: '2024-09-15',
                        totalMarks: 500,
                        obtained: 420,
                        percentage: 84,
                        rank: 5,
                        grade: 'A',
                        subjects: [
                            { name: 'Mathematics', marks: 90, total: 100, grade: 'A+' },
                            { name: 'Science', marks: 85, total: 100, grade: 'A' },
                            { name: 'English', marks: 82, total: 100, grade: 'A' },
                            { name: 'Hindi', marks: 88, total: 100, grade: 'A' },
                            { name: 'Social Studies', marks: 75, total: 100, grade: 'B+' }
                        ]
                    },
                    {
                        id: 'EX002',
                        name: 'Unit Test 2',
                        date: '2024-08-20',
                        totalMarks: 200,
                        obtained: 175,
                        percentage: 87.5,
                        rank: 3,
                        grade: 'A',
                        subjects: [
                            { name: 'Mathematics', marks: 45, total: 50, grade: 'A+' },
                            { name: 'Science', marks: 42, total: 50, grade: 'A' },
                            { name: 'English', marks: 44, total: 50, grade: 'A' },
                            { name: 'Hindi', marks: 44, total: 50, grade: 'A' }
                        ]
                    }
                ]);
            } catch (err) {
                setError(err.message || 'Failed to load results');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [childId]);

    /**
     * Get result by ID
     * @param {string} resultId - Result ID
     * @returns {Object|null}
     */
    const getResultById = (resultId) => {
        return results.find(r => r.id === resultId) || null;
    };

    /**
     * Get latest result
     * @returns {Object|null}
     */
    const getLatestResult = () => {
        return results.length > 0 ? results[0] : null;
    };

    return {
        results,
        getResultById,
        latestResult: getLatestResult(),
        loading,
        error,
    };
};

export default useResults;
