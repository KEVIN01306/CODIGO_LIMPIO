import type { Request, Response, NextFunction } from "express";
import ResponseHttp from "@app/http/response.http.js";
import BaseController from "@presentation/base.controller.js";
import type { CreateCourseUseCase } from "../../course/application/create-course.usecase.js";
import type { UpdateCourseUseCase } from "../../course/application/update-course.usecase.js";
import type { ListCoursesUseCase } from "../../course/application/list-course.usecase.js";
import type { GetCourseUseCase } from "../../course/application/get-course.usecase.js";
import type { DeleteCourseUseCase } from "../../course/application/delete-course.usecase.js";

export class CourseController extends BaseController {
    constructor(
        private readonly createCourseUseCase: CreateCourseUseCase,
        private readonly updateCourseUseCase: UpdateCourseUseCase,
        private readonly listCoursesUseCase: ListCoursesUseCase,
        private readonly getCourseUseCase: GetCourseUseCase,
        private readonly deleteCourseUseCase: DeleteCourseUseCase
    ) {
        super();
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const tenantId = (req as any).user.tenantId;
            const course = await this.createCourseUseCase.execute({ ...data, tenantId });
            return res.status(201).json(ResponseHttp.success("Course created successfully", course));
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const data = req.body;
            const tenantId = (req as any).user.tenantId;
            const course = await this.updateCourseUseCase.execute(id, data, tenantId);
            return res.status(200).json(ResponseHttp.success("Course updated successfully", course));
        } catch (error) {
            next(error);
        }
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const tenantId = (req as any).user.tenantId;
            const course = await this.getCourseUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Course fetched successfully", course));
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
            const programId = req.query.programId as string | undefined;
            const isActiveParam = req.query.isActive as string | undefined;
            
            const isActive = isActiveParam === 'true' ? true : (isActiveParam === 'false' ? false : undefined);
            
            const page = Math.floor(offset / limit) + 1;
            
            const filters = { tenantId, q, programId, isActive };
            const result = await this.listCoursesUseCase.execute(page, limit as number, filters);
            
            return res.status(200).json(
                ResponseHttp.pagination(
                    'Courses retrieved successfully',
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
            await this.deleteCourseUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Course deleted successfully", null));
        } catch (error) {
            next(error);
        }
    }
}
