import express from "express";
import {
    createAssetCategory,
    getAssetCategories,
    updateAssetCategory,
    deleteAssetCategory,
} from "../Controllers/AssetCategoryCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.post("/", createAssetCategory);
router.get("/", getAssetCategories);
router.put("/:id", updateAssetCategory);
router.delete("/:id", deleteAssetCategory);

export default router;
