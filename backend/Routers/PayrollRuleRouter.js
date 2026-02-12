import express from "express";
import {
    getPayrollRule,
    savePayrollRule,
    togglePayrollLock,
} from "../Controllers/PayrollRuleCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.get("/", getPayrollRule);
router.post("/", savePayrollRule);
router.put("/:id/lock", togglePayrollLock);

export default router;
