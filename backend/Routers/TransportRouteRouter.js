import express from "express";
import {
    createRoute,
    getRoutes,
    updateRoute,
    deleteRoute,
} from "../Controllers/TransportRouteCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.post("/", createRoute);
router.get("/", getRoutes);
router.put("/:id", updateRoute);
router.delete("/:id", deleteRoute);

export default router;
