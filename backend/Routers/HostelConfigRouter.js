import express from "express";
import {
    getHostelConfig,
    saveHostelConfig,
    toggleHostelLock,
} from "../Controllers/HostelConfigCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.get("/", getHostelConfig);
router.post("/save", saveHostelConfig);
router.put("/:id/lock", toggleHostelLock);

export default router;
