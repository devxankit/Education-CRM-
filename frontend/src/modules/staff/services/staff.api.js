// staff.api.js - Staff Module Staff/Employee API Service
// This service will be used for backend integration

// Mock data for initial setup (will be replaced with actual API calls)
const MOCK_EMPLOYEES = [
    { id: 'EMP-2024-001', name: 'Ramesh Singh', designation: 'Driver', department: 'Transport', status: 'Active', phone: '9876543210' },
    { id: 'EMP-2024-002', name: 'Sunil Yadav', designation: 'Helper', department: 'Transport', status: 'Active', phone: '9876543220' },
    { id: 'EMP-2024-003', name: 'Meera Devi', designation: 'Sweeper', department: 'Maintenance', status: 'Active', phone: '9876543230' },
];

const MOCK_TEACHERS = [
    { id: 'TCH-2024-001', name: 'Suresh Kumar', subject: 'Mathematics', status: 'Active', phone: '9876543210' },
    { id: 'TCH-2024-002', name: 'Priya Sharma', subject: 'English', status: 'Active', phone: '9876543211' },
];

/**
 * Fetch all employees
 * @returns {Promise<Array>} List of employees
 */
export const fetchEmployees = async () => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_EMPLOYEES), 300);
    });
};

/**
 * Fetch employee by ID
 * @param {string} employeeId - Employee ID
 * @returns {Promise<Object|null>} Employee object or null
 */
export const fetchEmployeeById = async (employeeId) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const employee = MOCK_EMPLOYEES.find(e => e.id === employeeId);
            resolve(employee || null);
        }, 300);
    });
};

/**
 * Fetch all teachers
 * @returns {Promise<Array>} List of teachers
 */
export const fetchTeachers = async () => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_TEACHERS), 300);
    });
};

/**
 * Fetch teacher by ID
 * @param {string} teacherId - Teacher ID
 * @returns {Promise<Object|null>} Teacher object or null
 */
export const fetchTeacherById = async (teacherId) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const teacher = MOCK_TEACHERS.find(t => t.id === teacherId);
            resolve(teacher || null);
        }, 300);
    });
};

export default {
    fetchEmployees,
    fetchEmployeeById,
    fetchTeachers,
    fetchTeacherById,
};