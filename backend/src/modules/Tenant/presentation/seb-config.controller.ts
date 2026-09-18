import type { Request, Response, NextFunction } from "express";
import ResponseHttp from "@app/http/response.http.js";
import BaseController from "@presentation/base.controller.js";
import type { GetSebConfigUseCase } from "../application/get-seb-config.usecase.js";
import type { UpdateSebConfigUseCase } from "../application/update-seb-config.usecase.js";

export class SebConfigController extends BaseController {
    constructor(
        private readonly getSebConfigUseCase: GetSebConfigUseCase,
        private readonly updateSebConfigUseCase: UpdateSebConfigUseCase
    ) {
        super();
    }

    getSebConfig = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { tenantId } = this.obtenerEntorno(res);
            const sebConfig = await this.getSebConfigUseCase.execute(tenantId);
            return res.status(200).json(ResponseHttp.success("SEB configuration fetched successfully", sebConfig));
        } catch (error) {
            next(error);
        }
    };

    updateSebConfig = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { tenantId } = this.obtenerEntorno(res);
            const defaultSebConfigKey = req.body.defaultSebConfigKey !== undefined ? req.body.defaultSebConfigKey : null;
            const updated = await this.updateSebConfigUseCase.execute(
                tenantId,
                { defaultSebConfigKey },
                req.file
            );
            return res.status(200).json(ResponseHttp.success("SEB configuration updated successfully", updated));
        } catch (error) {
            next(error);
        }
    };
}
