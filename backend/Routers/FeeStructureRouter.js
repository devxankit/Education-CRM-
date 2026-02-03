import express from "express";
import {
    createFeeStructure,
    getFeeStructures,
    updateFeeStructure,
    deleteFeeStructure,
} from "../Controllers/FeeStructureCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.post("/", createFeeStructure);
router.get("/", getFeeStructures);
router.put("/:id", updateFeeStructure);
router.delete("/:id", deleteFeeStructure);

export default router;
