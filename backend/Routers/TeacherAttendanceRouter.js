import express from "express";
import {
    markTeacherAttendance,
    getTeacherAttendanceByDate,
    getTeacherAttendanceHistory,
    getTeachersForAttendance,
    getDayInfo
} from "../Controllers/TeacherAttendanceCtrl.js";
import { AuthMiddleware } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// All routes require authentication (staff can access)
router.use(AuthMiddleware);

// Day info (holiday + working day from timetable rules) for attendance screen
router.get("/day-info", getDayInfo);

// Get teachers list for attendance marking
router.get("/teachers", getTeachersForAttendance);

// Mark teacher attendance (for staff/front desk)
router.post("/mark", markTeacherAttendance);

// Get attendance by date
router.get("/by-date", getTeacherAttendanceByDate);

// Get attendance history
router.get("/history", getTeacherAttendanceHistory);

export default router;
