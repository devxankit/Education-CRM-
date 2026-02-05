import express from "express";
import {
    createParent,
    getParents,
    updateParent,
    loginParent,
    getLinkedStudents,
    linkStudent,
    unlinkStudent,
    // Parent Portal APIs
    getParentDashboard,
    getChildAttendance,
    getChildHomework,
    getChildFees,
    getParentNotices,
    getChildExamResults,
    getChildTeachers,
    getParentProfile,
    updateParentProfile,
    acknowledgeNotice,
    getChildDocuments,
    payChildFee,
    changeParentPassword
} from "../Controllers/ParentCtrl.js";
import { AuthMiddleware, isAdmin, isParent } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// ====================================
// PUBLIC ROUTES
// ====================================
router.post("/login", loginParent);

// ====================================
// ADMIN/INSTITUTE ROUTES (for managing parents)
// ====================================
router.post("/", AuthMiddleware, isAdmin, createParent);
router.get("/", AuthMiddleware, isAdmin, getParents);
router.put("/:id", AuthMiddleware, isAdmin, updateParent);

// Student Linking (Admin & Parent)
router.get("/:parentId/linked-students", AuthMiddleware, getLinkedStudents);
router.post("/:parentId/link-student", AuthMiddleware, isAdmin, linkStudent);
router.delete("/:parentId/unlink-student", AuthMiddleware, isAdmin, unlinkStudent);

// ====================================
// PARENT PORTAL APIs (for logged-in parents)
// ====================================
router.get("/portal/dashboard", AuthMiddleware, isParent, getParentDashboard);
router.get("/portal/profile", AuthMiddleware, isParent, getParentProfile);
router.put("/portal/profile", AuthMiddleware, isParent, updateParentProfile);
router.get("/portal/notices", AuthMiddleware, isParent, getParentNotices);

// Child-specific routes
router.get("/portal/child/:studentId/attendance", AuthMiddleware, isParent, getChildAttendance);
router.get("/portal/child/:studentId/homework", AuthMiddleware, isParent, getChildHomework);
router.get("/portal/child/:studentId/fees", AuthMiddleware, isParent, getChildFees);
router.get("/portal/child/:studentId/exams", AuthMiddleware, isParent, getChildExamResults);
router.get("/portal/child/:studentId/teachers", AuthMiddleware, isParent, getChildTeachers);
router.get("/portal/child/:studentId/documents", AuthMiddleware, isParent, getChildDocuments);
router.post("/portal/child/:studentId/pay-fee", AuthMiddleware, isParent, payChildFee);

router.post("/portal/notices/:noticeId/acknowledge", AuthMiddleware, isParent, acknowledgeNotice);
router.post("/portal/change-password", AuthMiddleware, isParent, changeParentPassword);

export default router;
