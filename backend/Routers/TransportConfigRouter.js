import express from "express";
import {
    getTransportConfig,
    saveTransportConfig,
    toggleTransportLock,
} from "../Controllers/TransportConfigCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.get("/", getTransportConfig);
router.post("/save", saveTransportConfig);
router.put("/:id/lock", toggleTransportLock);

export default router;
