/**
 * Homework API Service for Teacher Module
 * Provides methods to interact with homework data
 */

import { homeworkData } from '../data/homeworkData';

// Simulates API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all homework assignments
 */
export const getHomeworkList = async () => {
    await delay(300);
    return { success: true, data: homeworkData.list };
};

/**
 * Get homework by ID
 */
export const getHomeworkById = async (id) => {
    await delay(200);
    const homework = homeworkData.list.find(hw => hw.id === id);
    if (!homework) {
        return { success: false, error: 'Homework not found' };
    }
    return { success: true, data: homework };
};

/**
 * Create new homework
 */
export const createHomework = async (data) => {
    await delay(400);
    const newHomework = {
        id: `HW-${Date.now()}`,
        ...data,
        postedDate: new Date().toISOString().split('T')[0],
        submissionCount: 0,
        status: 'Active'
    };
    // In real app, this would be an API call
    return { success: true, data: newHomework };
};

/**
 * Update homework
 */
export const updateHomework = async (id, data) => {
    await delay(300);
    const index = homeworkData.list.findIndex(hw => hw.id === id);
    if (index === -1) {
        return { success: false, error: 'Homework not found' };
    }
    return { success: true, data: { ...homeworkData.list[index], ...data } };
};

/**
 * Delete homework
 */
export const deleteHomework = async (id) => {
    await delay(300);
    return { success: true, message: 'Homework deleted successfully' };
};

/**
 * Get homework submissions
 */
export const getSubmissions = async (homeworkId) => {
    await delay(300);
    return { success: true, data: homeworkData.submissions };
};

/**
 * Grade submission
 */
export const gradeSubmission = async (submissionId, feedback, grade) => {
    await delay(300);
    return { success: true, message: 'Submission graded successfully' };
};

export default {
    getHomeworkList,
    getHomeworkById,
    createHomework,
    updateHomework,
    deleteHomework,
    getSubmissions,
    gradeSubmission
};
