import express from "express";
import {
    getAccessControlPolicies,
    updateAccessControlPolicies,
} from "../Controllers/AccessControlCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.get("/", getAccessControlPolicies);
router.put("/", updateAccessControlPolicies);

export default router;
