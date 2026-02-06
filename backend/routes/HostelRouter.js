import express from "express";
import { createHostel, getHostels, getHostelById, updateHostel, deleteHostel } from "../Controllers/HostelCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/", AuthMiddleware, isInstitute, createHostel);
router.get("/", AuthMiddleware, getHostels);
router.get("/:id", AuthMiddleware, getHostelById);
router.put("/:id", AuthMiddleware, isInstitute, updateHostel);
router.delete("/:id", AuthMiddleware, isInstitute, deleteHostel);

export default router;
