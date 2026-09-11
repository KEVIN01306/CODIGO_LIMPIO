import { Router } from "express";
import { AuthMiddleware } from "../../../app/middleware/Auth.middleware.js";
import { dashboardController } from "../dashboard.module.js";

const dashboardRoutes = Router();
const authMiddleware = new AuthMiddleware();

dashboardRoutes.use(authMiddleware.routeProtect);

dashboardRoutes.get("/summary", dashboardController.summary);

export default dashboardRoutes;
