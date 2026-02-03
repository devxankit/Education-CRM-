import { Router } from "express";
import {
    saveChecklist,
    getChecklists,
    deleteChecklist,
    toggleChecklistStatus
} from "../Controllers/ChecklistCtrl.js";
import { verifyToken } from "../Middlewares/verifyToken.js";

const router = Router();

router.post("/save", verifyToken, saveChecklist);
router.get("/", verifyToken, getChecklists);
router.delete("/:id", verifyToken, deleteChecklist);
router.put("/:id/toggle", verifyToken, toggleChecklistStatus);

export default router;
