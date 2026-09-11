import type { Request, Response, NextFunction } from "express";
import ResponseHttp from "@app/http/response.http.js";
import BaseController from "@presentation/base.controller.js";
import type { CreateAcademicCycleUseCase } from "../../cycle/application/create-academicCycle.usecase.js";
import type { UpdateAcademicCycleUseCase } from "../../cycle/application/update-academicCycle.usecase.js";
import type { ListAcademicCyclesUseCase } from "../../cycle/application/list-academicCycle.usecase.js";
import type { GetAcademicCycleUseCase } from "../../cycle/application/get-academicCycle.usecase.js";
import type { DeleteAcademicCycleUseCase } from "../../cycle/application/delete-academicCycle.usecase.js";

export class AcademicCycleController extends BaseController {
    constructor(
        private readonly createAcademicCycleUseCase: CreateAcademicCycleUseCase,
        private readonly updateAcademicCycleUseCase: UpdateAcademicCycleUseCase,
        private readonly listAcademicCyclesUseCase: ListAcademicCyclesUseCase,
        private readonly getAcademicCycleUseCase: GetAcademicCycleUseCase,
        private readonly deleteAcademicCycleUseCase: DeleteAcademicCycleUseCase
    ) {
        super();
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const tenantId = (req as any).user.tenantId;
            const cycle = await this.createAcademicCycleUseCase.execute({ ...data, tenantId });
            return res.status(201).json(ResponseHttp.success("Academic cycle created successfully", cycle));
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const data = req.body;
            const tenantId = (req as any).user.tenantId;
            const cycle = await this.updateAcademicCycleUseCase.execute(id, data, tenantId);
            return res.status(200).json(ResponseHttp.success("Academic cycle updated successfully", cycle));
        } catch (error) {
            next(error);
        }
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const tenantId = (req as any).user.tenantId;
            const cycle = await this.getAcademicCycleUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Academic cycle fetched successfully", cycle));
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
            
            const page = Math.floor(offset / limit) + 1;
            
            const filters = { tenantId, q, campusId };
            const result = await this.listAcademicCyclesUseCase.execute(page, limit as number, filters);
            
            return res.status(200).json(
                ResponseHttp.pagination(
                    'Academic cycles retrieved successfully',
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
            await this.deleteAcademicCycleUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Academic cycle deleted successfully", null));
        } catch (error) {
            next(error);
        }
    }
}
