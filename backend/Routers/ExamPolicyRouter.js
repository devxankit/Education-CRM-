import express from "express";
import {
    getExamPolicy,
    saveExamPolicy,
    unlockExamPolicy,
    lockExamPolicy
} from "../Controllers/ExamPolicyCtrl.js";
import { AuthMiddleware, isAdmin } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/", AuthMiddleware, isAdmin, getExamPolicy);
router.post("/", AuthMiddleware, isAdmin, saveExamPolicy);
router.post("/unlock", AuthMiddleware, isAdmin, unlockExamPolicy);
router.post("/lock", AuthMiddleware, isAdmin, lockExamPolicy);

export default router;
