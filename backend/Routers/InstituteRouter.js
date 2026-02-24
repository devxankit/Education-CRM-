import express from "express";
import {
  registerInstitute,
  loginSuperAdmin,
  getInstituteDetails,
  updateInstituteDetails,
  updateInstituteBranding,
  changeInstitutePassword
} from "../Controllers/InstituteCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";
import { upload } from "../Helpers/cloudinaryHelper.js";

const router = express.Router();

// Register Institute
router.post("/register", registerInstitute);

// Login (SuperAdmin)
router.post("/login", loginSuperAdmin);

// Get Institute Details
router.get("/profile", AuthMiddleware, isInstitute, getInstituteDetails);

// Update Institute Details
router.put("/profile", AuthMiddleware, isInstitute, updateInstituteDetails);

// Change Institute Admin Password
router.post("/change-password", AuthMiddleware, isInstitute, changeInstitutePassword);

// Update Branding (Cloudinary Upload)
router.put(
  "/branding-v2",
  AuthMiddleware,
  isInstitute,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'letterheadHeader', maxCount: 1 },
    { name: 'letterheadFooter', maxCount: 1 }
  ]),
  updateInstituteBranding
);

export default router;
