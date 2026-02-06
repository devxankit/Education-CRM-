
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
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

export const getAllClasses = async (branchId = 'main') => {
    try {
        const response = await axios.get(`${API_URL}/class?branchId=${branchId}`, getAuthHeaders());
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching classes:", error);
        return [];
    }
};

export const getSections = async (classId) => {
    try {
        const response = await axios.get(`${API_URL}/class/section/${classId}`, getAuthHeaders());
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching sections:", error);
        return [];
    }
};
