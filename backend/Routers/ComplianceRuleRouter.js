import { Router } from "express";
import {
    getComplianceRules,
    createComplianceRule,
    updateComplianceRule,
    deleteComplianceRule,
    toggleComplianceRuleStatus,
} from "../Controllers/ComplianceRuleCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.get("/", getComplianceRules);
router.post("/", createComplianceRule);
router.put("/:id", updateComplianceRule);
router.delete("/:id", deleteComplianceRule);
router.put("/:id/toggle", toggleComplianceRuleStatus);

export default router;
