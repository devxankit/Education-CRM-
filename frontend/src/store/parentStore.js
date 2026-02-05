import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { API_URL } from '../app/api';

export const useParentStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            token: null,
            children: [],
            selectedChildId: null,
            isAuthenticated: false,

            // Data
            notices: [],
            fees: null,
            attendance: [],
            homework: [],
            homeworkDetails: null,
            teachers: [],
            documents: [],
            exams: [],
            results: null,
            tickets: [],

            // Actions
            login: async (mobile, password) => {
                try {
                    const response = await axios.post(`${API_URL}/parent/login`, { mobile, password });
                    if (response.data.success) {
                        const { data, token } = response.data;
                        localStorage.setItem('token', token);
                        set({
                            user: data,
                            token,
                            isAuthenticated: true
                        });
                        return { success: true };
                    }
                } catch (error) {
                    console.error('Parent Login Error:', error);
                    return {
                        success: false,
                        message: error.response?.data?.message || 'Login failed'
                    };
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    children: [],
                    selectedChildId: null
                });
            },

            fetchChildren: async () => {
                const { user } = get();
                if (!user) return;
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/parent/${user._id}/linked-students`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        const children = response.data.data;
                        set({
                            children,
                            selectedChildId: get().selectedChildId || children[0]?._id
                        });
                    }
                } catch (error) {
                    console.error('Error fetching children:', error);
                }
            },

            fetchDashboardData: async () => {
                const { user } = get();
                if (!user) return;
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/parent/portal/dashboard`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        const { children } = response.data.data;
                        set({
                            children,
                            selectedChildId: get().selectedChildId || children[0]?.id || children[0]?._id
                        });
                    }
                } catch (error) {
                    console.error('Error fetching dashboard data:', error);
                }
            },

            setSelectedChild: (id) => set({ selectedChildId: id }),

            // ... (Rest of actions will be implemented as APIs are integrated)
        }),
        {
            name: 'parent-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                selectedChildId: state.selectedChildId
            }),
        }
    )
);
