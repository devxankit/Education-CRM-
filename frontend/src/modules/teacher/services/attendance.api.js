/**
 * Attendance API Service for Teacher Module
 * Provides methods to interact with attendance data
 */

import { attendanceData } from '../data/attendanceData';

// Simulates API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get classes for attendance
 */
export const getClasses = async () => {
    await delay(200);
    return { success: true, data: attendanceData.classes };
};

/**
 * Get students for a class
 */
export const getStudentsByClass = async (classId) => {
    await delay(300);
    return { success: true, data: attendanceData.students };
};

/**
 * Get attendance metadata
 */
export const getAttendanceMetadata = async () => {
    await delay(100);
    return { success: true, data: attendanceData.metadata };
};

/**
 * Submit attendance
 */
export const submitAttendance = async (classId, date, attendanceRecords) => {
    await delay(500);
    // In real app, this would be an API call
    return {
        success: true,
        message: 'Attendance submitted successfully',
        data: {
            classId,
            date,
            recordCount: attendanceRecords.length,
            submittedAt: new Date().toISOString()
        }
    };
};

/**
 * Get attendance history for a class
 */
export const getAttendanceHistory = async (classId, startDate, endDate) => {
    await delay(400);
    return {
        success: true,
        data: [] // Would contain historical records
    };
};

/**
 * Update single student attendance
 */
export const updateStudentAttendance = async (classId, studentId, status, date) => {
    await delay(200);
    return { success: true, message: 'Attendance updated' };
};

export default {
    getClasses,
    getStudentsByClass,
    getAttendanceMetadata,
    submitAttendance,
    getAttendanceHistory,
    updateStudentAttendance
};
