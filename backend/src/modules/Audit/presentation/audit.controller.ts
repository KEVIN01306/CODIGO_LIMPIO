import type { Request, Response, NextFunction } from "express";
import ResponseHttp from "@app/http/response.http.js";
import type { ListAuditLogsUseCase } from "../application/list-audit-logs.usecase.js";
import BaseController from "@presentation/base.controller.js";

export class AuditController extends BaseController {
    constructor(private readonly listAuditLogsUseCase: ListAuditLogsUseCase) {
        super();
    }

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Uncomment the following line if this endpoint requires the user to be authenticated
            // const userCtx = this.obtenerEntorno(res);

            const logs = await this.listAuditLogsUseCase.execute();

            return res.status(200).json(
                ResponseHttp.success("Audit logs fetched successfully", logs)
            );
        } catch (error) {
            next(error);
        }
    }
}
