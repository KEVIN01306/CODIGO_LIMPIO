import { PrismaClient } from "@prisma/client";
import { PrismaTenantRepository } from "./infrastructure/prisma-tenant.repository.js";
import { GetTenantConfigurationUseCase } from "./application/get-tenant-configuration.usecase.js";
import { UpdateTenantConfigurationUseCase } from "./application/update-tenant-configuration.usecase.js";
import { GetSebConfigUseCase } from "./application/get-seb-config.usecase.js";
import { UpdateSebConfigUseCase } from "./application/update-seb-config.usecase.js";
import { TenantController } from "./presentation/tenant.controller.js";
import { SebConfigController } from "./presentation/seb-config.controller.js";
import { createAuditLogUseCase } from "../Audit/audit.module.js";

import { CloudflareR2Provider } from "@shared/infrastructure/cloudflare-r2.provider.js";

const prisma = new PrismaClient();
const storageProvider = new CloudflareR2Provider();

export const tenantRepository = new PrismaTenantRepository(prisma);

export const getTenantConfigurationUseCase = new GetTenantConfigurationUseCase(tenantRepository);
export const updateTenantConfigurationUseCase = new UpdateTenantConfigurationUseCase(tenantRepository, createAuditLogUseCase);
export const getSebConfigUseCase = new GetSebConfigUseCase(tenantRepository);
export const updateSebConfigUseCase = new UpdateSebConfigUseCase(tenantRepository, storageProvider, createAuditLogUseCase);

export const tenantController = new TenantController(
    getTenantConfigurationUseCase,
    updateTenantConfigurationUseCase
);

export const sebConfigController = new SebConfigController(
    getSebConfigUseCase,
    updateSebConfigUseCase
);
