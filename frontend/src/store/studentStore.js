import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dashboardData } from '../modules/student/data/dashboardData';
import { attendanceData } from '../modules/student/data/attendanceData';
import { feesData } from '../modules/student/data/feesData';
import { examsData } from '../modules/student/data/examsData';
import { homeworkData } from '../modules/student/data/homeworkData';
import { supportData } from '../modules/student/data/supportData';
import { profileData } from '../modules/student/data/profileData';
import { notificationsData } from '../modules/student/data/notificationsData';
import { notices as noticesData } from '../modules/student/data/noticesData';
import { academicsData } from '../modules/student/data/academicsData';
import { documentsData } from '../modules/student/data/documentsData';
import { notesData } from '../modules/student/data/notesData';

export const useStudentStore = create(
    persist(
        (set, get) => ({
            // State
            profile: profileData,
            dashboard: dashboardData,
            attendance: attendanceData,
            fees: feesData,
            exams: examsData,
            homeworkList: homeworkData,
            support: supportData,
            notifications: notificationsData,
            notices: noticesData,
            academics: academicsData,
            documents: documentsData,
            notes: notesData,
            tickets: [],

            // Actions
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
                    paid: state.fees.paid + amount,
                    pending: state.fees.pending - amount
                }
            })),

            markAsRead: (id) => set((state) => ({
                notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
            })),

            fetchNotifications: () => {
                // In mock, already in state. Could trigger loading here if needed.
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
        }
    )
);
