import express from "express";
import {
    createRole,
    getRoles,
    updateRole,
    deleteRole,
    getPublicRoles
} from "../Controllers/RoleCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Public route to fetch roles (for login page)
router.get("/public", getPublicRoles);

router.use(AuthMiddleware);
router.use(isInstitute);

router.post("/", createRole);
router.get("/", getRoles);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);

export default router;
