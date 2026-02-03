import express from "express";
import {
    getSupportRule,
    saveSupportRule,
    toggleSupportLock,
} from "../Controllers/SupportRuleCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.get("/", getSupportRule);
router.post("/save", saveSupportRule);
router.put("/:id/lock", toggleSupportLock);

export default router;
