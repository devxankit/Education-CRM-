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

export const getAllTickets = async (branchId, academicYearId) => {
    try {
        const params = {};
        if (branchId) params.branchId = branchId;
        if (academicYearId) params.academicYearId = academicYearId;
        const response = await axios.get(`${API_URL}/support-ticket`, {
            ...getAuthHeaders(),
            params
        });
        if (response.data.success) {
            return (response.data.data || []).map(t => ({ ...t, _ticketType: 'student' }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching support tickets:", error);
        return [];
    }
};

export const getTeacherTickets = async (branchId, academicYearId) => {
    try {
        const params = {};
        if (branchId) params.branchId = branchId;
        if (academicYearId) params.academicYearId = academicYearId;
        const response = await axios.get(`${API_URL}/support-ticket/teacher-tickets`, {
            ...getAuthHeaders(),
            params
        });
        if (response.data.success) {
            return (response.data.data || []).map(t => ({ ...t, _ticketType: 'teacher', id: t._id }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching teacher tickets:", error);
        return [];
    }
};

export const createTicket = async (ticketData) => {
    try {
        const response = await axios.post(`${API_URL}/support-ticket`, ticketData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error creating support ticket:", error);
        throw error;
    }
};

export const updateTicketStatus = async (id, status) => {
    try {
        const response = await axios.put(`${API_URL}/support-ticket/${id}/status`, { status }, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error updating ticket status:", error);
        throw error;
    }
};

export const respondToTeacherTicket = async (id, responseText, status) => {
    try {
        const response = await axios.put(
            `${API_URL}/support-ticket/teacher/${id}/respond`,
            { response: responseText, status },
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error responding to teacher ticket:", error);
        throw error;
    }
};

export const respondToTicket = async (id, responseText, status) => {
    try {
        const response = await axios.put(`${API_URL}/support-ticket/${id}/respond`, {
            response: responseText,
            status
        }, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error responding to ticket:", error);
        throw error;
    }
};

export const deleteTicket = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/support-ticket/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error deleting ticket:", error);
        throw error;
    }
};