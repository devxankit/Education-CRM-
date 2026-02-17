import express from "express";
import {
    admitStudent,
    confirmAdmission,
    recordFeePayment,
    getStudents,
    getStudentById,
    updateStudent,
    loginStudent,
    getStudentDashboard,
    getStudentExams,
    getStudentResults,
    getMyAttendance,
    getStudentFees,
    getMyNotices,
    // acknowledgeNotice,
    getStudentNotifications,
    getStudentProfile,
    getStudentAcademics,
    getStudentHomework,
    submitHomework,
    getLearningMaterials,
    createSupportTicket,
    getSupportTickets,
    updateStudentProfile
} from "../Controllers/StudentCtrl.js";
import { AuthMiddleware, isAdmin, isStudent } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Public login
router.post("/login", loginStudent);

// Protected routes
router.use(AuthMiddleware);

// Student specific routes
router.get("/dashboard", isStudent, getStudentDashboard);
router.get("/exams", isStudent, getStudentExams);
router.get("/results", isStudent, getStudentResults);
router.get("/attendance", isStudent, getMyAttendance);
router.get("/fees", isStudent, getStudentFees);
router.get("/notices", isStudent, getMyNotices);
router.get("/notifications", isStudent, getStudentNotifications);
// router.put("/notices/:noticeId/acknowledge", isStudent, acknowledgeNotice);
router.get("/profile", isStudent, getStudentProfile);
router.put("/profile", isStudent, updateStudentProfile);
router.get("/academics", isStudent, getStudentAcademics);
router.get("/homework", isStudent, getStudentHomework);
router.post("/homework/submit", isStudent, submitHomework);
router.get("/learning-materials", isStudent, getLearningMaterials);
router.post("/tickets", isStudent, createSupportTicket);
router.get("/tickets", isStudent, getSupportTickets);

// Admin only routes
router.post("/admit", isAdmin, admitStudent);
router.post("/:id/confirm", isAdmin, confirmAdmission);
router.post("/:id/record-fee", isAdmin, recordFeePayment);
router.get("/", isAdmin, getStudents);
router.get("/:id", isAdmin, getStudentById);
router.put("/:id", isAdmin, updateStudent);

export default router;
