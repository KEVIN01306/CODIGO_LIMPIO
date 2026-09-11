import { Router } from "express";
import courseOfferingRoutes from "./courseOffering/presentation/courseOffering.routes.js";
import courseEnrollmentRoutes from "./courseEnrollment/presentation/courseEnrollment.routes.js";
const router = Router();
router.use("/offerings", courseOfferingRoutes);
router.use("/enrollments", courseEnrollmentRoutes);
export default router;
//# sourceMappingURL=assignment.routes.js.map