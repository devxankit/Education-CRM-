import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { API_URL } from '@/app/api';

export const useStudentStore = create(
    persist(
        (set, get) => ({
            // State (Initialize from localStorage to prevent flash of unauthenticated)
            token: (() => {
                try {
                    const stored = localStorage.getItem('student-storage');
                    if (stored) return JSON.parse(stored)?.state?.token || null;
                    return localStorage.getItem('token') || null;
                } catch (e) { return localStorage.getItem('token') || null; }
            })(),
            isAuthenticated: (() => {
                try {
                    const stored = localStorage.getItem('student-storage');
                    const hasPersistedToken = stored ? !!JSON.parse(stored)?.state?.token : false;
                    return hasPersistedToken || !!localStorage.getItem('token');
                } catch (e) { return !!localStorage.getItem('token'); }
            })(),
            profile: (() => {
                try {
                    const stored = localStorage.getItem('student-storage');
                    if (stored) return JSON.parse(stored)?.state?.profile || null;
                    const user = localStorage.getItem('user');
                    return user ? JSON.parse(user) : null;
                } catch (e) {
                    try {
                        const user = localStorage.getItem('user');
                        return user ? JSON.parse(user) : null;
                    } catch { return null; }
                }
            })(),
            dashboard: null,
            attendance: [],
            fees: null,
            exams: [],
            results: [],
            homeworkList: [],
            support: {
                tickets: [],
                faq: [],
                categories: []
            },
            notifications: [],
            notices: [],
            academics: null,
            documents: [],
            notes: [],
            tickets: [],
            isLoading: false,
            error: null,

            // Actions
            login: async (identifier, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axios.post(`${API_URL}/student/login`, {
                        identifier,
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
                    dashboard: null,
                    attendance: [],
                    fees: null,
                    exams: [],
                    results: [],
                    homeworkList: [],
                    support: {
                        tickets: [],
                        faq: [],
                        categories: []
                    },
                    notifications: [],
                    notices: [],
                    academics: null,
                    documents: [],
                    notes: [],
                    tickets: [],
                    isLoading: false,
                    error: null
                });
            },

            fetchDashboardData: async () => {
                if (get().isLoading) return;
                set({ isLoading: true });
                try {
                    const token = get().token;
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
                    const token = get().token;
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
                    const token = get().token;
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

            fetchHomework: async () => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/student/homework`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ homeworkList: response.data.data, isLoading: false });
                    }
                } catch (error) {
                    console.error('Error fetching homework:', error);
                    set({ isLoading: false });
                }
            },

            submitHomework: async (homeworkData) => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.post(`${API_URL}/student/homework/submit`, homeworkData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        await get().fetchHomework(); // Refresh list
                        set({ isLoading: false });
                        return true;
                    }
                } catch (error) {
                    console.error('Error submitting homework:', error);
                    set({ isLoading: false });
                    return false;
                }
            },

            fetchAttendance: async (startDate, endDate) => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/student/attendance`, {
                        params: { startDate, endDate },
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        const rawData = response.data.data;

                        // Transform raw records into stats
                        const total = rawData.length;
                        const present = rawData.filter(r => r.status === 'Present').length;
                        const late = rawData.filter(r => r.status === 'Late').length;
                        const halfDay = rawData.filter(r => r.status === 'Half-Day').length;
                        const absent = rawData.filter(r => r.status === 'Absent').length;

                        const percentage = total > 0
                            ? ((present + late + halfDay * 0.5) / total) * 100
                            : 0;

                        // Mock subject-wise (since backend returns general attendance for now)
                        // In a real scenario, attendance model might include subjectId
                        const mockSubjects = [
                            { name: 'Physics', percentage: percentage, attended: present, total: total, color: '#6366f1' },
                            { name: 'Chemistry', percentage: percentage, attended: present, total: total, color: '#a855f7' },
                            { name: 'Mathematics', percentage: percentage, attended: present, total: total, color: '#ec4899' }
                        ];

                        const structuredData = {
                            overall: {
                                percentage: Math.round(percentage),
                                totalClasses: total,
                                present: present + late + halfDay,
                                absent: absent,
                                trend: '+2%'
                            },
                            eligibility: {
                                status: percentage >= 75 ? 'Eligible' : (percentage >= 70 ? 'Warning' : 'At Risk'),
                                required: 75,
                                current: Math.round(percentage),
                                message: percentage >= 75 ? "You're doing great! Keep it up." : "Try to attend more classes."
                            },
                            subjects: mockSubjects,
                            monthlyLog: [
                                { month: 'Current', present: present, total: total }
                            ],
                            history: rawData.map(r => ({
                                id: r._id,
                                date: new Date(r.date).toLocaleDateString(),
                                day: new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' }),
                                status: r.status,
                                time: "09:00 AM", // Placeholder
                                type: "Lecture"
                            }))
                        };

                        set({ attendance: structuredData, isLoading: false });
                    }
                } catch (error) {
                    console.error('Error fetching attendance:', error);
                    set({ isLoading: false });
                }
            },

            fetchFees: async () => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/student/fees`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ fees: response.data.data, isLoading: false });
                    }
                } catch (error) {
                    console.error('Error fetching fees:', error);
                    set({ isLoading: false });
                }
            },

            fetchExams: async () => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/student/exams`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ exams: response.data.data, isLoading: false });
                    }
                } catch (error) {
                    console.error('Error fetching exams:', error);
                    set({ isLoading: false });
                }
            },

            fetchResults: async () => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/student/results`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ results: response.data.data, isLoading: false });
                    }
                } catch (error) {
                    console.error('Error fetching results:', error);
                    set({ isLoading: false });
                }
            },

            fetchNotices: async () => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/student/notices`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ notices: response.data.data, isLoading: false });
                    }
                } catch (error) {
                    console.error('Error fetching notices:', error);
                    set({ isLoading: false });
                }
            },

            fetchNotifications: async () => {
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/student/notifications`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success && Array.isArray(response.data.data)) {
                        set({ notifications: response.data.data });
                    } else if (response.data?.data) {
                        set({ notifications: Array.isArray(response.data.data) ? response.data.data : [] });
                    }
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                    set({ notifications: [] });
                }
            },

            fetchLearningMaterials: async (filters = {}) => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/student/learning-materials`, {
                        params: filters,
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ notes: response.data.data, isLoading: false });
                    }
                } catch (error) {
                    console.error('Error fetching learning materials:', error);
                    set({ isLoading: false });
                }
            },

            fetchTickets: async () => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/student/tickets`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ tickets: response.data.data, isLoading: false });
                    }
                } catch (error) {
                    console.error('Error fetching tickets:', error);
                    set({ isLoading: false });
                }
            },

            addTicket: async (ticketData) => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const headers = { 'Authorization': `Bearer ${token}` };
                    let attachmentUrl = null;
                    if (ticketData.file && typeof File !== 'undefined' && ticketData.file instanceof File) {
                        const formData = new FormData();
                        formData.append('file', ticketData.file);
                        formData.append('folder', 'support_tickets');
                        const uploadRes = await axios.post(`${API_URL}/upload/single`, formData, { headers });
                        if (uploadRes.data?.success && uploadRes.data?.url) attachmentUrl = uploadRes.data.url;
                        const { file, ...rest } = ticketData;
                        ticketData = { ...rest, ...(attachmentUrl && { attachment: attachmentUrl }) };
                    }
                    const response = await axios.post(`${API_URL}/student/tickets`, ticketData, { headers });
                    if (response.data.success) {
                        await get().fetchTickets(); // Refresh
                        set({ isLoading: false });
                        return true;
                    }
                } catch (error) {
                    console.error('Error creating ticket:', error);
                    set({ isLoading: false });
                    return false;
                }
            },

            updateProfile: async (formData) => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.put(`${API_URL}/student/profile`, formData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ profile: response.data.data, isLoading: false });
                        return true;
                    }
                    set({ isLoading: false });
                    return false;
                } catch (error) {
                    console.error('Error updating profile:', error);
                    set({ isLoading: false });
                    return false;
                }
            },

            markAsRead: (id) => set((state) => ({
                notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
            })),

            acknowledgeNotice: async (id) => {
                try {
                    const token = get().token;
                    const response = await axios.put(`${API_URL}/student/notices/${id}/acknowledge`, {}, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            notices: state.notices.map(n => n._id === id ? { ...n, acknowledged: true } : n)
                        }));
                        return true;
                    }
                } catch (error) {
                    console.error('Error acknowledging notice:', error);
                    return false;
                }
            },

            submitCorrection: async (correction) => {
                return await get().addTicket({
                    category: 'Correction',
                    topic: `Profile Correction: ${correction.field}`,
                    details: `Current Value: ${correction.currentValue}\nNew Value: ${correction.newValue}\nReason: ${correction.reason}`,
                    priority: 'Normal'
                });
            }
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
