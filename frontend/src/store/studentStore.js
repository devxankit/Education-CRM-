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
            examsError: null,
            results: [],
            resultsError: null,
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
            myNotes: [],
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

            requestPasswordReset: async (identifier) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axios.post(`${API_URL}/student/forgot-password`, { identifier: identifier?.trim() });
                    set({ isLoading: false });
                    return { success: response.data.success, message: response.data.message, email: response.data.email };
                } catch (error) {
                    const message = error.response?.data?.message || 'Failed to send OTP';
                    set({ error: message, isLoading: false });
                    return { success: false, message };
                }
            },

            verifyForgotOtp: async (identifier, otp) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axios.post(`${API_URL}/student/verify-forgot-otp`, {
                        identifier: identifier?.trim(),
                        otp: String(otp).trim()
                    });
                    set({ isLoading: false });
                    if (response.data.success) return { success: true, message: response.data.message };
                    return { success: false, message: response.data.message || 'Invalid OTP' };
                } catch (error) {
                    const message = error.response?.data?.message || 'Invalid or expired OTP';
                    set({ error: message, isLoading: false });
                    return { success: false, message };
                }
            },

            resetPasswordWithOtp: async (identifier, otp, newPassword) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await axios.post(`${API_URL}/student/reset-password`, {
                        identifier: identifier?.trim(),
                        otp: String(otp).trim(),
                        newPassword
                    });
                    set({ isLoading: false });
                    return { success: response.data.success, message: response.data.message };
                } catch (error) {
                    const message = error.response?.data?.message || 'Failed to reset password';
                    set({ error: message, isLoading: false });
                    return { success: false, message };
                }
            },

            clearError: () => set({ error: null }),

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
                    myNotes: [],
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
                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                    });
                    if (response.data?.success) {
                        await get().fetchHomework(); // Refresh list
                        set({ isLoading: false });
                        return { success: true };
                    }
                    set({ isLoading: false });
                    return { success: false, message: response.data?.message || 'Submission failed' };
                } catch (error) {
                    console.error('Error submitting homework:', error);
                    const message = error.response?.data?.message || error.message || 'Failed to submit homework';
                    set({ isLoading: false });
                    return { success: false, message };
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

                        // DAY-WISE: One attendance mark per day = present for all classes
                        // Group by date; if any record for a day is Present/Late/Half-Day → day = Present
                        const dayMap = {};
                        rawData.forEach(r => {
                            const d = r.date ? new Date(r.date) : null;
                            if (!d || isNaN(d.getTime())) return;
                            const key = d.toISOString().split('T')[0];
                            if (!dayMap[key]) {
                                dayMap[key] = { date: d, status: r.status, markedBy: r.markedBy, id: r._id };
                            } else {
                                const curr = dayMap[key];
                                const priority = { Present: 3, Late: 2, 'Half-Day': 1, Absent: 0, Leave: -1 };
                                if ((priority[r.status] ?? -2) > (priority[curr.status] ?? -2)) {
                                    dayMap[key] = { ...dayMap[key], status: r.status, markedBy: r.markedBy, id: r._id };
                                }
                            }
                        });
                        const dayWiseList = Object.values(dayMap).sort((a, b) => new Date(b.date) - new Date(a.date));
                        const totalDays = dayWiseList.length;
                        const presentDays = dayWiseList.filter(d => ['Present', 'Late', 'Half-Day'].includes(d.status)).length;
                        const absentDays = dayWiseList.filter(d => d.status === 'Absent').length;
                        const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

                        // Subject breakdown (optional, from raw for reference)
                        const subjectData = {};
                        rawData.forEach(record => {
                            const subName = record.subjectName || "General";
                            if (!subjectData[subName]) {
                                subjectData[subName] = { present: 0, total: 0, teacher: record.markedBy || "TBA" };
                            }
                            subjectData[subName].total += 1;
                            if (['Present', 'Late', 'Half-Day'].includes(record.status)) {
                                const weight = record.status === 'Half-Day' ? 0.5 : 1;
                                subjectData[subName].present += weight;
                            }
                        });
                        const subjectColors = ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#10b981', '#06b6d4'];
                        const subjects = Object.entries(subjectData).map(([name, stats], idx) => ({
                            name,
                            teacher: stats.teacher,
                            present: stats.present,
                            total: stats.total,
                            percentage: Math.round((stats.present / stats.total) * 100),
                            color: subjectColors[idx % subjectColors.length],
                            riskLevel: Math.round((stats.present / stats.total) * 100) < 70 ? 'high' : 'normal'
                        }));

                        const reqPct = 75;
                        const isEligible = percentage >= reqPct;
                        let latestDate = new Date();
                        if (dayWiseList.length > 0) {
                            const valid = dayWiseList.map(d => new Date(d.date)).filter(d => !isNaN(d.getTime()));
                            if (valid.length > 0) latestDate = new Date(Math.max(...valid.map(d => d.getTime())));
                        }

                        const structuredData = {
                            overall: {
                                percentage: Math.round(percentage),
                                totalClasses: totalDays,
                                total: totalDays,
                                present: presentDays,
                                absent: absentDays,
                                trend: '+0%',
                                status: percentage >= 75 ? 'Eligible' : (percentage >= 70 ? 'Warning' : 'At Risk'),
                                lastUpdated: latestDate
                            },
                            eligibility: {
                                status: percentage >= 75 ? 'Eligible' : (percentage >= 70 ? 'Warning' : 'At Risk'),
                                isEligible,
                                required: 75,
                                requiredPercentage: reqPct,
                                current: Math.round(percentage),
                                message: percentage >= 75 ? "You're doing great! Keep it up." : "Try to attend more classes.",
                                classesNeeded: !isEligible && totalDays > 0
                                    ? Math.max(0, Math.ceil((reqPct / 100) * totalDays - presentDays))
                                    : 0
                            },
                            subjects,
                            monthlyLog: dayWiseList.map(d => ({ date: d.date, status: d.status, _id: d.id })),
                            history: dayWiseList.map(d => {
                                const dt = new Date(d.date);
                                return {
                                    id: d.id,
                                    date: dt,
                                    dateStr: dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                                    day: dt.toLocaleDateString('en-US', { weekday: 'long' }),
                                    status: d.status,
                                    subject: 'All Classes',
                                    markedBy: d.markedBy,
                                    type: 'Day'
                                };
                            })
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
                set({ examsError: null });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/student/exams`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ exams: Array.isArray(response.data.data) ? response.data.data : [], examsError: null });
                    }
                    return { success: true };
                } catch (error) {
                    console.error('Error fetching exams:', error);
                    const msg = error.response?.data?.message || error.message || 'Failed to load exams';
                    set({ exams: [], examsError: msg });
                    return { success: false, message: msg };
                }
            },

            fetchResults: async () => {
                set({ resultsError: null });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/student/results`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ results: Array.isArray(response.data.data) ? response.data.data : [], resultsError: null });
                    }
                    return { success: true };
                } catch (error) {
                    console.error('Error fetching results:', error);
                    const msg = error.response?.data?.message || error.message || 'Failed to load results';
                    set({ results: [], resultsError: msg });
                    return { success: false, message: msg };
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

            fetchMyNotes: async () => {
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/student/notes/my`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ myNotes: response.data.data || [] });
                        return response.data.data || [];
                    }
                } catch (error) {
                    console.error('Error fetching my notes:', error);
                    return [];
                }
            },

            addMyNote: async ({ title, content, subject }) => {
                try {
                    const token = get().token;
                    const response = await axios.post(
                        `${API_URL}/student/notes/my`,
                        { title, content: content || '', subject: subject || 'General' },
                        { headers: { 'Authorization': `Bearer ${token}` } }
                    );
                    if (response.data.success) {
                        set(state => ({ myNotes: [response.data.data, ...state.myNotes] }));
                        return { success: true, data: response.data.data };
                    }
                    return { success: false };
                } catch (error) {
                    const msg = error.response?.data?.message || error.message || 'Failed to add note';
                    return { success: false, message: msg };
                }
            },

            updateMyNote: async (id, { title, content, subject }) => {
                try {
                    const token = get().token;
                    const response = await axios.put(
                        `${API_URL}/student/notes/my/${id}`,
                        { title, content, subject },
                        { headers: { 'Authorization': `Bearer ${token}` } }
                    );
                    if (response.data.success) {
                        set(state => ({ myNotes: state.myNotes.map(n => n._id === id ? response.data.data : n) }));
                        return { success: true, data: response.data.data };
                    }
                    return { success: false };
                } catch (error) {
                    const msg = error.response?.data?.message || error.message || 'Failed to update note';
                    return { success: false, message: msg };
                }
            },

            deleteMyNote: async (id) => {
                try {
                    const token = get().token;
                    const response = await axios.delete(`${API_URL}/student/notes/my/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set(state => ({ myNotes: state.myNotes.filter(n => n._id !== id) }));
                        return { success: true };
                    }
                    return { success: false };
                } catch (error) {
                    const msg = error.response?.data?.message || error.message || 'Failed to delete note';
                    return { success: false, message: msg };
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
                    if (!token) {
                        set({ isLoading: false });
                        return { success: false, message: 'Not logged in' };
                    }
                    const response = await axios.put(`${API_URL}/student/profile`, formData, {
                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                    });
                    if (response.data.success) {
                        set({ profile: response.data.data, isLoading: false });
                        return { success: true };
                    }
                    set({ isLoading: false });
                    return { success: false, message: response.data.message || 'Update failed' };
                } catch (error) {
                    console.error('Error updating profile:', error);
                    const msg = error.response?.data?.message || error.message || 'Failed to update profile';
                    set({ isLoading: false });
                    return { success: false, message: msg };
                }
            },
            changePassword: async (currentPassword, newPassword) => {
                try {
                    const token = get().token;
                    const response = await axios.post(`${API_URL}/student/change-password`, {
                        currentPassword,
                        newPassword
                    }, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) return { success: true, message: response.data.message };
                    return { success: false, message: response.data.message || 'Failed to change password' };
                } catch (error) {
                    const msg = error.response?.data?.message || 'Failed to change password';
                    return { success: false, message: msg };
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
