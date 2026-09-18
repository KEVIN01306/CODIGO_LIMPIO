import { Request, Response, NextFunction } from "express";
import ResponseHttp from "@app/http/response.http.js";
import BaseController from "@presentation/base.controller.js";
import { CreateAssessmentUseCase } from "../application/create-assessment.usecase.js";
import { UpdateAssessmentUseCase } from "../application/update-assessment.usecase.js";
import { GetAssessmentUseCase } from "../application/get-assessment.usecase.js";
import { ListAssessmentsUseCase } from "../application/list-assessment.usecase.js";
import { DeleteAssessmentUseCase } from "../application/delete-assessment.usecase.js";
import { StartAssessmentUseCase } from "../application/start-assessment.usecase.js";
import type { TenantRepository } from "@modules/Tenant/domain/tenant.repository.js";
import type { AssessmentRepository } from "../domain/assessment.repository.js";

export class AssessmentController extends BaseController {
    constructor(
        private readonly createUseCase: CreateAssessmentUseCase,
        private readonly updateUseCase: UpdateAssessmentUseCase,
        private readonly getUseCase: GetAssessmentUseCase,
        private readonly listUseCase: ListAssessmentsUseCase,
        private readonly deleteUseCase: DeleteAssessmentUseCase,
        private readonly startUseCase?: StartAssessmentUseCase,
        private readonly tenantRepository?: TenantRepository,
        private readonly assessmentRepository?: AssessmentRepository
    ) { super(); }




    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { tenantId } = this.obtenerEntorno(res);
            const data = req.body;
            const entity = await this.createUseCase.execute(data, req.file, tenantId);
            return res.status(201).json(ResponseHttp.success("Assessment created successfully", entity));
        } catch (error) { next(error); }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { tenantId } = this.obtenerEntorno(res);
            const id = req.params.id as string;
            const data = req.body;
            const entity = await this.updateUseCase.execute(id, data, req.file, tenantId);
            return res.status(200).json(ResponseHttp.success("Assessment updated successfully", entity));
        } catch (error) { next(error); }
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const entity = await this.getUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("Assessment fetched successfully", entity));
        } catch (error) { next(error); }
    }

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = parseInt(req.query.offset as string) || 0;
            const page = Math.floor(offset / limit) + 1;

            const result = await this.listUseCase.execute(page, limit, req.query);
            return res.status(200).json(
                ResponseHttp.pagination('Assessments retrieved successfully', result.data, result.total, limit, offset)
            );
        } catch (error) { next(error); }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            await this.deleteUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("Assessment deleted successfully", null));
        } catch (error) { next(error); }
    }

    start = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id: userId } = this.obtenerEntorno(res);
            const id = req.params.id as string;
            if (!this.startUseCase) {
                throw new Error("StartAssessmentUseCase is not initialized");
            }
            const result = await this.startUseCase.execute(id, userId);
            return res.status(200).json(ResponseHttp.success("Assessment started successfully", result));
        } catch (error) { next(error); }
    }

    getDefaultSebConfig = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { tenantId } = this.obtenerEntorno(res);
            const offeringId = req.query.offeringId as string | undefined;

            let targetTenantId = tenantId;
            if (offeringId && this.assessmentRepository) {
                const offeringTenantId = await this.assessmentRepository.getOfferingTenantId(offeringId);
                if (offeringTenantId) {
                    targetTenantId = offeringTenantId;
                }
            }

            if (!targetTenantId || !this.tenantRepository) {
                return res.status(200).json(ResponseHttp.success("SEB default config checked", {
                    hasDefaultSeb: false,
                    defaultSebConfigKey: null,
                    defaultSebConfigFilePath: null
                }));
            }

            let tenant = await this.tenantRepository.findById(targetTenantId);
            let hasDefaultSeb = Boolean(tenant?.defaultSebConfigKey?.trim() && tenant?.defaultSebConfigFilePath?.trim());

            if (!hasDefaultSeb && tenantId && tenantId !== targetTenantId) {
                const userTenant = await this.tenantRepository.findById(tenantId);
                if (userTenant?.defaultSebConfigKey?.trim() && userTenant?.defaultSebConfigFilePath?.trim()) {
                    tenant = userTenant;
                    hasDefaultSeb = true;
                }
            }

            return res.status(200).json(ResponseHttp.success("SEB default config fetched", {
                hasDefaultSeb,
                defaultSebConfigKey: tenant?.defaultSebConfigKey || null,
                defaultSebConfigFilePath: tenant?.defaultSebConfigFilePath || null
            }));
        } catch (error) { next(error); }
    }
}


