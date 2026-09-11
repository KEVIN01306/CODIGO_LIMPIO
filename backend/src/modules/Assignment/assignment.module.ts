import { PrismaClient } from "@prisma/client";
import { PrismaCourseOfferingsRepository } from "./courseOffering/infrastructure/prisma-courseOffering.repository.js";
import { CreateCourseOfferingUseCase } from "./courseOffering/application/create-courseOffering.usecase.js";
import { UpdateCourseOfferingUseCase } from "./courseOffering/application/update-courseOffering.usecase.js";
import { ListCourseOfferingsUseCase } from "./courseOffering/application/list-courseOffering.usecase.js";
import { GetCourseOfferingUseCase } from "./courseOffering/application/get-courseOffering.usecase.js";
import { DeleteCourseOfferingUseCase } from "./courseOffering/application/delete-courseOffering.usecase.js";
import { CourseOfferingController } from "./courseOffering/presentation/courseOffering.controller.js";

import { PrismaCourseEnrollmentsRepository } from "./courseEnrollment/infrastructure/prisma-courseEnrollment.repository.js";
import { CreateCourseEnrollmentUseCase } from "./courseEnrollment/application/create-courseEnrollment.usecase.js";
import { UpdateCourseEnrollmentUseCase } from "./courseEnrollment/application/update-courseEnrollment.usecase.js";
import { ListCourseEnrollmentsUseCase } from "./courseEnrollment/application/list-courseEnrollment.usecase.js";
import { GetCourseEnrollmentUseCase } from "./courseEnrollment/application/get-courseEnrollment.usecase.js";
import { DeleteCourseEnrollmentUseCase } from "./courseEnrollment/application/delete-courseEnrollment.usecase.js";
import { CourseEnrollmentController } from "./courseEnrollment/presentation/courseEnrollment.controller.js";

import { createAuditLogUseCase } from "../Audit/audit.module.js";

const prisma = new PrismaClient();

export const courseOfferingsRepository = new PrismaCourseOfferingsRepository(prisma);
export const courseEnrollmentsRepository = new PrismaCourseEnrollmentsRepository(prisma);

export const createCourseOfferingUseCase = new CreateCourseOfferingUseCase(courseOfferingsRepository, createAuditLogUseCase);
export const updateCourseOfferingUseCase = new UpdateCourseOfferingUseCase(courseOfferingsRepository, createAuditLogUseCase);
export const listCourseOfferingsUseCase = new ListCourseOfferingsUseCase(courseOfferingsRepository);
export const getCourseOfferingUseCase = new GetCourseOfferingUseCase(courseOfferingsRepository);
export const deleteCourseOfferingUseCase = new DeleteCourseOfferingUseCase(courseOfferingsRepository, createAuditLogUseCase);

export const createCourseEnrollmentUseCase = new CreateCourseEnrollmentUseCase(courseEnrollmentsRepository, createAuditLogUseCase);
export const updateCourseEnrollmentUseCase = new UpdateCourseEnrollmentUseCase(courseEnrollmentsRepository, createAuditLogUseCase);
export const listCourseEnrollmentsUseCase = new ListCourseEnrollmentsUseCase(courseEnrollmentsRepository);
export const getCourseEnrollmentUseCase = new GetCourseEnrollmentUseCase(courseEnrollmentsRepository);
export const deleteCourseEnrollmentUseCase = new DeleteCourseEnrollmentUseCase(courseEnrollmentsRepository, createAuditLogUseCase);

export const courseOfferingController = new CourseOfferingController(
    createCourseOfferingUseCase,
    updateCourseOfferingUseCase,
    listCourseOfferingsUseCase,
    getCourseOfferingUseCase,
    deleteCourseOfferingUseCase
);

export const courseEnrollmentController = new CourseEnrollmentController(
    createCourseEnrollmentUseCase,
    updateCourseEnrollmentUseCase,
    listCourseEnrollmentsUseCase,
    getCourseEnrollmentUseCase,
    deleteCourseEnrollmentUseCase
);
