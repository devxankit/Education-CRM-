import express from "express";
import {
    createDriver,
    getDrivers,
    getDriverDetails,
    updateDriver,
    deleteDriver,
} from "../Controllers/TransportDriverCtrl.js";
import { AuthMiddleware, isAdmin, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);

// List drivers - allow both institute and staff (isAdmin)
router.get("/", isAdmin, getDrivers);
router.get("/:id", isAdmin, getDriverDetails);

// Manage drivers - only institute users
router.post("/", isInstitute, createDriver);
router.put("/:id", isInstitute, updateDriver);
router.delete("/:id", isInstitute, deleteDriver);

export default router;

