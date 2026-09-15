import type { Request, Response, NextFunction } from "express";
import BaseController from "../../../presentation/base.controller.js";
import type { GetTenantConfigurationUseCase } from "../application/get-tenant-configuration.usecase.js";
import type { UpdateTenantConfigurationUseCase } from "../application/update-tenant-configuration.usecase.js";
export declare class TenantController extends BaseController {
    private readonly getTenantConfigurationUseCase;
    private readonly updateTenantConfigurationUseCase;
    constructor(getTenantConfigurationUseCase: GetTenantConfigurationUseCase, updateTenantConfigurationUseCase: UpdateTenantConfigurationUseCase);
    getConfiguration: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    updateConfiguration: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=tenant.controller.d.ts.map