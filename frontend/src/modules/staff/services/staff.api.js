import axios from 'axios';
import { API_URL } from '@/app/api';

const getAuthHeaders = () => {
    try {
        const staffUser = JSON.parse(localStorage.getItem('staff_user') || 'null');
        if (staffUser && staffUser.token) {
            return { headers: { 'Authorization': `Bearer ${staffUser.token}` } };
        }
    } catch (e) {
        console.error("Error parsing staff_user for token", e);
    }
    return { headers: {} };
};

/**
 * Fetch staff profile
 * @returns {Promise<Object|null>} Staff profile object or null
 */
export const getStaffProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/staff/profile`, getAuthHeaders());
        if (response.data.success) {
            return response.data.data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching staff profile:", error);
        return null;
    }
};

/**
 * Change staff password
 * @param {Object} passwords - {currentPassword, newPassword}
 * @returns {Promise<Object>} Response object
 */
export const changePassword = async (passwords) => {
    try {
        const response = await axios.post(`${API_URL}/staff/change-password`, passwords, getAuthHeaders());
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Network error" };
    }
};

/**
 * Update staff profile (profilePic, bannerPic, name, phone)
 * @param {Object} profileData - {profilePic?, bannerPic?, name?, phone?}
 * @returns {Promise<Object>} Response object
 */
export const updateStaffProfile = async (profileData) => {
    try {
        const response = await axios.put(`${API_URL}/staff/update-profile`, profileData, getAuthHeaders());
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Network error" };
    }
};

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
    try {
        const response = await axios.get(`${API_URL}/teacher`, getAuthHeaders());
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching teachers:", error);
        return [];
    }
};

/**
 * Fetch teacher by ID
 * @param {string} teacherId - Teacher ID
 * @returns {Promise<Object|null>} Teacher object or null
 */
export const fetchTeacherById = async (teacherId) => {
    try {
        const response = await axios.get(`${API_URL}/teacher/${teacherId}`, getAuthHeaders());
        if (response.data.success) {
            return response.data.data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching teacher by ID:", error);
        return null;
    }
};

/**
 * Create a new teacher
 * @param {Object} teacherData - Teacher details
 * @returns {Promise<Object>} Response object
 */
export const createTeacher = async (teacherData) => {
    try {
        const response = await axios.post(`${API_URL}/teacher`, teacherData, getAuthHeaders());
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Network error" };
    }
};

/**
 * Update a teacher
 * @param {string} id - Teacher ID
 * @param {Object} teacherData - Updated details
 * @returns {Promise<Object>} Response object
 */
export const updateTeacher = async (id, teacherData) => {
    try {
        const response = await axios.put(`${API_URL}/teacher/${id}`, teacherData, getAuthHeaders());
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Network error" };
    }
};

/**
 * Delete a teacher
 * @param {string} id - Teacher ID
 * @returns {Promise<Object>} Response object
 */
export const deleteTeacher = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/teacher/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Network error" };
    }
};

export default {
    fetchEmployees,
    fetchEmployeeById,
    fetchTeachers,
    fetchTeacherById,
    getStaffProfile,
    changePassword,
    updateStaffProfile
};