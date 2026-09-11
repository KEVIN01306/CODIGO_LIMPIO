import type { Request, Response, NextFunction } from "express";
import ResponseHttp from "../../../../app/http/response.http.js";
import BaseController from "../../../../presentation/base.controller.js";
import type { CreateCourseEnrollmentUseCase } from "../application/create-courseEnrollment.usecase.js";
import type { UpdateCourseEnrollmentUseCase } from "../application/update-courseEnrollment.usecase.js";
import type { ListCourseEnrollmentsUseCase } from "../application/list-courseEnrollment.usecase.js";
import type { GetCourseEnrollmentUseCase } from "../application/get-courseEnrollment.usecase.js";
import type { DeleteCourseEnrollmentUseCase } from "../application/delete-courseEnrollment.usecase.js";

export class CourseEnrollmentController extends BaseController {
    constructor(
        private readonly createUseCase: CreateCourseEnrollmentUseCase,
        private readonly updateUseCase: UpdateCourseEnrollmentUseCase,
        private readonly listUseCase: ListCourseEnrollmentsUseCase,
        private readonly getUseCase: GetCourseEnrollmentUseCase,
        private readonly deleteUseCase: DeleteCourseEnrollmentUseCase
    ) { super(); }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const entity = await this.createUseCase.execute(data);
            return res.status(201).json(ResponseHttp.success("CourseEnrollment created successfully", entity));
        } catch (error) { next(error); }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const data = req.body;
            const entity = await this.updateUseCase.execute(id, data);
            return res.status(200).json(ResponseHttp.success("CourseEnrollment updated successfully", entity));
        } catch (error) { next(error); }
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const entity = await this.getUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("CourseEnrollment fetched successfully", entity));
        } catch (error) { next(error); }
    }

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = parseInt(req.query.offset as string) || 0;
            const page = Math.floor(offset / limit) + 1;
            
            const result = await this.listUseCase.execute(page, limit, req.query);
            return res.status(200).json(
                ResponseHttp.pagination('CourseEnrollments retrieved successfully', result.data, result.total, limit, offset)
            );
        } catch (error) { next(error); }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            await this.deleteUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("CourseEnrollment deleted successfully", null));
        } catch (error) { next(error); }
    }
}
