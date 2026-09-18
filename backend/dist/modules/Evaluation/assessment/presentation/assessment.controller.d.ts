import { Request, Response, NextFunction } from "express";
import BaseController from "../../../../presentation/base.controller.js";
import { CreateAssessmentUseCase } from "../application/create-assessment.usecase.js";
import { UpdateAssessmentUseCase } from "../application/update-assessment.usecase.js";
import { GetAssessmentUseCase } from "../application/get-assessment.usecase.js";
import { ListAssessmentsUseCase } from "../application/list-assessment.usecase.js";
import { DeleteAssessmentUseCase } from "../application/delete-assessment.usecase.js";
import { StartAssessmentUseCase } from "../application/start-assessment.usecase.js";
import type { TenantRepository } from "../../../Tenant/domain/tenant.repository.js";
import type { AssessmentRepository } from "../domain/assessment.repository.js";
export declare class AssessmentController extends BaseController {
    private readonly createUseCase;
    private readonly updateUseCase;
    private readonly getUseCase;
    private readonly listUseCase;
    private readonly deleteUseCase;
    private readonly startUseCase?;
    private readonly tenantRepository?;
    private readonly assessmentRepository?;
    constructor(createUseCase: CreateAssessmentUseCase, updateUseCase: UpdateAssessmentUseCase, getUseCase: GetAssessmentUseCase, listUseCase: ListAssessmentsUseCase, deleteUseCase: DeleteAssessmentUseCase, startUseCase?: StartAssessmentUseCase | undefined, tenantRepository?: TenantRepository | undefined, assessmentRepository?: AssessmentRepository | undefined);
    create: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    list: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    start: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getDefaultSebConfig: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=assessment.controller.d.ts.map