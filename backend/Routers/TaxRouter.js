import express from "express";
import {
    createTax,
    getTaxes,
    updateTax,
    deleteTax,
} from "../Controllers/TaxCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.post("/", createTax);
router.get("/", getTaxes);
router.put("/:id", updateTax);
router.delete("/:id", deleteTax);

export default router;
