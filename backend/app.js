import { Router } from "express";

import InstituteRouter from "./Routers/InstituteRouter.js";
import BranchRouter from "./Routers/BranchRouter.js";
import AcademicYearRouter from "./Routers/AcademicYearRouter.js";
import HolidayRouter from "./Routers/HolidayRouter.js";
import TimetableRuleRouter from "./Routers/TimetableRuleRouter.js";
import RoleRouter from "./Routers/RoleRouter.js";
import StaffRouter from "./Routers/StaffRouter.js";

const router = Router();

router.use("/api/v1/institute", InstituteRouter);
router.use("/api/v1/branch", BranchRouter);
router.use("/api/v1/academic-year", AcademicYearRouter);
router.use("/api/v1/holiday", HolidayRouter);
router.use("/api/v1/timetable-rule", TimetableRuleRouter);
router.use("/api/v1/role", RoleRouter);
router.use("/api/v1/staff", StaffRouter);

export default router;
