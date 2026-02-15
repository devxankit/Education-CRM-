import { Router } from "express";
import { getDashboardStats } from "../Controllers/DashboardCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.get("/", getDashboardStats);

export default router;
