
import type { Request, Response, NextFunction } from "express";
import ResponseHttp from "../../../app/http/response.http.js";
import BaseController from "../../../presentation/base.controller.js";
import AppError from "@shared/errors/AppError.js";

export class StudentsController extends BaseController {
    constructor(
        private readonly createUseCase: any,
        private readonly updateUseCase: any,
        private readonly listUseCase: any,
        private readonly getUseCase: any,
        private readonly deleteUseCase: any
    ) { super(); }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tenantId = (req as any).user?.tenantId;
            if (!tenantId) throw new AppError("Tenant missing", "UNAUTHORIZED", 401);
            
            const data = { ...req.body, tenantId };
            const entity = await this.createUseCase.execute(data);
            return res.status(201).json(ResponseHttp.success("Student created successfully", entity));
        } catch (error) { next(error); }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const data = req.body;
            const entity = await this.updateUseCase.execute(id, data);
            return res.status(200).json(ResponseHttp.success("Student updated successfully", entity));
        } catch (error) { next(error); }
    }

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tenantId = (req as any).user?.tenantId;
            if (!tenantId) throw new AppError("Tenant missing", "UNAUTHORIZED", 401);

            const page = parseInt(req.query.page as string) || 1;
            const perPage = parseInt(req.query.perPage as string) || 10;
            const q = typeof req.query.q === 'string' ? req.query.q : undefined;

            const result = await this.listUseCase.execute({ page, perPage, q, tenantId });
            return res.status(200).json(
                ResponseHttp.pagination("Students retrieved", result.data, result.meta.total, perPage, (page - 1) * perPage)
            );
        } catch (error) { next(error); }
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const entity = await this.getUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("Student retrieved", entity));
        } catch (error) { next(error); }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            await this.deleteUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("Student deleted successfully", null));
        } catch (error) { next(error); }
    }
}
