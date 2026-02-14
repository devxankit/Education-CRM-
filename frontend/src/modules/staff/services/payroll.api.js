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
 * Fetch payroll list with optional filters
 * @param {Object} params - { month, year, employeeType, status, financialYear }
 */
export const getPayrolls = async (params = {}) => {
    try {
        const qs = new URLSearchParams(params).toString();
        const url = `${API_URL}/payroll${qs ? `?${qs}` : ''}`;
        const response = await axios.get(url, getAuthHeaders());
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching payrolls:", error);
        return [];
    }
};

/**
 * Fetch single payroll by ID
 */
export const getPayroll = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/payroll/${id}`, getAuthHeaders());
        if (response.data.success) {
            return response.data.data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching payroll:", error);
        return null;
    }
};

/**
 * Get payroll resources (branches, teachers, staff, academic years, payroll rule)
 * @param {string} financialYear - Optional, filter payroll rule by financial year
 */
export const getPayrollResources = async (financialYear) => {
    try {
        const qs = financialYear ? `?financialYear=${encodeURIComponent(financialYear)}` : '';
        const response = await axios.get(`${API_URL}/staff/payroll/resources${qs}`, getAuthHeaders());
        if (response.data.success) {
            return response.data.data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching payroll resources:", error);
        return null;
    }
};

/**
 * Create new payroll entry
 */
export const createPayroll = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/payroll`, data, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error creating payroll:", error);
        throw error.response?.data || { success: false, message: error.message };
    }
};

/**
 * Fetch payroll rule for a financial year
 */
export const fetchPayrollRule = async (financialYear) => {
    try {
        const res = await getPayrollResources(financialYear);
        return res?.payrollRule || null;
    } catch (error) {
        console.error("Error fetching payroll rule:", error);
        return null;
    }
};

/**
 * Update payroll (e.g. mark as paid)
 */
export const updatePayroll = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/payroll/${id}`, data, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error updating payroll:", error);
        throw error.response?.data || { success: false, message: error.message };
    }
};

export default {
    getPayrolls,
    getPayroll,
    getPayrollResources,
    createPayroll,
    fetchPayrollRule,
    updatePayroll,
};
