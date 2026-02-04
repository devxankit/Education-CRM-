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
    getTeacherDashboard
} from "../Controllers/TeacherCtrl.js";
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
router.get("/classes", isTeacher, getTeacherClasses);
router.get("/students", isTeacher, getClassStudents);
router.post("/homework", isTeacher, createHomework);
router.get("/homework", isTeacher, getHomeworks);
router.get("/homework/:id", isTeacher, getHomeworkById);
router.put("/homework/:id", isTeacher, updateHomework);
router.delete("/homework/:id", isTeacher, deleteHomework);
router.post("/attendance", isTeacher, markAttendance);
router.get("/attendance/history", isTeacher, getAttendanceHistory);
router.get("/attendance/by-date", isTeacher, getAttendanceByDate);

// Management routes
router.post("/", isAdmin, createTeacher);
router.get("/", isAdmin, getTeachers);
router.put("/:id", isAdmin, updateTeacher);

// Eligible Subjects Management
router.get("/:teacherId/eligible-subjects", isAdmin, getEligibleSubjects);
router.post("/:teacherId/eligible-subjects", isAdmin, addEligibleSubject);
router.delete("/:teacherId/eligible-subjects", isAdmin, removeEligibleSubject);

export default router;
