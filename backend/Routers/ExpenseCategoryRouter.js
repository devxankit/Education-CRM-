import express from "express";
import {
    createExpenseCategory,
    getExpenseCategories,
    updateExpenseCategory,
    deleteExpenseCategory,
} from "../Controllers/ExpenseCategoryCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.post("/", createExpenseCategory);
router.get("/", getExpenseCategories);
router.put("/:id", updateExpenseCategory);
router.delete("/:id", deleteExpenseCategory);

export default router;
