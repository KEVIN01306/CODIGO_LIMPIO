import type { Request, Response, NextFunction } from "express";
import BaseController from "@presentation/base.controller.js";
import type { CreateCourseUseCase } from "../../course/application/create-course.usecase.js";
import type { UpdateCourseUseCase } from "../../course/application/update-course.usecase.js";
import type { ListCoursesUseCase } from "../../course/application/list-course.usecase.js";
import type { GetCourseUseCase } from "../../course/application/get-course.usecase.js";
import type { DeleteCourseUseCase } from "../../course/application/delete-course.usecase.js";
export declare class CourseController extends BaseController {
    private readonly createCourseUseCase;
    private readonly updateCourseUseCase;
    private readonly listCoursesUseCase;
    private readonly getCourseUseCase;
    private readonly deleteCourseUseCase;
    constructor(createCourseUseCase: CreateCourseUseCase, updateCourseUseCase: UpdateCourseUseCase, listCoursesUseCase: ListCoursesUseCase, getCourseUseCase: GetCourseUseCase, deleteCourseUseCase: DeleteCourseUseCase);
    create: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    list: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=course.controller.d.ts.map