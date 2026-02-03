import express from "express";
import {
    createTeacher,
    getTeachers,
    updateTeacher,
    loginTeacher
} from "../Controllers/TeacherCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Public login
router.post("/login", loginTeacher);

// Protected routes
router.use(AuthMiddleware);
router.use(isInstitute);

router.post("/", createTeacher);
router.get("/", getTeachers);
router.put("/:id", updateTeacher);

export default router;
