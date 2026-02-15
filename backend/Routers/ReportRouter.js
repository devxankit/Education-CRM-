import { Router } from "express";
import {
    getAcademicReport,
    getFinanceReport,
    getHRReport,
    getOperationsReport,
} from "../Controllers/ReportCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.get("/academic", getAcademicReport);
router.get("/finance", getFinanceReport);
router.get("/hr", getHRReport);
router.get("/operations", getOperationsReport);

export default router;
