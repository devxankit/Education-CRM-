import express from "express";
import {
    getTimetableRules,
    updateTimetableRules,
    toggleTimetableLock
} from "../Controllers/TimetableRuleCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.get("/", getTimetableRules);
router.put("/", updateTimetableRules);
router.put("/lock", toggleTimetableLock);

export default router;
