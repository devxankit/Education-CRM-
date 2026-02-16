import express from "express";
import {
    getActivityLogs,
    getFinancialLogs,
    getDataChangeLogs,
    getSecurityLogs
} from "../Controllers/LogCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.get("/activity", getActivityLogs);
router.get("/financial", getFinancialLogs);
router.get("/data-change", getDataChangeLogs);
router.get("/security", getSecurityLogs);

export default router;
