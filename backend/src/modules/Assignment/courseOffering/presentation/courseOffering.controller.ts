import type { Request, Response, NextFunction } from "express";
import ResponseHttp from "../../../../app/http/response.http.js";
import BaseController from "../../../../presentation/base.controller.js";
import type { CreateCourseOfferingUseCase } from "../application/create-courseOffering.usecase.js";
import type { UpdateCourseOfferingUseCase } from "../application/update-courseOffering.usecase.js";
import type { ListCourseOfferingsUseCase } from "../application/list-courseOffering.usecase.js";
import type { GetCourseOfferingUseCase } from "../application/get-courseOffering.usecase.js";
import type { DeleteCourseOfferingUseCase } from "../application/delete-courseOffering.usecase.js";

export class CourseOfferingController extends BaseController {
    constructor(
        private readonly createUseCase: CreateCourseOfferingUseCase,
        private readonly updateUseCase: UpdateCourseOfferingUseCase,
        private readonly listUseCase: ListCourseOfferingsUseCase,
        private readonly getUseCase: GetCourseOfferingUseCase,
        private readonly deleteUseCase: DeleteCourseOfferingUseCase
    ) { super(); }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const entity = await this.createUseCase.execute(data);
            return res.status(201).json(ResponseHttp.success("CourseOffering created successfully", entity));
        } catch (error) { next(error); }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const data = req.body;
            const entity = await this.updateUseCase.execute(id, data);
            return res.status(200).json(ResponseHttp.success("CourseOffering updated successfully", entity));
        } catch (error) { next(error); }
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const entity = await this.getUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("CourseOffering fetched successfully", entity));
        } catch (error) { next(error); }
    }

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = parseInt(req.query.offset as string) || 0;
            const page = Math.floor(offset / limit) + 1;
            
            const result = await this.listUseCase.execute(page, limit, req.query);
            return res.status(200).json(
                ResponseHttp.pagination('CourseOfferings retrieved successfully', result.data, result.total, limit, offset)
            );
        } catch (error) { next(error); }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            await this.deleteUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("CourseOffering deleted successfully", null));
        } catch (error) { next(error); }
    }
}
