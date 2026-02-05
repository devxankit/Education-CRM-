import express from "express";
import {
    getFeePolicy,
    saveFeePolicy,
    togglePolicyLock,
} from "../Controllers/FeePolicyCtrl.js";
import { AuthMiddleware, isAdmin } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isAdmin);

router.get("/", getFeePolicy);
router.post("/save", saveFeePolicy);
router.put("/:id/lock", togglePolicyLock);

export default router;
