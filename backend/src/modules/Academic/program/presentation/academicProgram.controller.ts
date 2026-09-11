import type { Request, Response, NextFunction } from "express";
import ResponseHttp from "@app/http/response.http.js";
import BaseController from "@presentation/base.controller.js";
import type { CreateAcademicProgramUseCase } from "../../program/application/create-academicProgram.usecase.js";
import type { UpdateAcademicProgramUseCase } from "../../program/application/update-academicProgram.usecase.js";
import type { ListAcademicProgramsUseCase } from "../../program/application/list-academicProgram.usecase.js";
import type { GetAcademicProgramUseCase } from "../../program/application/get-academicProgram.usecase.js";
import type { DeleteAcademicProgramUseCase } from "../../program/application/delete-academicProgram.usecase.js";

export class AcademicProgramController extends BaseController {
    constructor(
        private readonly createAcademicProgramUseCase: CreateAcademicProgramUseCase,
        private readonly updateAcademicProgramUseCase: UpdateAcademicProgramUseCase,
        private readonly listAcademicProgramsUseCase: ListAcademicProgramsUseCase,
        private readonly getAcademicProgramUseCase: GetAcademicProgramUseCase,
        private readonly deleteAcademicProgramUseCase: DeleteAcademicProgramUseCase
    ) {
        super();
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const tenantId = (req as any).user.tenantId;
            const program = await this.createAcademicProgramUseCase.execute({ ...data, tenantId });
            return res.status(201).json(ResponseHttp.success("Academic program created successfully", program));
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const data = req.body;
            const tenantId = (req as any).user.tenantId;
            const program = await this.updateAcademicProgramUseCase.execute(id, data, tenantId);
            return res.status(200).json(ResponseHttp.success("Academic program updated successfully", program));
        } catch (error) {
            next(error);
        }
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const tenantId = (req as any).user.tenantId;
            const program = await this.getAcademicProgramUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Academic program fetched successfully", program));
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
            
            const page = Math.floor(offset / limit) + 1;
            
            const filters = { tenantId, q };
            const result = await this.listAcademicProgramsUseCase.execute(page, limit as number, filters);
            
            return res.status(200).json(
                ResponseHttp.pagination(
                    'Academic programs retrieved successfully',
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
            await this.deleteAcademicProgramUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Academic program deleted successfully", null));
        } catch (error) {
            next(error);
        }
    }
}
