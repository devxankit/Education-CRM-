import express from "express";
import {
    getAdmissionRule,
    saveAdmissionRule,
    toggleAdmissionLock,
} from "../Controllers/AdmissionRuleCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.get("/", getAdmissionRule);
router.post("/save", saveAdmissionRule);
router.put("/:id/lock", toggleAdmissionLock);

export default router;
