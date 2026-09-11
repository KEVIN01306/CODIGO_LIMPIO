import type { Request, Response, NextFunction } from "express";
import ResponseHttp from "@app/http/response.http.js";
import BaseController from "@presentation/base.controller.js";
import type { CreateCohortUseCase } from "../../cohort/application/create-cohort.usecase.js";
import type { UpdateCohortUseCase } from "../../cohort/application/update-cohort.usecase.js";
import type { ListCohortsUseCase } from "../../cohort/application/list-cohort.usecase.js";
import type { GetCohortUseCase } from "../../cohort/application/get-cohort.usecase.js";
import type { DeleteCohortUseCase } from "../../cohort/application/delete-cohort.usecase.js";

export class CohortController extends BaseController {
    constructor(
        private readonly createCohortUseCase: CreateCohortUseCase,
        private readonly updateCohortUseCase: UpdateCohortUseCase,
        private readonly listCohortsUseCase: ListCohortsUseCase,
        private readonly getCohortUseCase: GetCohortUseCase,
        private readonly deleteCohortUseCase: DeleteCohortUseCase
    ) {
        super();
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const tenantId = (req as any).user.tenantId;
            const cohort = await this.createCohortUseCase.execute({ ...data, tenantId });
            return res.status(201).json(ResponseHttp.success("Cohort created successfully", cohort));
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const data = req.body;
            const tenantId = (req as any).user.tenantId;
            const cohort = await this.updateCohortUseCase.execute(id, data, tenantId);
            return res.status(200).json(ResponseHttp.success("Cohort updated successfully", cohort));
        } catch (error) {
            next(error);
        }
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const tenantId = (req as any).user.tenantId;
            const cohort = await this.getCohortUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Cohort fetched successfully", cohort));
        } catch (error) {
            next(error);
        }
    }

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tenantId = (req as any).user.tenantId;
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = parseInt(req.query.offset as string) || 0;
            const q = (req.query.q as string | undefined)?.trim();
            const campusId = req.query.campusId as string | undefined;
            const programId = req.query.programId as string | undefined;
            
            const page = Math.floor(offset / limit) + 1;
            
            const filters = { tenantId, q, campusId, programId };
            const result = await this.listCohortsUseCase.execute(page, limit as number, filters);
            
            return res.status(200).json(
                ResponseHttp.pagination(
                    'Cohorts retrieved successfully',
                    result.data,
                    result.total,
                    limit as number,
                    offset as number
                )
            );
        } catch (error) {
            next(error);
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const tenantId = (req as any).user.tenantId;
            await this.deleteCohortUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Cohort deleted successfully", null));
        } catch (error) {
            next(error);
        }
    }
}
