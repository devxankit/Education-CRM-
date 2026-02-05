import express from "express";
import {
    createStaff,
    getStaffList,
    updateStaff,
    deleteStaff,
    loginStaff,
    getStaffPermissions
} from "../Controllers/StaffCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Public login route
router.post("/login", loginStaff);

// Authenticated Routes
router.use(AuthMiddleware);

// Get My Permissions (Staff accessible)
router.get("/permissions", getStaffPermissions);

// Protected routes (Only Institute can manage staff)
router.use(isInstitute);

router.post("/", createStaff);
router.get("/", getStaffList);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

export default router;
