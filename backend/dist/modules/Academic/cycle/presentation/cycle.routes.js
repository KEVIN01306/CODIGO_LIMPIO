import { Router } from "express";
import { academicCycleController } from "../../academic.module.js";
import { AuthMiddleware } from "../../../../app/middleware/Auth.middleware.js";
import { ValidatedMiddleware } from "../../../../app/middleware/Validated.middleware.js";
import { CreateAcademicCycleSchema, UpdateAcademicCycleSchema, AcademicCycleIdSchema } from "./academicCycle.schemas.js";
const router = Router();
const authMiddleware = new AuthMiddleware();
const validatedMiddleware = new ValidatedMiddleware();
router.use(authMiddleware.routeProtect);
router.get("/", authMiddleware.checkPermission(["cycles:read"]), academicCycleController.list);
router.get("/:id", authMiddleware.checkPermission(["cycles:read"]), validatedMiddleware.validateParams(AcademicCycleIdSchema), academicCycleController.getById);
router.post("/", authMiddleware.checkPermission(["cycles:create"]), validatedMiddleware.validateBody(CreateAcademicCycleSchema), academicCycleController.create);
router.put("/:id", authMiddleware.checkPermission(["cycles:update"]), validatedMiddleware.validateParams(AcademicCycleIdSchema), validatedMiddleware.validateBody(UpdateAcademicCycleSchema), academicCycleController.update);
router.delete("/:id", authMiddleware.checkPermission(["cycles:delete"]), validatedMiddleware.validateParams(AcademicCycleIdSchema), academicCycleController.delete);
export default router;
//# sourceMappingURL=cycle.routes.js.map