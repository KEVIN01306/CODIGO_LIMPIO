import { Router } from "express";
import campusRoutes from "./campus/presentation/campus.routes.js";
import programRoutes from "./program/presentation/program.routes.js";
import cohortRoutes from "./cohort/presentation/cohort.routes.js";
import cycleRoutes from "./cycle/presentation/cycle.routes.js";
import courseRoutes from "./course/presentation/course.routes.js";

const router = Router();

router.use("/campuses", campusRoutes);
router.use("/programs", programRoutes);
router.use("/cohorts", cohortRoutes);
router.use("/cycles", cycleRoutes);
router.use("/courses", courseRoutes);

export default router;
