import express from "express";
import {
    createBranch,
    getBranches,
    getBranchById,
    updateBranch,
    deleteBranch
} from "../Controllers/BranchCtrl.js";
import { AuthMiddleware, isAdmin } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(AuthMiddleware);
router.use(isAdmin);

router.post("/", createBranch);
router.get("/", getBranches);
router.get("/:id", getBranchById);
router.put("/:id", updateBranch);
router.delete("/:id", deleteBranch);

export default router;
