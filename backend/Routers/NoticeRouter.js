import express from "express";
import {
    createNotice,
    getNotices,
    getNoticeStats,
    updateNotice,
    deleteNotice,
    getStaffNotices
} from "../Controllers/NoticeCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);

// Staff/Teacher specific route
router.get("/my-notices", getStaffNotices);

// Management only routes
router.use(isInstitute);

router.post("/", createNotice);
router.get("/", getNotices);
router.get("/stats", getNoticeStats);
router.put("/:id", updateNotice);
router.delete("/:id", deleteNotice);

export default router;
