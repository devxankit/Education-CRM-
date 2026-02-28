import express from "express";
import {
    admitStudent,
    confirmAdmission,
    recordFeePayment,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    loginStudent,
    forgotStudentPassword,
    verifyStudentForgotOtp,
    resetStudentPasswordWithOtp,
    getStudentDashboard,
    getStudentExams,
    getStudentResults,
    getMyAttendance,
    getStudentFees,
    getMyNotices,
    getStudentNotifications,
    getStudentProfile,
    getStudentAcademics,
    getStudentHomework,
    submitHomework,
    getLearningMaterials,
    getStudentNotes,
    createStudentNote,
    updateStudentNote,
    deleteStudentNote,
    createSupportTicket,
    getSupportTickets,
    updateStudentProfile,
    changeStudentPassword,
    registerStudentFcmToken,
} from "../Controllers/StudentCtrl.js";
import { AuthMiddleware, isAdmin, isStudent } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Public login & forgot password
router.post("/login", loginStudent);
router.post("/forgot-password", forgotStudentPassword);
router.post("/verify-forgot-otp", verifyStudentForgotOtp);
router.post("/reset-password", resetStudentPasswordWithOtp);

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
router.post("/register-fcm-token", isStudent, registerStudentFcmToken);
// router.put("/notices/:noticeId/acknowledge", isStudent, acknowledgeNotice);
router.get("/profile", isStudent, getStudentProfile);
router.put("/profile", isStudent, updateStudentProfile);
router.post("/change-password", isStudent, changeStudentPassword);
router.get("/academics", isStudent, getStudentAcademics);
router.get("/homework", isStudent, getStudentHomework);
router.post("/homework/submit", isStudent, submitHomework);
router.get("/learning-materials", isStudent, getLearningMaterials);
router.get("/notes/my", isStudent, getStudentNotes);
router.post("/notes/my", isStudent, createStudentNote);
router.put("/notes/my/:id", isStudent, updateStudentNote);
router.delete("/notes/my/:id", isStudent, deleteStudentNote);
router.post("/tickets", isStudent, createSupportTicket);
router.get("/tickets", isStudent, getSupportTickets);
router.post("/change-password", isStudent, changeStudentPassword);

// Admin only routes
router.post("/admit", isAdmin, admitStudent);
router.post("/:id/confirm", isAdmin, confirmAdmission);
router.post("/:id/record-fee", isAdmin, recordFeePayment);
router.get("/", isAdmin, getStudents);
router.get("/:id", isAdmin, getStudentById);
router.put("/:id", isAdmin, updateStudent);
router.delete("/:id", isAdmin, deleteStudent);

export default router;
