import { Router } from "express";
import path from "path";
import express from "express";
import { ErrorMiddleware } from "@app/middleware/Error.middleware.js";
import AuthRoutes from "@modules/Auth/presentation/auth.routes.js";
import UsersRoutes from "@modules/Users/presentation/users.routes.js";
import TeachersRoutes from "@modules/Users/presentation/teachers.routes.js";
import StudentsRoutes from "@modules/Users/presentation/students.routes.js";
import AuditRoutes from "@modules/Audit/presentation/audit.routes.js";
import DashboardRoutes from "@modules/Dashboard/presentation/dashboard.routes.js";
import AcademicRoutes from "@modules/Academic/academic.routes.js";
import AssignmentRoutes from "@modules/Assignment/assignment.routes.js";
import { evaluationRoutes } from "../modules/Evaluation/evaluation.routes.js";
import { aiRoutes } from "../modules/AI/presentation/ai.routes.js";

const router = Router();


router.use('/auth', AuthRoutes);
router.use('/users/teachers', TeachersRoutes);
router.use('/users/students', StudentsRoutes);
router.use('/users', UsersRoutes);
router.use('/audit', AuditRoutes);
router.use('/dashboard', DashboardRoutes);
router.use('/academic', AcademicRoutes);
router.use('/assignments', AssignmentRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/ai', aiRoutes);

router.use(ErrorMiddleware)

export default router;
