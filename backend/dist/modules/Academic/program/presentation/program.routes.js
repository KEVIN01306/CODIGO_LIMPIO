import { Router } from "express";
import { academicProgramController } from "../../academic.module.js";
import { AuthMiddleware } from "../../../../app/middleware/Auth.middleware.js";
import { ValidatedMiddleware } from "../../../../app/middleware/Validated.middleware.js";
import { CreateAcademicProgramSchema, UpdateAcademicProgramSchema, AcademicProgramIdSchema } from "./academicProgram.schemas.js";
const router = Router();
const authMiddleware = new AuthMiddleware();
const validatedMiddleware = new ValidatedMiddleware();
router.use(authMiddleware.routeProtect);
router.get("/", authMiddleware.checkPermission(["programs:read"]), academicProgramController.list);
router.get("/:id", authMiddleware.checkPermission(["programs:read"]), validatedMiddleware.validateParams(AcademicProgramIdSchema), academicProgramController.getById);
router.post("/", authMiddleware.checkPermission(["programs:create"]), validatedMiddleware.validateBody(CreateAcademicProgramSchema), academicProgramController.create);
router.put("/:id", authMiddleware.checkPermission(["programs:update"]), validatedMiddleware.validateParams(AcademicProgramIdSchema), validatedMiddleware.validateBody(UpdateAcademicProgramSchema), academicProgramController.update);
router.delete("/:id", authMiddleware.checkPermission(["programs:delete"]), validatedMiddleware.validateParams(AcademicProgramIdSchema), academicProgramController.delete);
export default router;
//# sourceMappingURL=program.routes.js.map