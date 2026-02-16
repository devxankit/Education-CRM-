import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '@/app/api';

export const useExamPolicyStore = create((set, get) => ({
    policy: null,
    isFetching: false,
    isProcessing: false,

    fetchPolicy: async (academicYearId, branchId) => {
        if (!academicYearId) return;
        set({ isFetching: true });
        try {
            const token = localStorage.getItem('token');
            const params = { academicYearId };
            if (branchId) params.branchId = branchId;
            const response = await axios.get(`${API_URL}/exam-policy`, {
                params,
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                set({ policy: response.data.data });
            }
        } catch (error) {
            console.error('Error fetching exam policy:', error);
        } finally {
            set({ isFetching: false });
        }
    },

    savePolicy: async (policyData) => {
        set({ isProcessing: true });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/exam-policy`, policyData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                set({ policy: response.data.data });
                return { success: true, message: response.data.message };
            }
        } catch (error) {
            console.error('Error saving exam policy:', error);
            return { success: false, message: error.response?.data?.message || 'Failed to save policy' };
        } finally {
            set({ isProcessing: false });
        }
    },

    unlockPolicy: async (academicYearId, reason, branchId) => {
        set({ isProcessing: true });
        try {
            const token = localStorage.getItem('token');
            const payload = { academicYearId, reason };
            if (branchId) payload.branchId = branchId;
            const response = await axios.post(`${API_URL}/exam-policy/unlock`, payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                set({ policy: response.data.data });
                return { success: true };
            }
        } catch (error) {
            console.error('Error unlocking policy:', error);
            return { success: false, message: error.response?.data?.message || 'Failed to unlock policy' };
        } finally {
            set({ isProcessing: false });
        }
    },

    lockPolicy: async (academicYearId, branchId) => {
        set({ isProcessing: true });
        try {
            const token = localStorage.getItem('token');
            const payload = { academicYearId };
            if (branchId) payload.branchId = branchId;
            const response = await axios.post(`${API_URL}/exam-policy/lock`, payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                set({ policy: response.data.data });
                return { success: true };
            }
        } catch (error) {
            console.error('Error locking policy:', error);
            return { success: false, message: error.response?.data?.message || 'Failed to lock policy' };
        } finally {
            set({ isProcessing: false });
        }
    }
}));
