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
import { assessmentRoutes } from "../modules/Evaluation/assessment/presentation/assessment.routes.js";
import { aiRoutes } from "../modules/AI/presentation/ai.routes.js";
import TenantRoutes from "@modules/Tenant/presentation/tenant.routes.js";
import RolesRoutes from "@modules/Roles/presentation/roles.routes.js";
import { PrismaClient } from "@prisma/client";
import { CloudflareR2Provider } from "@shared/infrastructure/cloudflare-r2.provider.js";
import { SebJwtProvider } from "@shared/infrastructure/seb-jwt.provider.js";
import { SebDownloadController } from "../modules/Evaluation/assessment/presentation/seb-download.controller.js";

const sebPrisma = new PrismaClient();
const sebStorage = new CloudflareR2Provider();
const sebJwt = new SebJwtProvider();
const sebDownloadController = new SebDownloadController(sebJwt, sebStorage, sebPrisma);

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
router.use('/assessments', assessmentRoutes);
router.use('/ai', aiRoutes);
router.use('/tenant', TenantRoutes);
router.use('/roles', RolesRoutes);

// Safe Exam Browser configuration download endpoint
router.get('/seb/config', sebDownloadController.downloadConfig);

router.use(ErrorMiddleware)

export default router;

