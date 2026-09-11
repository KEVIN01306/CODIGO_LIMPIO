import type { Request, Response, NextFunction } from "express";
import type { ListAuditLogsUseCase } from "../application/list-audit-logs.usecase.js";
import BaseController from "@presentation/base.controller.js";
export declare class AuditController extends BaseController {
    private readonly listAuditLogsUseCase;
    constructor(listAuditLogsUseCase: ListAuditLogsUseCase);
    list: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=audit.controller.d.ts.map