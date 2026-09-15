import type { Request, Response, NextFunction } from "express";
import ResponseHttp from "@app/http/response.http.js";
import BaseController from "@presentation/base.controller.js";
import type { GetRolesMatrixUseCase } from "../application/get-roles-matrix.usecase.js";

export class RolesController extends BaseController {
    constructor(
        private readonly getRolesMatrixUseCase: GetRolesMatrixUseCase
    ) {
        super();
    }

    getMatrix = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { tenantId } = this.obtenerEntorno(res);
            const matrix = await this.getRolesMatrixUseCase.execute(tenantId);
            res.status(200).json(ResponseHttp.success("Roles and permissions matrix fetched successfully", matrix));
        } catch (error) {
            next(error);
        }
    };
}
