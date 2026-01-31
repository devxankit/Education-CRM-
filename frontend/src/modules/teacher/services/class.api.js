/**
 * Class API Service for Teacher Module
 * Provides methods to interact with class data
 */

// Simulates API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock class data
const classesData = [
    { id: 'CLS-10A', name: 'Class 10-A', subject: 'Mathematics', students: 42, schedule: 'Mon, Wed, Fri - 9:00 AM' },
    { id: 'CLS-10B', name: 'Class 10-B', subject: 'Mathematics', students: 40, schedule: 'Tue, Thu - 10:00 AM' },
    { id: 'CLS-9B', name: 'Class 9-B', subject: 'Physics', students: 38, schedule: 'Mon, Wed - 11:00 AM' },
    { id: 'CLS-11A', name: 'Class 11-A', subject: 'Science', students: 35, schedule: 'Tue, Thu, Sat - 9:00 AM' }
];

/**
 * Get all assigned classes
 */
export const getAssignedClasses = async () => {
    await delay(300);
    return { success: true, data: classesData };
};

/**
 * Get class by ID
 */
export const getClassById = async (classId) => {
    await delay(200);
    const cls = classesData.find(c => c.id === classId);
    if (!cls) {
        return { success: false, error: 'Class not found' };
    }
    return { success: true, data: cls };
};

/**
 * Get students in a class
 */
export const getClassStudents = async (classId) => {
    await delay(300);
    // Returns mock students
    return {
        success: true,
        data: [
            { id: 'ST-001', roll: 1, name: 'Aarav Patel', status: 'Active' },
            { id: 'ST-002', roll: 2, name: 'Aditi Sharma', status: 'Active' },
            { id: 'ST-003', roll: 3, name: 'Arjun Singh', status: 'Active' }
        ]
    };
};

/**
 * Get class schedule
 */
export const getClassSchedule = async (classId) => {
    await delay(200);
    return {
        success: true,
        data: {
            classId,
            periods: [
                { day: 'Monday', time: '9:00 AM', duration: 45 },
                { day: 'Wednesday', time: '9:00 AM', duration: 45 },
                { day: 'Friday', time: '9:00 AM', duration: 45 }
            ]
        }
    };
};

export default {
    getAssignedClasses,
    getClassById,
    getClassStudents,
    getClassSchedule
};
