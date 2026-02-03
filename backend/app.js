import { Router } from "express";

import InstituteRouter from "./Routers/InstituteRouter.js";
import BranchRouter from "./Routers/BranchRouter.js";
import AcademicYearRouter from "./Routers/AcademicYearRouter.js";
import HolidayRouter from "./Routers/HolidayRouter.js";
import TimetableRuleRouter from "./Routers/TimetableRuleRouter.js";
import RoleRouter from "./Routers/RoleRouter.js";
import StaffRouter from "./Routers/StaffRouter.js";
import AccessControlRouter from "./Routers/AccessControlRouter.js";
import ClassRouter from "./Routers/ClassRouter.js";
import SubjectRouter from "./Routers/SubjectRouter.js";
import CourseRouter from "./Routers/CourseRouter.js";
import TeacherMappingRouter from "./Routers/TeacherMappingRouter.js";
import TeacherRouter from "./Routers/TeacherRouter.js";
import StudentRouter from "./Routers/StudentRouter.js";
import ParentRouter from "./Routers/ParentRouter.js";
import DepartmentRouter from "./Routers/DepartmentRouter.js";

const router = Router();

router.use("/api/v1/institute", InstituteRouter);
router.use("/api/v1/branch", BranchRouter);
router.use("/api/v1/academic-year", AcademicYearRouter);
router.use("/api/v1/holiday", HolidayRouter);
router.use("/api/v1/timetable-rule", TimetableRuleRouter);
router.use("/api/v1/role", RoleRouter);
router.use("/api/v1/staff", StaffRouter);
router.use("/api/v1/access-control", AccessControlRouter);
router.use("/api/v1/class", ClassRouter);
router.use("/api/v1/subject", SubjectRouter);
router.use("/api/v1/course", CourseRouter);
router.use("/api/v1/teacher-mapping", TeacherMappingRouter);
router.use("/api/v1/teacher", TeacherRouter);
router.use("/api/v1/student", StudentRouter);
router.use("/api/v1/parent", ParentRouter);
router.use("/api/v1/department", DepartmentRouter);

export default router;
