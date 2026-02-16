import { Router } from "express";
import {
    saveChecklist,
    getChecklists,
    deleteChecklist,
    toggleChecklistStatus
} from "../Controllers/ChecklistCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.post("/save", saveChecklist);
router.get("/", getChecklists);
router.delete("/:id", deleteChecklist);
router.put("/:id/toggle", toggleChecklistStatus);

export default router;
