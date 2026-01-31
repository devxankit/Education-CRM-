import { homeworkData, homeworkStats } from '../data/homeworkData';
import { notices } from '../data/noticesData';
import { attendanceData } from '../data/attendanceData';
import { profileData } from '../data/profileData';
import { examsData } from '../data/examsData';
import { dashboardData } from '../data/dashboardData';
import { documentsData } from '../data/documentsData';
import { feesData } from '../data/feesData';
import { supportData } from '../data/supportData';
import { academicsData } from '../data/academicsData';
import { notificationsData } from '../data/notificationsData';

/**
 * Student Service to handle all student-related data fetching.
 * Currently uses simulated fetches to mimic API calls.
 */
class StudentService {
    // Homework
    async getHomework() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(homeworkData), 800);
        });
    }

    async getHomeworkStats() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(homeworkStats), 800);
        });
    }

    async getHomeworkById(id) {
        return new Promise((resolve) => {
            const homework = homeworkData.find(hw => hw.id === id);
            setTimeout(() => resolve(homework), 500);
        });
    }

    // Notices
    async getNotices() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(notices), 800);
        });
    }

    async getNoticeById(id) {
        return new Promise((resolve) => {
            const notice = notices.find(n => n.id === parseInt(id));
            setTimeout(() => resolve(notice), 500);
        });
    }

    // Attendance
    async getAttendance() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(attendanceData), 800);
        });
    }

    // Profile
    async getProfile() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(profileData), 800);
        });
    }

    // Exams
    async getExams() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(examsData), 800);
        });
    }

    async getExamResultById(id) {
        return new Promise((resolve) => {
            const result = examsData.results.find(r => r.id === parseInt(id));
            setTimeout(() => resolve(result), 500);
        });
    }

    // Dashboard
    async getDashboardData() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(dashboardData), 800);
        });
    }

    // Documents
    async getDocuments() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(documentsData), 800);
        });
    }

    // Fees
    async getFees() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(feesData), 800);
        });
    }

    // Help & Support
    async getSupportData() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(supportData), 800);
        });
    }

    // Academics
    async getAcademics() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(academicsData), 800);
        });
    }

    // Notifications
    async getNotifications() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(notificationsData), 800);
        });
    }

    // Form Submissions (Mocking real logic)
    async submitProfileCorrection(data) {
        return new Promise((resolve) => {
            console.log('Submitting Profile Correction:', data);
            setTimeout(() => resolve({ success: true, message: 'Correction request submitted successfully' }), 1500);
        });
    }

    async submitSupportTicket(data) {
        return new Promise((resolve) => {
            console.log('Submitting Support Ticket:', data);
            setTimeout(() => resolve({ success: true, ticketId: 'TKT-' + Math.floor(Math.random() * 10000) }), 1500);
        });
    }
}

export const studentService = new StudentService();
