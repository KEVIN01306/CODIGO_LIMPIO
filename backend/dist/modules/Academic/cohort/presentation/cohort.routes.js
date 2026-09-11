import { Router } from "express";
import { cohortController } from "../../academic.module.js";
import { AuthMiddleware } from "@app/middleware/Auth.middleware.js";
import { ValidatedMiddleware } from "@app/middleware/Validated.middleware.js";
import { CreateCohortSchema, UpdateCohortSchema, CohortIdSchema } from "./cohort.schemas.js";
const router = Router();
const authMiddleware = new AuthMiddleware();
const validatedMiddleware = new ValidatedMiddleware();
router.use(authMiddleware.routeProtect);
router.get("/", authMiddleware.checkPermission(["cohorts:read"]), cohortController.list);
router.get("/:id", authMiddleware.checkPermission(["cohorts:read"]), validatedMiddleware.validateParams(CohortIdSchema), cohortController.getById);
router.post("/", authMiddleware.checkPermission(["cohorts:create"]), validatedMiddleware.validateBody(CreateCohortSchema), cohortController.create);
router.put("/:id", authMiddleware.checkPermission(["cohorts:update"]), validatedMiddleware.validateParams(CohortIdSchema), validatedMiddleware.validateBody(UpdateCohortSchema), cohortController.update);
router.delete("/:id", authMiddleware.checkPermission(["cohorts:delete"]), validatedMiddleware.validateParams(CohortIdSchema), cohortController.delete);
export default router;
//# sourceMappingURL=cohort.routes.js.map