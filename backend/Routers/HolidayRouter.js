import express from "express";
import {
    createHoliday,
    getHolidays,
    updateHoliday,
    deleteHoliday
} from "../Controllers/HolidayCtrl.js";
import { AuthMiddleware, isInstitute } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(AuthMiddleware);
router.use(isInstitute);

router.post("/", createHoliday);
router.get("/", getHolidays);
router.put("/:id", updateHoliday);
router.delete("/:id", deleteHoliday);

export default router;
