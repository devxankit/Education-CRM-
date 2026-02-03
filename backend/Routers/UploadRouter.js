import express from "express";
import { uploadSingleFile, uploadMultipleFiles } from "../Controllers/UploadCtrl.js";
import { upload } from "../Helpers/cloudinaryHelper.js";
import { AuthMiddleware } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// General upload routes
router.post("/single", AuthMiddleware, upload.single("file"), uploadSingleFile);
router.post("/multiple", AuthMiddleware, upload.array("files", 10), uploadMultipleFiles);

export default router;
