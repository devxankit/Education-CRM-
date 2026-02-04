import express from "express";
import {
    admitStudent,
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
    getStudentProfile,
    getStudentAcademics
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
router.get("/profile", isStudent, getStudentProfile);
router.get("/academics", isStudent, getStudentAcademics);

// Admin only routes
router.post("/admit", isAdmin, admitStudent);
router.get("/", isAdmin, getStudents);
router.get("/:id", isAdmin, getStudentById);
router.put("/:id", isAdmin, updateStudent);

export default router;
