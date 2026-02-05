import express from "express";
import {
    upsertTimetable,
    getTimetable,
    deleteTimetable
} from "../Controllers/TimetableCtrl.js";
import { AuthMiddleware, isAdmin } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);

router.get("/", getTimetable);
router.post("/", isAdmin, upsertTimetable);
router.delete("/:id", isAdmin, deleteTimetable);

export default router;
