import express from "express";
import {
  registerInstitute,
  loginSuperAdmin,
  getInstituteDetails,
  updateInstituteDetails
} from "../Controllers/InstituteCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Register Institute
router.post("/register", registerInstitute);

// Login (SuperAdmin)
router.post("/login", loginSuperAdmin);

// Get Institute Details
router.get("/profile", AuthMiddleware, isInstitute, getInstituteDetails);

// Update Institute Details
router.put("/profile", AuthMiddleware, isInstitute, updateInstituteDetails);

export default router;
