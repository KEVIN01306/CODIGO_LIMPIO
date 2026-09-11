import type { Request, Response, NextFunction } from "express";
import BaseController from "@presentation/base.controller.js";
import type { GetDashboardSummaryUseCase } from "../application/get-dashboard-summary.usecase.js";
export declare class DashboardController extends BaseController {
    private readonly getDashboardSummaryUseCase;
    constructor(getDashboardSummaryUseCase: GetDashboardSummaryUseCase);
    summary: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=dashboard.controller.d.ts.map