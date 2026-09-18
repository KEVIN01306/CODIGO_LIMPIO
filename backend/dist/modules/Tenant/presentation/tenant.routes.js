import { Router } from "express";
import { tenantController, sebConfigController } from "../tenant.module.js";
import { AuthMiddleware } from "../../../app/middleware/Auth.middleware.js";
import { ValidatedMiddleware } from "../../../app/middleware/Validated.middleware.js";
import { MulterUploadProvider } from "../../../shared/infrastructure/multer.provider.js";
import { UpdateTenantSchema, UpdateSebConfigSchema } from "./tenant.schemas.js";
const router = Router();
const authMiddleware = new AuthMiddleware();
const validatedMiddleware = new ValidatedMiddleware();
router.use(authMiddleware.routeProtect);
// Tenant Information
router.get("/configuration", authMiddleware.checkPermission(["tenant:read"]), tenantController.getConfiguration);
router.put("/configuration", authMiddleware.checkPermission(["tenant:update"]), validatedMiddleware.validateBody(UpdateTenantSchema), tenantController.updateConfiguration);
router.patch("/configuration", authMiddleware.checkPermission(["tenant:update"]), validatedMiddleware.validateBody(UpdateTenantSchema), tenantController.updateConfiguration);
// SEB Configuration
router.get("/configuration/seb", authMiddleware.checkPermissionSome(["tenant:read", "assessments:create", "assessments:update"]), sebConfigController.getSebConfig);
router.put("/configuration/seb", authMiddleware.checkPermission(["tenant:update"]), MulterUploadProvider.seb("file", false), validatedMiddleware.validateBody(UpdateSebConfigSchema), sebConfigController.updateSebConfig);
router.patch("/configuration/seb", authMiddleware.checkPermission(["tenant:update"]), MulterUploadProvider.seb("file", false), validatedMiddleware.validateBody(UpdateSebConfigSchema), sebConfigController.updateSebConfig);
export default router;
//# sourceMappingURL=tenant.routes.js.map