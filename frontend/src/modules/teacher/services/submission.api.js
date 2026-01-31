/**
 * Submission API Service for Teacher Module
 * Handles student homework submissions
 */

import { homeworkData } from '../data/homeworkData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getSubmissionsByHomework = async (homeworkId) => {
    await delay(300);
    // Returning mock submissions from homeworkData
    return { success: true, data: homeworkData.submissions };
};

export const getSubmissionDetails = async (submissionId) => {
    await delay(200);
    const submission = homeworkData.submissions.find(s => s.id === submissionId);
    return { success: !!submission, data: submission };
};

export const updateSubmissionStatus = async (submissionId, status, feedback) => {
    await delay(400);
    return { success: true, message: 'Submission status updated' };
};

export const addFeedback = async (submissionId, feedback) => {
    await delay(300);
    return { success: true, message: 'Feedback added' };
};

export default {
    getSubmissionsByHomework,
    getSubmissionDetails,
    updateSubmissionStatus,
    addFeedback
};
