import express from "express";
import {
    getExamPolicy,
    saveExamPolicy,
    unlockExamPolicy,
    lockExamPolicy
} from "../Controllers/ExamPolicyCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/", AuthMiddleware, isInstitute, getExamPolicy);
router.post("/", AuthMiddleware, isInstitute, saveExamPolicy);
router.post("/unlock", AuthMiddleware, isInstitute, unlockExamPolicy);
router.post("/lock", AuthMiddleware, isInstitute, lockExamPolicy);

export default router;
