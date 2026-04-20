import express from "express";
import { getFeeManagementStatus } from "../Controllers/FeeManagementCtrl.js";
import { AuthMiddleware, isAdmin } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isAdmin);

router.get("/status", getFeeManagementStatus);

export default router;
