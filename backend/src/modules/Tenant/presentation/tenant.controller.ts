import type { Request, Response, NextFunction } from "express";
import ResponseHttp from "@app/http/response.http.js";
import BaseController from "@presentation/base.controller.js";
import type { GetTenantConfigurationUseCase } from "../application/get-tenant-configuration.usecase.js";
import type { UpdateTenantConfigurationUseCase } from "../application/update-tenant-configuration.usecase.js";

export class TenantController extends BaseController {
    constructor(
        private readonly getTenantConfigurationUseCase: GetTenantConfigurationUseCase,
        private readonly updateTenantConfigurationUseCase: UpdateTenantConfigurationUseCase
    ) {
        super();
    }

    getConfiguration = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { tenantId } = this.obtenerEntorno(res);
            const tenantConfig = await this.getTenantConfigurationUseCase.execute(tenantId);
            return res.status(200).json(ResponseHttp.success("Tenant configuration fetched successfully", tenantConfig));
        } catch (error) {
            next(error);
        }
    };

    updateConfiguration = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { tenantId } = this.obtenerEntorno(res);
            const updated = await this.updateTenantConfigurationUseCase.execute(tenantId, req.body);
            return res.status(200).json(ResponseHttp.success("Tenant configuration updated successfully", updated));
        } catch (error) {
            next(error);
        }
    };
}
