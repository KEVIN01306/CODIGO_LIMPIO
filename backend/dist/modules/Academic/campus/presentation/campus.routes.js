import { Router } from "express";
import { campusController } from "../../academic.module.js";
import { AuthMiddleware } from "@app/middleware/Auth.middleware.js";
import { ValidatedMiddleware } from "@app/middleware/Validated.middleware.js";
import { CreateCampusSchema, UpdateCampusSchema, CampusIdSchema } from "./campus.schemas.js";
const router = Router();
const authMiddleware = new AuthMiddleware();
const validatedMiddleware = new ValidatedMiddleware();
router.use(authMiddleware.routeProtect);
router.get("/", authMiddleware.checkPermission(["campuses:read"]), campusController.list);
router.get("/:id", authMiddleware.checkPermission(["campuses:read"]), validatedMiddleware.validateParams(CampusIdSchema), campusController.getById);
router.post("/", authMiddleware.checkPermission(["campuses:create"]), validatedMiddleware.validateBody(CreateCampusSchema), campusController.create);
router.put("/:id", authMiddleware.checkPermission(["campuses:update"]), validatedMiddleware.validateParams(CampusIdSchema), validatedMiddleware.validateBody(UpdateCampusSchema), campusController.update);
router.delete("/:id", authMiddleware.checkPermission(["campuses:delete"]), validatedMiddleware.validateParams(CampusIdSchema), campusController.delete);
export default router;
//# sourceMappingURL=campus.routes.js.map