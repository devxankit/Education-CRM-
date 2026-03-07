import express from "express";
import {
    createClass,
    getClasses,
    updateClass,
    deleteClass,
    createSection,
    getSectionsByClass,
    updateSection,
    deleteSection,
    getSectionsForClassTeacherAssignment
} from "../Controllers/ClassCtrl.js";
import { AuthMiddleware, isAdmin } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isAdmin);

// Classes – static route before :id to avoid matching "class-teachers" as id
router.get("/class-teachers", getSectionsForClassTeacherAssignment);
router.post("/", createClass);
router.get("/", getClasses);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);

// Sections
router.post("/section", createSection);
router.get("/section/:classId", getSectionsByClass);
router.put("/section/:id", updateSection);
router.delete("/section/:id", deleteSection);

export default router;
