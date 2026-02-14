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

export const getDashboardStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/staff/dashboard`, getAuthHeaders());
        if (response.data.success) {
            return response.data.data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return null;
    }
};

export const getStaffReports = async (dateRange = 'This Month') => {
    try {
        const response = await axios.get(`${API_URL}/staff/reports`, {
            ...getAuthHeaders(),
            params: { dateRange }
        });
        if (response.data.success) return response.data.data;
        return null;
    } catch (error) {
        console.error("Error fetching reports:", error);
        return null;
    }
};
