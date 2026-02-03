import express from "express";
import {
    getDocumentRule,
    saveDocumentRule,
    toggleDocumentLock,
} from "../Controllers/DocumentRuleCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.get("/", getDocumentRule);
router.post("/save", saveDocumentRule);
router.put("/:id/lock", toggleDocumentLock);

export default router;
