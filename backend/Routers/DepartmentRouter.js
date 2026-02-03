import express from "express";
import {
    createDepartment,
    getDepartments,
    updateDepartment,
    deleteDepartment,
} from "../Controllers/DepartmentCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.post("/", createDepartment);
router.get("/", getDepartments);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;
