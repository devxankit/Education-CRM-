import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { API_URL } from '@/app/api';

export const useStudentStore = create(
    persist(
        (set, get) => ({
            // State
            token: null,
            isAuthenticated: false,
            profile: null,
            dashboard: null,
            attendance: [],
            fees: null,
            exams: [],
            homeworkList: [],
            support: [],
            notifications: [],
            notices: [],
            academics: null,
            documents: [],
            notes: [],
            tickets: [],
            isLoading: false,
            error: null,

            // Actions
            login: async (admissionNo, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axios.post(`${API_URL}/student/login`, {
                        admissionNo,
                        password
                    });

                    if (response.data.success) {
                        const { token, data } = response.data;
                        localStorage.setItem('token', token);
                        localStorage.setItem('user', JSON.stringify(data));

                        // Also update useAppStore for ProtectedRoute compatibility
                        const { useAppStore } = await import('./index');
                        useAppStore.getState().login(data);

                        set({
                            token,
                            isAuthenticated: true,
                            profile: data,
                            isLoading: false
                        });
                        return true;
                    }
                } catch (error) {
                    const message = error.response?.data?.message || 'Login failed';
                    set({ error: message, isLoading: false });
                    return false;
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                set({
                    token: null,
                    isAuthenticated: false,
                    profile: null,
                    dashboard: null
                });
            },

            fetchDashboardData: async () => {
                if (get().isLoading) return;
                set({ isLoading: true });
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/student/dashboard`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ dashboard: response.data.data, isLoading: false });
                    }
                } catch (error) {
                    console.error('Error fetching dashboard data:', error);
                    set({ isLoading: false });
                }
            },

            fetchProfile: async () => {
                set({ isLoading: true });
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/student/profile`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ profile: response.data.data, isLoading: false });
                    }
                } catch (error) {
                    console.error('Error fetching student profile:', error);
                    set({ isLoading: false });
                }
            },

            fetchAcademics: async () => {
                set({ isLoading: true });
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/student/academics`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ academics: response.data.data, isLoading: false });
                    }
                } catch (error) {
                    console.error('Error fetching student academics:', error);
                    set({ isLoading: false });
                }
            },

            updateProfile: (data) => set((state) => ({
                profile: { ...state.profile, ...data }
            })),

            addTicket: (ticket) => set((state) => ({
                tickets: [{ ...ticket, id: `ST-TKT-${Date.now()}`, status: 'Open', date: new Date().toISOString() }, ...state.tickets]
            })),

            submitHomework: (id) => set((state) => ({
                homeworkList: state.homeworkList.map(hw =>
                    hw.id === id ? { ...hw, status: 'Submitted' } : hw
                )
            })),

            payFee: (amount) => set((state) => ({
                fees: {
                    ...state.fees,
                    paid: (state.fees?.paid || 0) + amount,
                    pending: (state.fees?.pending || 0) - amount
                }
            })),

            markAsRead: (id) => set((state) => ({
                notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
            })),

            fetchNotifications: () => {
                // To be implemented with backend
            },

            acknowledgeNotice: (id) => set((state) => ({
                notices: state.notices.map(n => n.id === id ? { ...n, read: true } : n)
            })),

            submitCorrection: (correction) => set((state) => ({
                tickets: [{ ...correction, id: `CORR-${Date.now()}`, type: 'Correction', status: 'Pending', date: new Date().toISOString() }, ...state.tickets]
            }))
        }),
        {
            name: 'student-storage',
            partialize: (state) => ({
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                profile: state.profile
            }),
        }
    )
);
