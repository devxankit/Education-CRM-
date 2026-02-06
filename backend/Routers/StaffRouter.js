import express from "express";
import {
    createStaff,
    getStaffList,
    updateStaff,
    deleteStaff,
    loginStaff,
    getStaffPermissions,
    getStaffDashboard,
    getStaffProfile,
    changePassword,
    updateProfile
} from "../Controllers/StaffCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Public login route
router.post("/login", loginStaff);

// Authenticated Routes
router.use(AuthMiddleware);

// Get My Dashboard (Staff accessible)
router.get("/dashboard", getStaffDashboard);

// Get My Profile (Staff accessible)
router.get("/profile", getStaffProfile);

// Change My Password
router.post("/change-password", changePassword);

// Update My Profile (Pic, Banner, etc)
router.put("/update-profile", updateProfile);

// Get My Permissions (Staff accessible)
router.get("/permissions", getStaffPermissions);

// Protected routes (Only Institute can manage staff)
router.use(isInstitute);

router.post("/", createStaff);
router.get("/", getStaffList);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

export default router;
