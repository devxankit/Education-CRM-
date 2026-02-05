import express from "express";
import {
    createAcademicYear,
    getAcademicYears,
    activateAcademicYear,
    closeAcademicYear,
    deleteAcademicYear
} from "../Controllers/AcademicYearCtrl.js";
import { AuthMiddleware, isAdmin } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isAdmin);

router.post("/", createAcademicYear);
router.get("/", getAcademicYears);
router.put("/activate/:id", activateAcademicYear);
router.put("/close/:id", closeAcademicYear);
router.delete("/:id", deleteAcademicYear);

export default router;
