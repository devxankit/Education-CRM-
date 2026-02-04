import express from "express";
import {
    createParent,
    getParents,
    updateParent,
    loginParent,
    getLinkedStudents,
    linkStudent,
    unlinkStudent
} from "../Controllers/ParentCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Public login
router.post("/login", loginParent);

// Protected routes
router.use(AuthMiddleware);
router.use(isInstitute);

router.post("/", createParent);
router.get("/", getParents);
router.put("/:id", updateParent);

// Student Linking
router.get("/:parentId/linked-students", getLinkedStudents);
router.post("/:parentId/link-student", linkStudent);
router.delete("/:parentId/unlink-student", unlinkStudent);

export default router;
