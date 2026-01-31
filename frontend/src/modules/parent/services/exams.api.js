// exams.api.js - Parent Module Exams/Results API Service
// This service will be used for backend integration

/**
 * Get all exam results for a child
 * @param {string} childId - Child ID
 * @returns {Promise<Array>} List of exam results
 */
export const getExamResults = async (childId) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 'EX001', name: 'Mid-Term Exam', date: '2024-09-15', totalMarks: 500, obtained: 420, percentage: 84, rank: 5 },
                { id: 'EX002', name: 'Unit Test 2', date: '2024-08-20', totalMarks: 200, obtained: 175, percentage: 87.5, rank: 3 },
            ]);
        }, 300);
    });
};

/**
 * Get exam result details
 * @param {string} resultId - Result ID
 * @returns {Promise<Object>} Result details
 */
export const getResultById = async (resultId) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: resultId,
                examName: 'Mid-Term Exam',
                date: '2024-09-15',
                totalMarks: 500,
                obtained: 420,
                percentage: 84,
                rank: 5,
                subjects: [
                    { name: 'Mathematics', marks: 90, total: 100, grade: 'A+' },
                    { name: 'Science', marks: 85, total: 100, grade: 'A' },
                    { name: 'English', marks: 82, total: 100, grade: 'A' },
                    { name: 'Hindi', marks: 88, total: 100, grade: 'A' },
                    { name: 'Social Studies', marks: 75, total: 100, grade: 'B+' }
                ]
            });
        }, 300);
    });
};

export default {
    getExamResults,
    getResultById,
};
