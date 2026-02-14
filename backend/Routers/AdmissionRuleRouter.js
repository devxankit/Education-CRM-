import express from "express";
import {
    getAdmissionRule,
    saveAdmissionRule,
    toggleAdmissionLock,
} from "../Controllers/AdmissionRuleCtrl.js";
import { AuthMiddleware, isInstitute, isAdmin } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.get("/", isAdmin, getAdmissionRule);  // Institute + Staff can read
router.post("/save", isInstitute, saveAdmissionRule);
router.put("/:id/lock", isInstitute, toggleAdmissionLock);

export default router;
