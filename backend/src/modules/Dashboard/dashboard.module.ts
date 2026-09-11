import { GetDashboardSummaryUseCase } from "./application/get-dashboard-summary.usecase.js";
import { DashboardController } from "./presentation/dashboard.controller.js";

export const getDashboardSummaryUseCase = new GetDashboardSummaryUseCase();
export const dashboardController = new DashboardController(getDashboardSummaryUseCase);
