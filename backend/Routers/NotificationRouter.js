import express from "express";
import { sendCustomNotification } from "../Controllers/NotificationCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.post("/custom", sendCustomNotification);

export default router;

