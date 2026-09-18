import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaAssessmentRepository } from "../infrastructure/prisma-assessment.repository.js";
import { PrismaSubmissionRepository } from "../../submission/infrastructure/prisma-submission.repository.js";
import { PrismaTenantRepository } from "@modules/Tenant/infrastructure/prisma-tenant.repository.js";
import { PrismaStudentRepository } from "@modules/Users/infrastructure/prisma-student.repository.js";
import { PrismaCourseEnrollmentsRepository } from "@modules/Assignment/courseEnrollment/infrastructure/prisma-courseEnrollment.repository.js";
import { CreateAssessmentUseCase } from "../application/create-assessment.usecase.js";
import { UpdateAssessmentUseCase } from "../application/update-assessment.usecase.js";
import { GetAssessmentUseCase } from "../application/get-assessment.usecase.js";
import { ListAssessmentsUseCase } from "../application/list-assessment.usecase.js";
import { DeleteAssessmentUseCase } from "../application/delete-assessment.usecase.js";
import { StartAssessmentUseCase } from "../application/start-assessment.usecase.js";
import { AssessmentController } from "./assessment.controller.js";
import { ValidatedMiddleware } from "@app/middleware/Validated.middleware.js";
import { AuthMiddleware } from "@app/middleware/Auth.middleware.js";
import { MulterUploadProvider } from "@shared/infrastructure/multer.provider.js";
import { CloudflareR2Provider } from "@shared/infrastructure/cloudflare-r2.provider.js";
import { SebJwtProvider } from "@shared/infrastructure/seb-jwt.provider.js";
import { createAssessmentSchema, updateAssessmentSchema } from "./assessment.schemas.js";

const prisma = new PrismaClient();
const repository = new PrismaAssessmentRepository(prisma);
const submissionRepo = new PrismaSubmissionRepository(prisma);
const tenantRepository = new PrismaTenantRepository(prisma);
const studentRepo = new PrismaStudentRepository(prisma);
const enrollmentRepo = new PrismaCourseEnrollmentsRepository(prisma);
const storageProvider = new CloudflareR2Provider();
const sebJwtProvider = new SebJwtProvider();

const createUseCase = new CreateAssessmentUseCase(repository, storageProvider, tenantRepository);
const updateUseCase = new UpdateAssessmentUseCase(repository, storageProvider, tenantRepository);
const getUseCase = new GetAssessmentUseCase(repository);
const listUseCase = new ListAssessmentsUseCase(repository);
const deleteUseCase = new DeleteAssessmentUseCase(repository, storageProvider);
const startUseCase = new StartAssessmentUseCase(
    repository,
    submissionRepo,
    studentRepo,
    enrollmentRepo,
    tenantRepository,
    sebJwtProvider
);

const controller = new AssessmentController(
    createUseCase,
    updateUseCase,
    getUseCase,
    listUseCase,
    deleteUseCase,
    startUseCase,
    tenantRepository,
    repository
);



const router = Router();

const validatedMiddleware = new ValidatedMiddleware();
const authMiddleware = new AuthMiddleware();

router.use(authMiddleware.routeProtect);

router.post(
    "/",
    authMiddleware.checkPermission(["assessments:create"]),
    MulterUploadProvider.seb("sebConfigFile", false),
    validatedMiddleware.validateBody(createAssessmentSchema),
    controller.create
);

router.get(
    "/",
    authMiddleware.checkPermission(["assessments:read"]),
    controller.list
);

router.get(
    "/seb/default-config",
    authMiddleware.checkPermissionSome(["assessments:create", "assessments:read", "assessments:update"]),
    controller.getDefaultSebConfig
);

router.get(
    "/:id",
    authMiddleware.checkPermission(["assessments:read"]),
    controller.getById
);

router.post(
    "/:id/start",
    authMiddleware.checkPermission(["assessments:read"]),
    controller.start
);


router.put(
    "/:id",
    authMiddleware.checkPermission(["assessments:update"]),
    MulterUploadProvider.seb("sebConfigFile", false),
    validatedMiddleware.validateBody(updateAssessmentSchema),
    controller.update
);

router.delete(
    "/:id",
    authMiddleware.checkPermission(["assessments:delete"]),
    controller.delete
);

export { router as assessmentRoutes };
