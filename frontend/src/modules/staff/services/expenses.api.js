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

export const getExpense = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/expense/${id}`, getAuthHeaders());
        if (response.data.success) return response.data.data;
        return null;
    } catch (error) {
        console.error("Error fetching expense:", error);
        return null;
    }
};

export const getExpenses = async (params = {}) => {
    try {
        const qs = new URLSearchParams(params).toString();
        const response = await axios.get(`${API_URL}/expense${qs ? `?${qs}` : ''}`, getAuthHeaders());
        if (response.data.success) return response.data.data;
        return [];
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return [];
    }
};

export const getExpenseResources = async () => {
    try {
        const response = await axios.get(`${API_URL}/staff/expenses/resources`, getAuthHeaders());
        if (response.data.success) return response.data.data;
        return null;
    } catch (error) {
        console.error("Error fetching expense resources:", error);
        return null;
    }
};

export const getExpenseCategories = async (branchId) => {
    try {
        const qs = branchId ? `?branchId=${branchId}` : '';
        const response = await axios.get(`${API_URL}/expense-category${qs}`, getAuthHeaders());
        if (response.data.success) return response.data.data;
        return [];
    } catch (error) {
        console.error("Error fetching expense categories:", error);
        return [];
    }
};

export const uploadInvoice = async (file, folder = 'expenses/invoices') => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        const response = await axios.post(`${API_URL}/upload/single`, formData, getAuthHeaders());
        if (response.data?.success && response.data?.url) {
            return response.data.url;
        }
        throw new Error(response.data?.message || 'Upload failed');
    } catch (error) {
        console.error('Error uploading invoice:', error);
        throw error.response?.data || { message: error.message };
    }
};

export const createExpense = async (data) => {
    try {
        const payload = {
            ...data,
            expenseDate: data.expenseDate || data.date || new Date().toISOString().split('T')[0],
        };
        const response = await axios.post(`${API_URL}/expense`, payload, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error creating expense:", error);
        throw error.response?.data || { success: false, message: error.message };
    }
};

export const updateExpense = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/expense/${id}`, data, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error updating expense:", error);
        throw error.response?.data || { success: false, message: error.message };
    }
};

export const deleteExpense = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/expense/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error deleting expense:", error);
        throw error.response?.data || { success: false, message: error.message };
    }
};
