import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { API_URL } from '../app/api';

export const useParentStore = create(
    persist(
        (set, get) => ({
            // State (Initialize from localStorage to prevent flash of unauthenticated)
            user: (() => {
                try {
                    const stored = localStorage.getItem('parent-storage');
                    if (stored) return JSON.parse(stored)?.state?.user || null;
                    const user = localStorage.getItem('user');
                    return user ? JSON.parse(user) : null;
                } catch (e) {
                    try {
                        const user = localStorage.getItem('user');
                        return user ? JSON.parse(user) : null;
                    } catch { return null; }
                }
            })(),
            token: (() => {
                try {
                    const stored = localStorage.getItem('parent-storage');
                    if (stored) return JSON.parse(stored)?.state?.token || null;
                    return localStorage.getItem('token') || null;
                } catch (e) { return localStorage.getItem('token') || null; }
            })(),
            children: [],
            selectedChildId: (() => {
                try {
                    const stored = localStorage.getItem('parent-storage');
                    return stored ? JSON.parse(stored)?.state?.selectedChildId || null : null;
                } catch (e) { return null; }
            })(),
            isAuthenticated: (() => {
                try {
                    const stored = localStorage.getItem('parent-storage');
                    const hasPersistedToken = stored ? !!JSON.parse(stored)?.state?.token : false;
                    return hasPersistedToken || !!localStorage.getItem('token');
                } catch (e) { return !!localStorage.getItem('token'); }
            })(),
            isLoading: false,

            // Institute profile for Parent app (read-only)
            instituteProfile: null,

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

            requestPasswordReset: async (identifier) => {
                try {
                    const response = await axios.post(`${API_URL}/parent/forgot-password`, { identifier: identifier?.trim() });
                    if (response.data.success) {
                        return { success: true, message: response.data.message, email: response.data.email };
                    }
                    return { success: false, message: response.data.message || 'Failed to send OTP' };
                } catch (error) {
                    console.error('Parent Forgot Password Error:', error);
                    return {
                        success: false,
                        message: error.response?.data?.message || 'Failed to send OTP'
                    };
                }
            },

            verifyForgotOtp: async (identifier, otp) => {
                try {
                    const response = await axios.post(`${API_URL}/parent/verify-forgot-otp`, {
                        identifier: identifier?.trim(),
                        otp: String(otp).trim()
                    });
                    if (response.data.success) return { success: true, message: response.data.message };
                    return { success: false, message: response.data.message || 'Invalid OTP' };
                } catch (error) {
                    return { success: false, message: error.response?.data?.message || 'Invalid or expired OTP' };
                }
            },

            resetPasswordWithOtp: async (identifier, otp, newPassword) => {
                try {
                    const response = await axios.post(`${API_URL}/parent/reset-password`, {
                        identifier: identifier?.trim(),
                        otp: String(otp).trim(),
                        newPassword
                    });
                    if (response.data.success) {
                        return { success: true, message: response.data.message };
                    }
                    return { success: false, message: response.data.message || 'Failed to reset password' };
                } catch (error) {
                    console.error('Parent Reset Password Error:', error);
                    return {
                        success: false,
                        message: error.response?.data?.message || 'Failed to reset password'
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
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/parent/${user._id}/linked-students`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        const raw = response.data.data;
                        const children = Array.isArray(raw) ? raw.map(c => ({ ...c, id: c._id || c.id })) : [];
                        set({
                            children,
                            selectedChildId: get().selectedChildId || children[0]?._id || children[0]?.id
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
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/parent/portal/dashboard`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        const { children = [] } = response.data.data;
                        const normalized = Array.isArray(children) ? children.map(c => ({ ...c, id: c.id || c._id })) : [];
                        set({
                            children: normalized,
                            selectedChildId: get().selectedChildId || normalized[0]?.id || normalized[0]?._id
                        });
                    }
                } catch (error) {
                    console.error('Error fetching dashboard data:', error);
                }
            },

            setSelectedChild: (id) => set({ selectedChildId: id }),

            fetchAttendance: async (studentId) => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/parent/portal/child/${studentId}/attendance`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        const data = response.data.data;
                        const summary = data?.summary || {};
                        const history = data?.history || [];
                        const monthly = data?.monthly || [];
                        set({
                            attendance: {
                                summary: {
                                    overall: summary?.overall || 0,
                                    required: summary?.required || 75,
                                    totalDays: summary?.totalDays || 0,
                                    presentDays: summary?.presentDays || 0,
                                    absentDays: summary?.absentDays || 0,
                                },
                                history: history.map(h => ({
                                    date: new Date(h.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                                    status: h.status,
                                    type: h.type || 'Regular'
                                })),
                                monthly: monthly.map(m => ({
                                    month: m.month,
                                    percentage: m.percentage,
                                    present: m.present,
                                    absent: m.absent,
                                    isLow: m.percentage < 75
                                }))
                            },
                            isLoading: false
                        });
                    }
                } catch (error) {
                    console.error('Error fetching child attendance:', error);
                    set({ isLoading: false });
                }
            },

            fetchHomework: async (studentId) => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/parent/portal/child/${studentId}/homework`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        const list = (response.data.data || []).map(h => ({
                            ...h,
                            id: h._id || h.id,
                            status: h.status === 'Overdue' ? 'Late' : (h.status || 'Pending')
                        }));
                        set({ homework: list, isLoading: false });
                    }
                } catch (error) {
                    console.error('Error fetching child homework:', error);
                    set({ isLoading: false });
                }
            },

            fetchFees: async (studentId) => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/parent/portal/child/${studentId}/fees`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        const { summary, breakdown = [], receipts = [] } = response.data.data;
                        set({
                            fees: {
                                summary: {
                                    total: summary.total || 0,
                                    paid: summary.paid || 0,
                                    pending: summary.pending || 0,
                                    percentage: summary.percentage || 0,
                                    nextDue: summary.nextDue || 'N/A'
                                },
                                breakdown: breakdown.map((item, idx) => ({
                                    id: idx + 1,
                                    head: item.head || item.name || 'N/A',
                                    total: item.total || item.amount || 0,
                                    status: item.status || 'Due',
                                    installments: (item.installments && item.installments.length > 0 ? item.installments : [{
                                        term: 'Full Payment',
                                        due: item.dueDate,
                                        amount: item.total || item.amount,
                                        status: item.status
                                    }]).map(inst => ({
                                        ...inst,
                                        due: inst.due ? new Date(inst.due).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'
                                    }))
                                })),
                                receipts: receipts.map(tx => ({
                                    id: tx.id || tx.receiptNo,
                                    date: tx.date || tx.paymentDate,
                                    amount: tx.amount || tx.amountPaid,
                                    mode: tx.mode || tx.paymentMethod,
                                    status: tx.status || 'Success'
                                }))
                            },
                            isLoading: false
                        });
                    }
                } catch (error) {
                    console.error('Error fetching child fees:', error);
                    set({ isLoading: false });
                }
            },

            fetchExams: async (studentId) => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/parent/portal/child/${studentId}/exams`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({
                            exams: response.data.data.map((exam, idx) => ({
                                id: exam.id,
                                title: exam.title,
                                type: exam.type,
                                date: exam.date,
                                percentage: exam.overall,
                                grade: exam.grade,
                                status: exam.status,
                                isLatest: idx === 0,
                                totalMarks: exam.totalMarks,
                                obtainedMarks: exam.obtainedMarks,
                                remarks: exam.remarks,
                                overall: exam.overall,
                                subjects: exam.subjects
                            })),
                            isLoading: false
                        });
                    }
                } catch (error) {
                    console.error('Error fetching child exams:', error);
                    set({ isLoading: false });
                }
            },

            fetchTeachers: async (studentId) => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/parent/portal/child/${studentId}/teachers`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ teachers: response.data.data, isLoading: false });
                    }
                } catch (error) {
                    console.error('Error fetching child teachers:', error);
                    set({ isLoading: false });
                }
            },

            fetchDocuments: async (studentId) => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/parent/portal/child/${studentId}/documents`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ documents: response.data.data, isLoading: false });
                    }
                } catch (error) {
                    console.error('Error fetching child documents:', error);
                    set({ isLoading: false });
                }
            },

            fetchNotices: async () => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/parent/portal/notices`, {
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

            acknowledgeNotice: async (noticeId) => {
                try {
                    const token = get().token;
                    await axios.post(`${API_URL}/parent/portal/notices/${noticeId}/acknowledge`, {}, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const { notices } = get();
                    set({
                        notices: notices.map(n => n.id === noticeId ? { ...n, acknowledged: true } : n)
                    });
                } catch (error) {
                    console.error('Error acknowledging notice:', error);
                }
            },

            fetchProfile: async () => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/parent/portal/profile`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ user: response.data.data, isLoading: false });
                    }
                } catch (error) {
                    console.error('Error fetching parent profile:', error);
                    set({ isLoading: false });
                }
            },

            fetchInstituteProfile: async () => {
                try {
                    const token = get().token;
                    if (!token) return;
                    const response = await axios.get(`${API_URL}/parent/portal/institute`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ instituteProfile: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching institute profile for parent:', error);
                }
            },

            updateProfile: async (data) => {
                try {
                    const token = get().token;
                    const response = await axios.put(`${API_URL}/parent/portal/profile`, data, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ user: response.data.data });
                        return { success: true };
                    }
                } catch (error) {
                    console.error('Error updating profile:', error);
                    return { success: false, message: error.response?.data?.message || 'Update failed' };
                }
            },

            changePassword: async (data) => {
                try {
                    const token = get().token;
                    const response = await axios.post(`${API_URL}/parent/portal/change-password`, data, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    return response.data;
                } catch (error) {
                    console.error('Error changing password:', error);
                    return { success: false, message: error.response?.data?.message || 'Password change failed' };
                }
            },

            payFee: async (studentId, paymentData) => {
                try {
                    const token = get().token;
                    const response = await axios.post(`${API_URL}/parent/portal/child/${studentId}/pay-fee`, paymentData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        // Refresh fees after payment
                        get().fetchFees(studentId);
                        return response.data;
                    }
                } catch (error) {
                    console.error('Error paying fee:', error);
                    return { success: false, message: error.response?.data?.message || 'Payment failed' };
                }
            },

            fetchTickets: async (studentId) => {
                set({ isLoading: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/parent/portal/child/${studentId}/tickets`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        const transformed = response.data.data.map(t => ({
                            id: t._id,
                            category: t.category,
                            topic: t.topic,
                            details: t.details,
                            status: t.status,
                            priority: t.priority,
                            date: new Date(t.createdAt).toLocaleDateString(),
                            response: t.response,
                            responseAttachment: t.responseAttachment,
                            responseAttachmentName: t.responseAttachmentName,
                            respondedAt: t.respondedAt ? new Date(t.respondedAt).toLocaleDateString() : null
                        }));
                        set({ tickets: transformed, isLoading: false });
                    }
                } catch (error) {
                    console.error('Error fetching tickets:', error);
                    set({ isLoading: false });
                }
            },

            addTicket: async (studentId, ticketData) => {
                try {
                    const token = get().token;
                    const response = await axios.post(`${API_URL}/parent/portal/child/${studentId}/tickets`, ticketData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        const newTicket = {
                            id: response.data.data._id,
                            category: response.data.data.category,
                            topic: response.data.data.topic,
                            details: response.data.data.details,
                            status: response.data.data.status,
                            priority: response.data.data.priority,
                            date: new Date(response.data.data.createdAt).toLocaleDateString()
                        };
                        const { tickets } = get();
                        set({ tickets: [newTicket, ...tickets] });
                        return { success: true };
                    }
                } catch (error) {
                    console.error('Error adding ticket:', error);
                    return { success: false, message: error.response?.data?.message || 'Failed to raise ticket' };
                }
            },
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
