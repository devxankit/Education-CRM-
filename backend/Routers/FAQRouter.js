import { Router } from "express";
import { AuthMiddleware } from "../Middlewares/AuthMiddleware.js";
import {
    createFAQ,
    getFAQs,
    getPublicFAQs,
    updateFAQ,
    deleteFAQ,
} from "../Controllers/FAQCtrl.js";

const router = Router();

// Admin routes (require auth)
router.get("/", AuthMiddleware, getFAQs);
router.post("/", AuthMiddleware, createFAQ);
router.put("/:id", AuthMiddleware, updateFAQ);
router.delete("/:id", AuthMiddleware, deleteFAQ);

// Public for authenticated users (Teacher, Student, Parent)
router.get("/public", AuthMiddleware, getPublicFAQs);

export default router;
