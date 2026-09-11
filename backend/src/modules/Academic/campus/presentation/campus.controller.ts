import type { Request, Response, NextFunction } from "express";
import ResponseHttp from "@app/http/response.http.js";
import BaseController from "@presentation/base.controller.js";
import type { CreateCampusUseCase } from "../../campus/application/create-campus.usecase.js";
import type { UpdateCampusUseCase } from "../../campus/application/update-campus.usecase.js";
import type { ListCampusesUseCase } from "../../campus/application/list-campus.usecase.js";
import type { GetCampusUseCase } from "../../campus/application/get-campus.usecase.js";
import type { DeleteCampusUseCase } from "../../campus/application/delete-campus.usecase.js";

export class CampusController extends BaseController {
    constructor(
        private readonly createCampusUseCase: CreateCampusUseCase,
        private readonly updateCampusUseCase: UpdateCampusUseCase,
        private readonly listCampusesUseCase: ListCampusesUseCase,
        private readonly getCampusUseCase: GetCampusUseCase,
        private readonly deleteCampusUseCase: DeleteCampusUseCase
    ) {
        super();
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const tenantId = (req as any).user.tenantId;
            const campus = await this.createCampusUseCase.execute({ ...data, tenantId });
            return res.status(201).json(ResponseHttp.success("Campus created successfully", campus));
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const data = req.body;
            const tenantId = (req as any).user.tenantId;
            const campus = await this.updateCampusUseCase.execute(id, data, tenantId);
            return res.status(200).json(ResponseHttp.success("Campus updated successfully", campus));
        } catch (error) {
            next(error);
        }
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const tenantId = (req as any).user.tenantId;
            const campus = await this.getCampusUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Campus fetched successfully", campus));
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
            const isActiveParam = req.query.isActive as string | undefined;
            
            const isActive = isActiveParam === 'true' ? true : (isActiveParam === 'false' ? false : undefined);
            
            const page = Math.floor(offset / limit) + 1;
            
            const filters = { tenantId, q, isActive };
            const result = await this.listCampusesUseCase.execute(page, limit as number, filters);
            
            return res.status(200).json(
                ResponseHttp.pagination(
                    'Campuses retrieved successfully',
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
            await this.deleteCampusUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Campus deleted successfully", null));
        } catch (error) {
            next(error);
        }
    }
}
