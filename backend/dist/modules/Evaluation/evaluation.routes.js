import { Router } from "express";
import { assessmentRoutes } from './assessment/presentation/assessment.routes.js';
import { submissionRoutes } from './submission/presentation/submission.routes.js';
export const evaluationRoutes = Router();
evaluationRoutes.use('/assessments', assessmentRoutes);
evaluationRoutes.use('/submissions', submissionRoutes);
//# sourceMappingURL=evaluation.routes.js.map