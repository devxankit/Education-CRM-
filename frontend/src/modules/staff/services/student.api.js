// student.api.js - Staff Module Student API Service
// This service will be used for backend integration

// Mock data for initial setup (will be replaced with actual API calls)
const MOCK_STUDENTS = [
    { id: 'STU-2024-001', name: 'Aarav Gupta', class: 'X-A', status: 'Active', contact: '9876543210', feeStatus: 'Paid', route: 'Route-A', docsStatus: 'Verified' },
    { id: 'STU-2024-002', name: 'Ishita Sharma', class: 'X-A', status: 'Active', contact: '9876543211', feeStatus: 'Due', route: 'Route-B', docsStatus: 'Pending' },
    { id: 'STU-2024-003', name: 'Rohan Mehta', class: 'IX-B', status: 'Inactive', contact: '9876543212', feeStatus: 'Overdue', route: 'Unassigned', docsStatus: 'Missing' },
];

/**
 * Fetch all students
 * @returns {Promise<Array>} List of students
 */
export const fetchStudents = async () => {
    // TODO: Replace with actual API call
    // return await fetch('/api/staff/students').then(res => res.json());
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_STUDENTS), 300);
    });
};

/**
 * Fetch student by ID
 * @param {string} studentId - Student ID
 * @returns {Promise<Object|null>} Student object or null
 */
export const fetchStudentById = async (studentId) => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/staff/students/${studentId}`).then(res => res.json());
    return new Promise((resolve) => {
        setTimeout(() => {
            const student = MOCK_STUDENTS.find(s => s.id === studentId);
            resolve(student || null);
        }, 300);
    });
};

/**
 * Search students
 * @param {string} query - Search query
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Filtered list of students
 */
export const searchStudents = async (query, filters = {}) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            let results = MOCK_STUDENTS;

            if (query) {
                const lowerQuery = query.toLowerCase();
                results = results.filter(s =>
                    s.name.toLowerCase().includes(lowerQuery) ||
                    s.id.toLowerCase().includes(lowerQuery)
                );
            }

            if (filters.class) {
                results = results.filter(s => s.class === filters.class);
            }

            if (filters.status) {
                results = results.filter(s => s.status === filters.status);
            }

            resolve(results);
        }, 300);
    });
};

export default {
    fetchStudents,
    fetchStudentById,
    searchStudents,
};