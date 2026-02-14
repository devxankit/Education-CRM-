import express from "express";
import {
    createPayroll,
    getPayrolls,
    getPayroll,
    updatePayroll,
    deletePayroll
} from "../Controllers/PayrollCtrl.js";
import { AuthMiddleware, isAdmin } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// All routes require authentication (Institute + Staff with accounts access)
router.use(AuthMiddleware);
router.use(isAdmin);

// Routes
router.post("/", createPayroll);
router.get("/", getPayrolls);
router.get("/:id", getPayroll);
router.put("/:id", updatePayroll);
router.delete("/:id", deletePayroll);

export default router;
