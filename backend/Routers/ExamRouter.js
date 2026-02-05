import express from "express";
import {
    getExams,
    createExam,
    getExamById,
    updateExam,
    deleteExam
} from "../Controllers/ExamCtrl.js";
import { AuthMiddleware, isAdmin } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isAdmin);

router.get("/", getExams);
router.post("/", createExam);
router.get("/:id", getExamById);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

export default router;
