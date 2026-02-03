import express from "express";
import {
    createNotice,
    getNotices,
    updateNotice,
    deleteNotice,
} from "../Controllers/NoticeCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.post("/", createNotice);
router.get("/", getNotices);
router.put("/:id", updateNotice);
router.delete("/:id", deleteNotice);

export default router;
