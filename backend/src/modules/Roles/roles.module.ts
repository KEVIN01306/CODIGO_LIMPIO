import { PrismaClient } from "@prisma/client";
import { PrismaRolesRepository } from "./infrastructure/prisma-roles.repository.js";
import { GetRolesMatrixUseCase } from "./application/get-roles-matrix.usecase.js";
import { RolesController } from "./presentation/roles.controller.js";

const prisma = new PrismaClient();

export const rolesRepository = new PrismaRolesRepository(prisma);
export const getRolesMatrixUseCase = new GetRolesMatrixUseCase(rolesRepository);
export const rolesController = new RolesController(getRolesMatrixUseCase);
