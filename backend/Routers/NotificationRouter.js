import express from "express";
import { sendCustomNotification } from "../Controllers/NotificationCtrl.js";
import {
    createNotificationRule,
    deleteNotificationRule,
    getNotificationRules,
    updateNotificationRule,
} from "../Controllers/NotificationRuleCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.get("/rules", getNotificationRules);
router.post("/rules", createNotificationRule);
router.put("/rules/:id", updateNotificationRule);
router.delete("/rules/:id", deleteNotificationRule);
router.post("/custom", sendCustomNotification);

export default router;

