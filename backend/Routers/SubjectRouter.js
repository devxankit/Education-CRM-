import express from "express";
import {
    createSubject,
    getSubjects,
    updateSubject,
    deleteSubject
} from "../Controllers/SubjectCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.post("/", createSubject);
router.get("/", getSubjects);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

export default router;
