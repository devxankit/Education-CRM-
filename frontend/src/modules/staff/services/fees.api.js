// fees.api.js - Staff Module Fees API Service
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
    const token = localStorage.getItem('token');
    return { headers: { 'Authorization': `Bearer ${token}` } };
};

/**
 * Fetch fee overview - all students with paid/due status
 * @returns {Promise<Object>} { students, summary }
 */
export const getFeeOverview = async () => {
    try {
        const response = await axios.get(`${API_URL}/staff/fees/overview`, getAuthHeaders());
        if (response.data.success) {
            return response.data.data;
        }
        return { students: [], summary: {} };
    } catch (error) {
        console.error("Error fetching fee overview:", error);
        return { students: [], summary: {} };
    }
};

/**
 * Fetch fee record by student ID (from overview or single student)
 * @param {string} studentId - Student ID
 * @returns {Promise<Object|null>} Fee record or null
 */
export const fetchFeeByStudentId = async (studentId) => {
    try {
        const { students } = await getFeeOverview();
        return students.find(s => (s._id || s.id) === studentId) || null;
    } catch (error) {
        console.error("Error fetching fee by student:", error);
        return null;
    }
};

/**
 * Record fee collection (offline - no payment gateway)
 * @param {Object} params - { studentId, feeStructureId, amount, paymentMethod }
 */
export const collectFee = async ({ studentId, feeStructureId, amount, paymentMethod = 'Cash', remarks = '' }) => {
    try {
        const response = await axios.post(
            `${API_URL}/staff/fees/collect`,
            { studentId, feeStructureId, amount, paymentMethod, remarks },
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error recording fee collection:", error);
        throw error.response?.data || { success: false, message: error.message };
    }
};

export default {
    getFeeOverview,
    fetchFeeByStudentId,
    collectFee,
};
