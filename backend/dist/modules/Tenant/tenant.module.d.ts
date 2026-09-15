import { PrismaTenantRepository } from "./infrastructure/prisma-tenant.repository.js";
import { GetTenantConfigurationUseCase } from "./application/get-tenant-configuration.usecase.js";
import { UpdateTenantConfigurationUseCase } from "./application/update-tenant-configuration.usecase.js";
import { GetSebConfigUseCase } from "./application/get-seb-config.usecase.js";
import { UpdateSebConfigUseCase } from "./application/update-seb-config.usecase.js";
import { TenantController } from "./presentation/tenant.controller.js";
import { SebConfigController } from "./presentation/seb-config.controller.js";
export declare const tenantRepository: PrismaTenantRepository;
export declare const getTenantConfigurationUseCase: GetTenantConfigurationUseCase;
export declare const updateTenantConfigurationUseCase: UpdateTenantConfigurationUseCase;
export declare const getSebConfigUseCase: GetSebConfigUseCase;
export declare const updateSebConfigUseCase: UpdateSebConfigUseCase;
export declare const tenantController: TenantController;
export declare const sebConfigController: SebConfigController;
//# sourceMappingURL=tenant.module.d.ts.map