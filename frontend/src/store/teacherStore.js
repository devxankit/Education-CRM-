import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { API_URL } from '@/app/api';
import { teacherProfile, todayClasses, adminNotices } from '../modules/teacher/data/dashboardData';
import { attendanceData } from '../modules/teacher/data/attendanceData';
import { homeworkData } from '../modules/teacher/data/homeworkData';
import { queriesData } from '../modules/teacher/data/supportData';
import { examsData } from '../modules/teacher/data/examsData';
import { submissionsData } from '../modules/teacher/data/submissionsData';

export const useTeacherStore = create(
    persist(
        (set, get) => ({
            // Submissions
            submissions: submissionsData,
            updateSubmission: (id, data) => set((state) => ({
                submissions: state.submissions.map(s => s.id === id ? { ...s, ...data } : s)
            })),
            // Profile & Settings
            profile: teacherProfile,
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
                    const token = localStorage.getItem('token');
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
            fetchClassStudents: async (classId, sectionId) => {
                if (get().isFetchingStudents) return;
                // Optional: Cache check (if same class/section already loaded)
                if (get().classStudents.length > 0 &&
                    get().classStudents[0].classId === classId &&
                    get().classStudents[0].sectionId === sectionId) return;

                set({ isFetchingStudents: true });
                try {
                    const token = localStorage.getItem('token');
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
                    const token = localStorage.getItem('token');
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

            // Dashboard & Notices
            notices: adminNotices,
            todayClasses: todayClasses,

            // Attendance
            attendanceRecords: [],
            isSubmittingAttendance: false,
            isFetchingAttendance: false,
            submitAttendance: async (record) => {
                set({ isSubmittingAttendance: true });
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/teacher/attendance`, record, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            attendanceRecords: [...state.attendanceRecords, response.data.data],
                            todayClasses: state.todayClasses.map(c =>
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
                    const token = localStorage.getItem('token');
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

            // Homework
            homeworkList: [],
            isFetchingHomework: false,
            isCreatingHomework: false,
            fetchHomeworkList: async (filters = {}) => {
                if (get().isFetchingHomework) return;
                set({ isFetchingHomework: true });
                try {
                    const token = localStorage.getItem('token');
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
            addHomework: async (homeworkData) => {
                set({ isCreatingHomework: true });
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${API_URL}/teacher/homework`, homeworkData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        set((state) => ({
                            homeworkList: [response.data.data, ...state.homeworkList]
                        }));
                        return true;
                    }
                } catch (error) {
                    console.error('Error adding homework:', error);
                    return false;
                } finally {
                    set({ isCreatingHomework: false });
                }
            },

            // Support Queries
            queries: queriesData,
            resolveQuery: (queryId) => set((state) => ({
                queries: state.queries.map(q =>
                    q.id === queryId ? { ...q, status: 'Resolved' } : q
                )
            })),

            // Marks/Exams
            exams: examsData.list,
            examStudents: examsData.students,
            marksRecords: [],
            saveMarksDraft: (record) => set((state) => ({
                marksRecords: [
                    ...state.marksRecords.filter(r => r.examId !== record.examId),
                    record
                ]
            })),
            submitMarks: (record) => set((state) => ({
                marksRecords: [
                    ...state.marksRecords.filter(r => r.examId !== record.examId),
                    { ...record, status: 'Submitted' }
                ],
                exams: state.exams.map(ex =>
                    ex.id === record.examId ? { ...ex, status: 'Submitted' } : ex
                )
            })),
        }),
        {
            name: 'teacher-storage',
        }
    )
);