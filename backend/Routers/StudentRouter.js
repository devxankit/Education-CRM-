import express from "express";
import {
    admitStudent,
    getStudents,
    updateStudent,
    loginStudent
} from "../Controllers/StudentCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Public login
router.post("/login", loginStudent);

// Protected routes
router.use(AuthMiddleware);
router.use(isInstitute);

router.post("/admit", admitStudent);
router.get("/", getStudents);
router.put("/:id", updateStudent);

export default router;
