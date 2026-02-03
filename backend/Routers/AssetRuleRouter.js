import express from "express";
import {
    getAssetRule,
    saveAssetRule,
    toggleAssetLock,
} from "../Controllers/AssetRuleCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.get("/", getAssetRule);
router.post("/save", saveAssetRule);
router.put("/:id/lock", toggleAssetLock);

export default router;
