import type { Request, Response, NextFunction } from "express";
import ResponseHttp from "@app/http/response.http.js";
import BaseController from "@presentation/base.controller.js";
import type { GetDashboardSummaryUseCase } from "../application/get-dashboard-summary.usecase.js";

export class DashboardController extends BaseController {
    constructor(
        private readonly getDashboardSummaryUseCase: GetDashboardSummaryUseCase
    ) {
        super();
    }

    summary = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const summary = await this.getDashboardSummaryUseCase.execute(userId);
            return res.status(200).json(ResponseHttp.success("Dashboard summary fetched successfully", summary));
        } catch (error) {
            next(error);
        }
    }
}
