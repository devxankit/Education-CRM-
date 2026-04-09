import { Router } from "express";
import {
    getAcademicReport,
    getFinanceReport,
    getHRReport,
    getOperationsReport,
    getMasterAttendance,
    getStudentAttendanceHistory,
} from "../Controllers/ReportCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.get("/academic", getAcademicReport);
router.get("/finance", getFinanceReport);
router.get("/hr", getHRReport);
router.get("/operations", getOperationsReport);
router.get("/master-attendance", getMasterAttendance);
router.get("/student-history/:studentId", getStudentAttendanceHistory);

export default router;
