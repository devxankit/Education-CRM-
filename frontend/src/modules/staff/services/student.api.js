
import axios from 'axios';
import { API_URL } from '@/app/api';

const getAuthHeaders = () => {
    // 1. Prioritize Staff Token
    try {
        const staffUser = JSON.parse(localStorage.getItem('staff_user') || 'null');
        if (staffUser && staffUser.token) {
            return { headers: { 'Authorization': `Bearer ${staffUser.token}` } };
        }
    } catch (e) {
        console.error("Error parsing staff_user for token", e);
    }

    // 2. Fallback to global token
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

// Get All Students
export const getAllStudents = async () => {
    try {
        const response = await axios.get(`${API_URL}/student`, getAuthHeaders());
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching students:", error);
        return [];
    }
};

// Get Student By ID
export const getStudentById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/student/${id}`, getAuthHeaders());
        if (response.data.success) {
            return response.data.data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching student details:", error);
        return null;
    }
};

// Admit New Student
export const admitStudent = async (studentData) => {
    try {
        const response = await axios.post(`${API_URL}/student/admit`, studentData, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Confirm Admission (workflow policy - docs, fee, approval)
export const confirmAdmission = async (id) => {
    try {
        const response = await axios.post(`${API_URL}/student/${id}/confirm`, {}, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update Student
export const updateStudentInfo = async (id, studentData) => {
    try {
        const response = await axios.put(`${API_URL}/student/${id}`, studentData, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};