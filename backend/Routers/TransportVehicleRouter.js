import express from "express";
import {
    createVehicle,
    getVehicles,
    updateVehicle,
    deleteVehicle,
} from "../Controllers/TransportVehicleCtrl.js";
import { AuthMiddleware, isAdmin, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);

// List vehicles - institute admin users
router.get("/", isInstitute, getVehicles);

// Manage vehicles - only institute users
router.post("/", isInstitute, createVehicle);
router.put("/:id", isInstitute, updateVehicle);
router.delete("/:id", isInstitute, deleteVehicle);

export default router;

