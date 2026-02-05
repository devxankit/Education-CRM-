import express from "express";
import {
    createClass,
    getClasses,
    updateClass,
    createSection,
    getSectionsByClass,
    updateSection
} from "../Controllers/ClassCtrl.js";
import { AuthMiddleware, isAdmin } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isAdmin);

// Classes
router.post("/", createClass);
router.get("/", getClasses);
router.put("/:id", updateClass);

// Sections
router.post("/section", createSection);
router.get("/section/:classId", getSectionsByClass);
router.put("/section/:id", updateSection);

export default router;
