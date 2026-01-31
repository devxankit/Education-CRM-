/**
 * Exam API Service for Teacher Module
 * Provides methods to interact with exam and marks data
 */

import { examsData } from '../data/examsData';

// Simulates API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all exams
 */
export const getExamList = async () => {
    await delay(300);
    return { success: true, data: examsData.list };
};

/**
 * Get exam by ID
 */
export const getExamById = async (id) => {
    await delay(200);
    const exam = examsData.list.find(e => e.id === id);
    if (!exam) {
        return { success: false, error: 'Exam not found' };
    }
    return { success: true, data: exam };
};

/**
 * Get students for an exam
 */
export const getExamStudents = async (examId) => {
    await delay(300);
    const students = examsData.students[examId] || [];
    return { success: true, data: students };
};

/**
 * Save marks for students
 */
export const saveMarks = async (examId, marksData) => {
    await delay(500);
    // marksData is array of { studentId, marks, remarks }
    return {
        success: true,
        message: 'Marks saved successfully',
        data: {
            examId,
            savedCount: marksData.length,
            savedAt: new Date().toISOString()
        }
    };
};

/**
 * Submit marks for final review
 */
export const submitMarksForReview = async (examId) => {
    await delay(400);
    return {
        success: true,
        message: 'Marks submitted for review'
    };
};

/**
 * Lock marks (after approval)
 */
export const lockMarks = async (examId) => {
    await delay(300);
    return {
        success: true,
        message: 'Marks locked successfully'
    };
};

/**
 * Get marks summary for an exam
 */
export const getMarksSummary = async (examId) => {
    await delay(300);
    return {
        success: true,
        data: {
            examId,
            totalStudents: 38,
            evaluated: 12,
            pending: 26,
            highestMarks: 48,
            lowestMarks: 12,
            averageMarks: 32.5
        }
    };
};

export default {
    getExamList,
    getExamById,
    getExamStudents,
    saveMarks,
    submitMarksForReview,
    lockMarks,
    getMarksSummary
};
