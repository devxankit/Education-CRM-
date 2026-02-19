import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../app/api';

export const useAdminExamStore = create((set, get) => ({
    exams: [],
    isFetching: false,
    isProcessing: false,

    fetchExams: async (filters = {}) => {
        set({ isFetching: true });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/exam`, {
                params: filters,
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                set({ exams: response.data.data });
            }
        } catch (error) {
            console.error('Error fetching exams:', error);
        } finally {
            set({ isFetching: false });
        }
    },

    createExam: async (examData) => {
        set({ isProcessing: true });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/exam`, examData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                await get().fetchExams();
                return { success: true };
            }
        } catch (error) {
            console.error('Error creating exam:', error);
            return { success: false, message: error.response?.data?.message || 'Failed to create exam' };
        } finally {
            set({ isProcessing: false });
        }
    },

    updateExam: async (id, examData) => {
        set({ isProcessing: true });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/exam/${id}`, examData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                await get().fetchExams();
                return { success: true };
            }
        } catch (error) {
            console.error('Error updating exam:', error);
            return { success: false, message: error.response?.data?.message || 'Failed to update exam' };
        } finally {
            set({ isProcessing: false });
        }
    },

    deleteExam: async (id) => {
        set({ isProcessing: true });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_URL}/exam/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                set(state => ({
                    exams: state.exams.filter(e => e._id !== id)
                }));
                return { success: true };
            }
        } catch (error) {
            console.error('Error deleting exam:', error);
            return { success: false, message: 'Failed to delete exam' };
        } finally {
            set({ isProcessing: false });
        }
    },

    getExamById: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/exam/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                return response.data.data;
            }
        } catch (error) {
            console.error('Error fetching exam details:', error);
            return null;
        }
    }
}));
