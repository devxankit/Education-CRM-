import express from "express";
import {
    createStaff,
    getStaffList,
    updateStaff,
    deleteStaff,
    loginStaff,
    verifyOtpStaff,
    getStaffPermissions,
    getStaffDashboard,
    getStaffReports,
    getStaffProfile,
    getStaffFeeOverview,
    recordStaffFeePayment,
    getStaffPayrollResources,
    getStaffExpenseResources,
    changePassword,
    updateProfile
} from "../Controllers/StaffCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", loginStaff);
router.post("/verify-otp", verifyOtpStaff);

// Authenticated Routes
router.use(AuthMiddleware);

// Get My Dashboard (Staff accessible)
router.get("/dashboard", getStaffDashboard);
router.get("/reports", getStaffReports);

// Get My Profile (Staff accessible)
router.get("/profile", getStaffProfile);

// Change My Password
router.post("/change-password", changePassword);

// Update My Profile (Pic, Banner, etc)
router.put("/update-profile", updateProfile);

// Get My Permissions (Staff accessible)
router.get("/permissions", getStaffPermissions);

// Get Fee Overview - Students with Paid/Due status (Staff/Accounts)
router.get("/fees/overview", getStaffFeeOverview);
router.post("/fees/collect", recordStaffFeePayment);
router.get("/payroll/resources", getStaffPayrollResources);
router.get("/expenses/resources", getStaffExpenseResources);

// Protected routes (Only Institute can manage staff)
router.use(isInstitute);

router.post("/", createStaff);
router.get("/", getStaffList);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

export default router;
