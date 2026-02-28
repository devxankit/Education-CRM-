import express from "express";
import {
    createTeacher,
    getTeachers,
    updateTeacher,
    loginTeacher,
    forgotTeacherPassword,
    verifyTeacherForgotOtp,
    resetTeacherPasswordWithOtp,
    getTeacherProfile,
    updateTeacherProfile,
    getTeacherClasses,
    getClassStudents,
    getStudentDetail,
    createHomework,
    getHomeworks,
    getHomeworkById,
    updateHomework,
    deleteHomework,
    markAttendance,
    getAttendanceHistory,
    getAttendanceByDate,
    getTeacherDashboard,
    getTeacherExams,
    getExamById,
    getExamStudents,
    submitMarks,
    getHomeworkSubmissions,
    gradeSubmission,
    getTeacherAnalytics,
    getTeacherPayrollHistory,
    getTeacherAcademicYears,
    markClassCompletion,
    getClassCompletions,
    getTodayClassesWithCompletion,
    getTeacherLearningMaterials
} from "../Controllers/TeacherCtrl.js";
import {
    getTeacherSupportTickets,
    resolveSupportTicket,
    createTeacherTicket,
    getTeacherOwnTickets
} from "../Controllers/TeacherSupportCtrl.js";
import {
    addEligibleSubject,
    removeEligibleSubject,
    getEligibleSubjects
} from "../Controllers/TeacherEligibilityCtrl.js";
import { getMyAttendanceHistory } from "../Controllers/TeacherAttendanceCtrl.js";
import { AuthMiddleware, isInstitute, isTeacher, isAdmin } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Public login
router.post("/login", loginTeacher);
router.post("/forgot-password", forgotTeacherPassword);
router.post("/verify-forgot-otp", verifyTeacherForgotOtp);
router.post("/reset-password", resetTeacherPasswordWithOtp);

// Protected routes
router.use(AuthMiddleware);

// Teacher/Staff specific routes (static paths must come before /:id)
router.get("/profile", isTeacher, getTeacherProfile);
router.get("/academic-years", isTeacher, getTeacherAcademicYears);
router.put("/profile/update", isTeacher, updateTeacherProfile);
router.get("/dashboard", isTeacher, getTeacherDashboard);
router.get("/payroll", isTeacher, getTeacherPayrollHistory);
router.get("/classes", isTeacher, getTeacherClasses);
router.get("/students", isTeacher, getClassStudents);
router.get("/students/:studentId", isTeacher, getStudentDetail);
router.post("/homework", isTeacher, createHomework);
router.get("/homework", isTeacher, getHomeworks);
router.get("/homework/:id", isTeacher, getHomeworkById);
router.put("/homework/:id", isTeacher, updateHomework);
router.delete("/homework/:id", isTeacher, deleteHomework);
router.get("/homework/:homeworkId/submissions", isTeacher, getHomeworkSubmissions);
router.put("/homework/submissions/:submissionId/grade", isTeacher, gradeSubmission);
router.post("/attendance", isTeacher, markAttendance);
router.get("/attendance/my-attendance", isTeacher, getMyAttendanceHistory);
router.get("/attendance/history", isTeacher, getAttendanceHistory);
router.get("/attendance/by-date", isTeacher, getAttendanceByDate);
router.get("/learning-materials", isTeacher, getTeacherLearningMaterials);

// Exam routes
router.get("/exams", isTeacher, getTeacherExams);
router.get("/exams/students", isTeacher, getExamStudents);
router.get("/exams/:id", isTeacher, getExamById);
router.post("/exams/submit-marks", isTeacher, submitMarks);

// Support Tickets (student tickets - teacher views/resolves)
router.get("/support/tickets", isTeacher, getTeacherSupportTickets);
router.put("/support/tickets/:ticketId/resolve", isTeacher, resolveSupportTicket);
// Teacher own tickets (teacher creates for self - salary, leave, etc.)
router.post("/support/my-tickets", isTeacher, createTeacherTicket);
router.get("/support/my-tickets", isTeacher, getTeacherOwnTickets);

// Analytics
router.get("/analytics", isTeacher, getTeacherAnalytics);

// Class Completion routes
router.post("/class-completion", isTeacher, markClassCompletion);
router.get("/class-completion", isTeacher, getClassCompletions);
router.get("/today-classes", isTeacher, getTodayClassesWithCompletion);

// Management routes
router.post("/", isAdmin, createTeacher);
router.get("/", isAdmin, getTeachers);
router.put("/:id", isAdmin, updateTeacher);

// Eligible Subjects Management
router.get("/:teacherId/eligible-subjects", isAdmin, getEligibleSubjects);
router.post("/:teacherId/eligible-subjects", isAdmin, addEligibleSubject);
router.delete("/:teacherId/eligible-subjects", isAdmin, removeEligibleSubject);

export default router;
