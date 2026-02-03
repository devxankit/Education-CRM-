import express from "express";
import {
    createStaff,
    getStaffList,
    updateStaff,
    deleteStaff,
    loginStaff
} from "../Controllers/StaffCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Public login route
router.post("/login", loginStaff);

// Protected routes (Only Institute can manage staff)
router.use(AuthMiddleware);
router.use(isInstitute);

router.post("/", createStaff);
router.get("/", getStaffList);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

export default router;
