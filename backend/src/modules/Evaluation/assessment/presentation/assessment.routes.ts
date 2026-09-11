import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaAssessmentRepository } from "../infrastructure/prisma-assessment.repository.js";
import { CreateAssessmentUseCase } from "../application/create-assessment.usecase.js";
import { UpdateAssessmentUseCase } from "../application/update-assessment.usecase.js";
import { GetAssessmentUseCase } from "../application/get-assessment.usecase.js";
import { ListAssessmentsUseCase } from "../application/list-assessment.usecase.js";
import { DeleteAssessmentUseCase } from "../application/delete-assessment.usecase.js";
import { AssessmentController } from "./assessment.controller.js";
import { ValidatedMiddleware } from "@app/middleware/Validated.middleware.js";
import { AuthMiddleware } from "@app/middleware/Auth.middleware.js";
import { createAssessmentSchema, updateAssessmentSchema } from "./assessment.schemas.js";

const prisma = new PrismaClient();
const repository = new PrismaAssessmentRepository(prisma);

const createUseCase = new CreateAssessmentUseCase(repository);
const updateUseCase = new UpdateAssessmentUseCase(repository);
const getUseCase = new GetAssessmentUseCase(repository);
const listUseCase = new ListAssessmentsUseCase(repository);
const deleteUseCase = new DeleteAssessmentUseCase(repository);

const controller = new AssessmentController(
    createUseCase,
    updateUseCase,
    getUseCase,
    listUseCase,
    deleteUseCase
);

const router = Router();



const validatedMiddleware = new ValidatedMiddleware()
const authMiddleware = new AuthMiddleware();


router.use(authMiddleware.routeProtect);

router.post(
    "/",
    authMiddleware.checkPermission(["assessments:create"]),
    validatedMiddleware.validateBody(createAssessmentSchema),
    controller.create
);

router.get(
    "/",
    authMiddleware.checkPermission(["assessments:read"]),
    controller.list
);

router.get(
    "/:id",
    authMiddleware.checkPermission(["assessments:read"]),
    controller.getById
);

router.put(
    "/:id",
    authMiddleware.checkPermission(["assessments:update"]),
    validatedMiddleware.validateBody(updateAssessmentSchema),
    controller.update
);

router.delete(
    "/:id",
    authMiddleware.checkPermission(["assessments:delete"]),
    controller.delete
);

export { router as assessmentRoutes };
