import express from "express";
import {
    createStaff,
    getStaffList,
    updateStaff,
    deleteStaff,
    loginStaff,
    verifyOtpStaff,
    forgotStaffPassword,
    resetStaffPasswordWithOtp,
    getStaffPermissions,
    getStaffDashboard,
    getStaffReports,
    getStaffProfile,
    getStaffFeeOverview,
    recordStaffFeePayment,
    getStaffPayrollResources,
    getStaffExpenseResources,
    getStaffBranches,
    getStaffTransportRoutes,
    getStaffTransportSummary,
    getStaffEmployees,
    getStaffTransportStudents,
    changePassword,
    updateProfile,
    sendFeeRemindersToParents
} from "../Controllers/StaffCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", loginStaff);
router.post("/verify-otp", verifyOtpStaff);
router.post("/forgot-password", forgotStaffPassword);
router.post("/reset-password", resetStaffPasswordWithOtp);

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
router.post("/fees/send-reminders", sendFeeRemindersToParents);
router.get("/payroll/resources", getStaffPayrollResources);
router.get("/expenses/resources", getStaffExpenseResources);
router.get("/branches", getStaffBranches);
router.get("/transport/routes", getStaffTransportRoutes);
router.get("/transport/summary", getStaffTransportSummary);
router.get("/transport/students", getStaffTransportStudents);
router.get("/employees", getStaffEmployees);

// Protected routes (Only Institute can manage staff)
router.use(isInstitute);

router.post("/", createStaff);
router.get("/", getStaffList);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

export default router;
