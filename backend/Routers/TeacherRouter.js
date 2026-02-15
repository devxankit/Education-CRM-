import express from "express";
import {
    createTeacher,
    getTeachers,
    updateTeacher,
    loginTeacher,
    getTeacherProfile,
    getTeacherClasses,
    getClassStudents,
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
    getTeacherPayrollHistory
} from "../Controllers/TeacherCtrl.js";
import {
    getTeacherSupportTickets,
    resolveSupportTicket
} from "../Controllers/TeacherSupportCtrl.js";
import {
    addEligibleSubject,
    removeEligibleSubject,
    getEligibleSubjects
} from "../Controllers/TeacherEligibilityCtrl.js";
import { AuthMiddleware, isInstitute, isTeacher, isAdmin } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Public login
router.post("/login", loginTeacher);

// Protected routes
router.use(AuthMiddleware);

// Teacher/Staff specific routes
router.get("/profile", isTeacher, getTeacherProfile);
router.get("/dashboard", isTeacher, getTeacherDashboard);
router.get("/payroll", isTeacher, getTeacherPayrollHistory);
router.get("/classes", isTeacher, getTeacherClasses);
router.get("/students", isTeacher, getClassStudents);
router.post("/homework", isTeacher, createHomework);
router.get("/homework", isTeacher, getHomeworks);
router.get("/homework/:id", isTeacher, getHomeworkById);
router.put("/homework/:id", isTeacher, updateHomework);
router.delete("/homework/:id", isTeacher, deleteHomework);
router.get("/homework/:homeworkId/submissions", isTeacher, getHomeworkSubmissions);
router.put("/homework/submissions/:submissionId/grade", isTeacher, gradeSubmission);
router.post("/attendance", isTeacher, markAttendance);
router.get("/attendance/history", isTeacher, getAttendanceHistory);
router.get("/attendance/by-date", isTeacher, getAttendanceByDate);

// Exam routes
router.get("/exams", isTeacher, getTeacherExams);
router.get("/exams/students", isTeacher, getExamStudents);
router.get("/exams/:id", isTeacher, getExamById);
router.post("/exams/submit-marks", isTeacher, submitMarks);

// Support Tickets
router.get("/support/tickets", isTeacher, getTeacherSupportTickets);
router.put("/support/tickets/:ticketId/resolve", isTeacher, resolveSupportTicket);

// Analytics
router.get("/analytics", isTeacher, getTeacherAnalytics);

// Management routes
router.post("/", isAdmin, createTeacher);
router.get("/", isAdmin, getTeachers);
router.put("/:id", isAdmin, updateTeacher);

// Eligible Subjects Management
router.get("/:teacherId/eligible-subjects", isAdmin, getEligibleSubjects);
router.post("/:teacherId/eligible-subjects", isAdmin, addEligibleSubject);
router.delete("/:teacherId/eligible-subjects", isAdmin, removeEligibleSubject);

export default router;
