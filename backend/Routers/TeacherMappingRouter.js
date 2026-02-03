import express from "express";
import {
    assignTeacher,
    getMappings,
    removeMapping,
    removeMappingByContext
} from "../Controllers/TeacherMappingCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.post("/assign", assignTeacher);
router.get("/", getMappings);
router.delete("/:id", removeMapping);
router.post("/remove", removeMappingByContext);

export default router;
