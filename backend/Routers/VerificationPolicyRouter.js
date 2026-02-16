import { Router } from "express";
import {
    getVerificationPolicies,
    saveVerificationPolicies,
} from "../Controllers/VerificationPolicyCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.get("/", getVerificationPolicies);
router.post("/save", saveVerificationPolicies);

export default router;
