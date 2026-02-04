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
            fetchAssignedClasses: async () => {
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
                }
            },
            fetchProfile: async () => {
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
            submitAttendance: (record) => set((state) => {
                // Update class status in todayClasses if applicable
                const updatedTodayClasses = state.todayClasses.map(c =>
                    c.id === record.classId ? { ...c, status: 'Marked', attendance: `${record.stats.present}%` } : c
                );
                return {
                    attendanceRecords: [...state.attendanceRecords, record],
                    todayClasses: updatedTodayClasses
                };
            }),

            // Homework
            homeworkList: homeworkData.list,
            addHomework: (homework) => set((state) => ({
                homeworkList: [homework, ...state.homeworkList]
            })),

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