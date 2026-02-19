import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { API_URL } from '@/app/api';
import { queriesData } from '../modules/teacher/data/supportData';
import { examsData } from '../modules/teacher/data/examsData';
import { submissionsData } from '../modules/teacher/data/submissionsData';

export const useTeacherStore = create(
    persist(
        (set, get) => ({
            // Auth State (Initialize from localStorage to prevent flash of unauthenticated)
            user: (() => {
                try {
                    const stored = localStorage.getItem('teacher-storage');
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
                    const stored = localStorage.getItem('teacher-storage');
                    if (stored) return JSON.parse(stored)?.state?.token || null;
                    return localStorage.getItem('token') || null;
                } catch (e) { return localStorage.getItem('token') || null; }
            })(),
            isAuthenticated: (() => {
                try {
                    const stored = localStorage.getItem('teacher-storage');
                    const hasPersistedToken = stored ? !!JSON.parse(stored)?.state?.token : false;
                    return hasPersistedToken || !!localStorage.getItem('token');
                } catch (e) { return !!localStorage.getItem('token'); }
            })(),

            login: async (email, password) => {
                try {
                    const response = await axios.post(`${API_URL}/teacher/login`, { email, password });
                    if (response.data.success) {
                        const { data, token } = response.data;
                        localStorage.setItem('token', token);
                        set({
                            user: data,
                            token,
                            isAuthenticated: true,
                            assignedClasses: [],
                            classStudents: []
                        });
                        return { success: true };
                    }
                } catch (error) {
                    console.error('Teacher Login Error:', error);
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
                    profile: null,
                    assignedClasses: [],
                    classStudents: [],
                    dashboardData: null
                });
            },

            // Dashboard
            dashboardData: null,
            isFetchingDashboard: false,
            fetchDashboard: async () => {
                if (get().isFetchingDashboard) return;
                set({ isFetchingDashboard: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/teacher/dashboard`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ dashboardData: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching dashboard:', error);
                } finally {
                    set({ isFetchingDashboard: false });
                }
            },

            // Submissions
            submissions: submissionsData,
            updateSubmission: (id, data) => set((state) => ({
                submissions: state.submissions.map(s => s.id === id ? { ...s, ...data } : s)
            })),

            // Profile & Settings
            profile: null,
            assignedClasses: [],
            classStudents: [],
            isFetchingProfile: false,
            isFetchingClasses: false,
            isFetchingStudents: false,
            fetchAssignedClasses: async (force = false) => {
                if (get().isFetchingClasses) return;
                if (!force && get().assignedClasses.length > 0) return;

                set({ isFetchingClasses: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/teacher/classes`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ assignedClasses: response.data.data.subjects });
                    }
                } catch (error) {
                    console.error('Error fetching assigned classes:', error);
                } finally {
                    set({ isFetchingClasses: false });
                }
            },
            studentDetail: null,
            studentDetailError: null,
            isFetchingStudentDetail: false,
            fetchStudentDetail: async (studentId, classId, sectionId) => {
                set({ isFetchingStudentDetail: true, studentDetail: null, studentDetailError: null });
                try {
                    const token = get().token;
                    const params = classId && sectionId ? { classId, sectionId } : {};
                    const response = await axios.get(`${API_URL}/teacher/students/${studentId}`, {
                        params,
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ studentDetail: response.data.data, studentDetailError: null });
                        return response.data.data;
                    }
                    return null;
                } catch (error) {
                    const msg = error.response?.data?.message || 'Failed to load student details';
                    set({ studentDetailError: msg });
                    console.error('Error fetching student detail:', error);
                    return null;
                } finally {
                    set({ isFetchingStudentDetail: false });
                }
            },
            clearStudentDetail: () => set({ studentDetail: null, studentDetailError: null }),
            fetchClassStudents: async (classId, sectionId) => {
                if (get().isFetchingStudents) return;
                // Optional: Cache check (if same class/section already loaded)
                if (get().classStudents.length > 0 &&
                    get().classStudents[0].classId === classId &&
                    get().classStudents[0].sectionId === sectionId) return;

                set({ isFetchingStudents: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/teacher/students`, {
                        params: { classId, sectionId },
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        // Store the IDs to allow the guard to work
                        const studentsWithContext = response.data.data.map(s => ({ ...s, classId, sectionId }));
                        set({ classStudents: studentsWithContext });
                    }
                } catch (error) {
                    console.error('Error fetching class students:', error);
                } finally {
                    set({ isFetchingStudents: false });
                }
            },
            fetchProfile: async (force = false) => {
                if (get().isFetchingProfile) return;
                if (!force && get().profile?._id) return;

                set({ isFetchingProfile: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/teacher/profile`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ profile: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching teacher profile:', error);
                } finally {
                    set({ isFetchingProfile: false });
                }
            },
            updateProfile: (data) => set((state) => ({
                profile: { ...state.profile, ...data }
            })),
            uploadProfilePhoto: async (base64Photo) => {
                try {
                    const token = get().token;
                    const response = await axios.put(`${API_URL}/teacher/profile/update`, { photo: base64Photo }, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ profile: response.data.data });
                        return { success: true };
                    }
                    return { success: false };
                } catch (error) {
                    console.error('Error uploading profile photo:', error);
                    return { success: false, message: error.response?.data?.message || 'Upload failed' };
                }
            },

            // Attendance
            attendanceRecords: [],
            myAttendance: [],
            isSubmittingAttendance: false,
            isFetchingAttendance: false,
            isFetchingMyAttendance: false,
            submitAttendance: async (record) => {
                set({ isSubmittingAttendance: true });
                try {
                    const token = get().token;
                    const response = await axios.post(`${API_URL}/teacher/attendance`, record, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            attendanceRecords: [...state.attendanceRecords, response.data.data],
                            todayClasses: (state.todayClasses || []).map(c =>
                                c.id === record.classId ? { ...c, status: 'Marked' } : c
                            )
                        }));
                        return true;
                    }
                } catch (error) {
                    console.error('Error submitting attendance:', error);
                    return false;
                } finally {
                    set({ isSubmittingAttendance: false });
                }
            },
            fetchAttendanceByDate: async (params) => {
                set({ isFetchingAttendance: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/teacher/attendance/by-date`, {
                        params,
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        return response.data.data;
                    }
                    return null;
                } catch (error) {
                    console.error('Error fetching attendance by date:', error);
                    return null;
                } finally {
                    set({ isFetchingAttendance: false });
                }
            },
            fetchMyAttendance: async (params = {}) => {
                set({ isFetchingMyAttendance: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/teacher/attendance/my-attendance`, {
                        params,
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ myAttendance: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching my attendance:', error);
                } finally {
                    set({ isFetchingMyAttendance: false });
                }
            },

            // Homework
            homeworkList: [],
            isFetchingHomework: false,
            isCreatingHomework: false,
            fetchHomeworkList: async (filters = {}) => {
                if (get().isFetchingHomework) return;
                set({ isFetchingHomework: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/teacher/homework`, {
                        params: filters,
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ homeworkList: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching homework list:', error);
                } finally {
                    set({ isFetchingHomework: false });
                }
            },
            getHomeworkById: async (id) => {
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/teacher/homework/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        return response.data.data;
                    }
                    return null;
                } catch (error) {
                    console.error('Error fetching homework:', error);
                    return null;
                }
            },
            addHomework: async (homeworkData) => {
                set({ isCreatingHomework: true });
                try {
                    const token = get().token;
                    const response = await axios.post(`${API_URL}/teacher/homework`, homeworkData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        await get().fetchHomeworkList();
                        return true;
                    }
                } catch (error) {
                    console.error('Error adding homework:', error);
                    return false;
                } finally {
                    set({ isCreatingHomework: false });
                }
            },
            updateHomework: async (id, updateData) => {
                try {
                    const token = get().token;
                    const response = await axios.put(`${API_URL}/teacher/homework/${id}`, updateData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            homeworkList: state.homeworkList.map(hw =>
                                hw._id === id ? response.data.data : hw
                            )
                        }));
                        return true;
                    }
                } catch (error) {
                    console.error('Error updating homework:', error);
                    return false;
                }
            },
            deleteHomework: async (id) => {
                try {
                    const token = get().token;
                    const response = await axios.delete(`${API_URL}/teacher/homework/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            homeworkList: state.homeworkList.filter(hw => hw._id !== id)
                        }));
                        return true;
                    }
                } catch (error) {
                    console.error('Error deleting homework:', error);
                    return false;
                }
            },

            // Learning Materials (Resources)
            learningMaterials: [],
            isFetchingLearningMaterials: false,
            fetchLearningMaterials: async (filters = {}) => {
                if (get().isFetchingLearningMaterials) return;
                set({ isFetchingLearningMaterials: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/teacher/learning-materials`, {
                        params: filters,
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ learningMaterials: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching learning materials:', error);
                } finally {
                    set({ isFetchingLearningMaterials: false });
                }
            },

            // Notices
            notices: [],
            isFetchingNotices: false,
            fetchNotices: async () => {
                if (get().isFetchingNotices) return;
                set({ isFetchingNotices: true });
                try {
                    // Notices come from the dashboard API now
                    const dashboardData = get().dashboardData;
                    if (dashboardData?.recentNotices) {
                        set({ notices: dashboardData.recentNotices });
                    }
                } catch (error) {
                    console.error('Error fetching notices:', error);
                } finally {
                    set({ isFetchingNotices: false });
                }
            },

            // Support Queries (student tickets teacher resolves)
            queries: [],
            myTickets: [],
            isFetchingMyTickets: false,
            isFetchingQueries: false,
            isResolvingQuery: false,
            fetchQueries: async () => {
                if (get().isFetchingQueries) return;
                set({ isFetchingQueries: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/teacher/support/tickets`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ queries: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching support queries:', error);
                } finally {
                    set({ isFetchingQueries: false });
                }
            },
            fetchMyTickets: async () => {
                if (get().isFetchingMyTickets) return;
                set({ isFetchingMyTickets: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/teacher/support/my-tickets`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ myTickets: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching my tickets:', error);
                } finally {
                    set({ isFetchingMyTickets: false });
                }
            },
            createMyTicket: async (ticketData) => {
                try {
                    const token = get().token;
                    const response = await axios.post(`${API_URL}/teacher/support/my-tickets`, ticketData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({ myTickets: [response.data.data, ...state.myTickets] }));
                        return { success: true };
                    }
                    return { success: false, message: response.data.message };
                } catch (error) {
                    return { success: false, message: error.response?.data?.message || 'Failed to create ticket' };
                }
            },
            resolveQuery: async (queryId, responseText = '') => {
                set({ isResolvingQuery: true });
                try {
                    const token = get().token;
                    const response = await axios.put(
                        `${API_URL}/teacher/support/tickets/${queryId}/resolve`,
                        { response: responseText },
                        { headers: { 'Authorization': `Bearer ${token}` } }
                    );
                    if (response.data.success) {
                        set((state) => ({
                            queries: state.queries.map(q =>
                                q._id === queryId ? { ...q, status: 'Resolved', response: responseText } : q
                            )
                        }));
                        return { success: true };
                    }
                    return { success: false };
                } catch (error) {
                    console.error('Error resolving query:', error);
                    return { success: false, message: error.response?.data?.message };
                } finally {
                    set({ isResolvingQuery: false });
                }
            },

            // Marks/Exams
            exams: [],
            isFetchingExams: false,
            fetchExams: async () => {
                if (get().isFetchingExams) return;
                set({ isFetchingExams: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/teacher/exams`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ exams: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching exams:', error);
                } finally {
                    set({ isFetchingExams: false });
                }
            },

            currentExam: null,
            isFetchingExam: false,
            fetchExamById: async (examId) => {
                set({ isFetchingExam: true, currentExam: null });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/teacher/exams/${examId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ currentExam: response.data.data });
                        return { success: true, data: response.data.data };
                    }
                    return { success: false };
                } catch (error) {
                    const status = error.response?.status;
                    const message = error.response?.data?.message || error.message;
                    if (status === 403) {
                        return { success: false, forbidden: true, message };
                    }
                    if (status === 404) {
                        return { success: false, notFound: true, message };
                    }
                    console.error('Error fetching exam:', error);
                    return { success: false, message };
                } finally {
                    set({ isFetchingExam: false });
                }
            },

            examStudents: {}, // Stores students per exam-class-subject combo
            isFetchingExamStudents: false,
            fetchExamStudents: async (examId, classId, subjectId, sectionId) => {
                set({ isFetchingExamStudents: true });
                try {
                    const token = get().token;
                    const params = { examId, classId, subjectId };
                    if (sectionId) params.sectionId = sectionId;
                    
                    const response = await axios.get(`${API_URL}/teacher/exams/students`, {
                        params,
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        const key = `${examId}_${classId}_${subjectId}`;
                        set(state => ({
                            examStudents: {
                                ...state.examStudents,
                                [key]: response.data.data
                            }
                        }));
                        return response.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching exam students:', error);
                    return [];
                } finally {
                    set({ isFetchingExamStudents: false });
                }
            },

            marksRecords: [],
            isSubmittingMarks: false,
            submitMarks: async (marksPayload) => {
                set({ isSubmittingMarks: true });
                try {
                    const token = get().token;
                    const response = await axios.post(`${API_URL}/teacher/exams/submit-marks`, marksPayload, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        // Refresh exams to show updated status if needed
                        get().fetchExams();
                        return { success: true, message: response.data.message };
                    }
                    return { success: false, message: response.data.message };
                } catch (error) {
                    console.error('Error submitting marks:', error);
                    return { success: false, message: error.response?.data?.message || 'Failed to submit marks' };
                } finally {
                    set({ isSubmittingMarks: false });
                }
            },
            saveMarksDraft: (record) => set((state) => ({
                marksRecords: [
                    ...state.marksRecords.filter(r => r.examId !== record.examId),
                    record
                ]
            })),

            // Submissions
            submissions: [],
            isFetchingSubmissions: false,
            fetchHomeworkSubmissions: async (homeworkId) => {
                set({ isFetchingSubmissions: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/teacher/homework/${homeworkId}/submissions`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ submissions: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching submissions:', error);
                } finally {
                    set({ isFetchingSubmissions: false });
                }
            },
            gradeSubmission: async (submissionId, gradeData) => {
                try {
                    const token = get().token;
                    const response = await axios.put(`${API_URL}/teacher/homework/submissions/${submissionId}/grade`, gradeData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set(state => ({
                            submissions: state.submissions.map(s =>
                                s._id === submissionId ? { ...s, ...response.data.data } : s
                            )
                        }));
                        return { success: true };
                    }
                    return { success: false };
                } catch (error) {
                    console.error('Error grading submission:', error);
                    return { success: false };
                }
            },


            // Branch Academic Years (for filters)
            branchAcademicYears: [],
            isFetchingAcademicYears: false,
            fetchBranchAcademicYears: async () => {
                if (get().isFetchingAcademicYears) return;
                set({ isFetchingAcademicYears: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/teacher/academic-years`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ branchAcademicYears: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching academic years:', error);
                } finally {
                    set({ isFetchingAcademicYears: false });
                }
            },

            // Payroll
            payrollHistory: [],
            isFetchingPayroll: false,
            fetchPayrollHistory: async () => {
                if (get().isFetchingPayroll) return;
                set({ isFetchingPayroll: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/teacher/payroll`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ payrollHistory: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching payroll history:', error);
                } finally {
                    set({ isFetchingPayroll: false });
                }
            },

            // Analytics
            analyticsData: null,
            isFetchingAnalytics: false,
            fetchAnalytics: async () => {
                set({ isFetchingAnalytics: true });
                try {
                    const token = get().token;
                    const response = await axios.get(`${API_URL}/teacher/analytics`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set({ analyticsData: response.data.data });
                    }
                } catch (error) {
                    console.error('Error fetching analytics:', error);
                } finally {
                    set({ isFetchingAnalytics: false });
                }
            },
        }),
        {
            name: 'teacher-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);