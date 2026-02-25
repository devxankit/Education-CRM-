import { create } from 'zustand';
import { studentService } from '../services/student.service';

const useStudentStore = create((set, get) => ({
    profile: null,
    notifications: [],
    loading: false,
    error: null,

    // Fetch Profile
    fetchProfile: async () => {
        set({ loading: true });
        try {
            const data = await studentService.getDashboardData();
            set({ profile: data.studentProfile, loading: false });
            // Best-effort FCM registration (silent if not configured)
            studentService.registerFcmIfSupported();
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    // Fetch Notifications
    fetchNotifications: async () => {
        try {
            const data = await studentService.getNotifications();
            set({ notifications: data });
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    },

    // Update Profile
    updateProfile: (updatedData) => {
        set((state) => ({
            profile: { ...state.profile, ...updatedData }
        }));
    },

    // Mark Notification as Read
    markAsRead: (id) => {
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            )
        }));
    }
}));

export default useStudentStore;
