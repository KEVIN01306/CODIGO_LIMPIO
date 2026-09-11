import ResponseHttp from "../../../../app/http/response.http.js";
import BaseController from "../../../../presentation/base.controller.js";
export class CourseController extends BaseController {
    createCourseUseCase;
    updateCourseUseCase;
    listCoursesUseCase;
    getCourseUseCase;
    deleteCourseUseCase;
    constructor(createCourseUseCase, updateCourseUseCase, listCoursesUseCase, getCourseUseCase, deleteCourseUseCase) {
        super();
        this.createCourseUseCase = createCourseUseCase;
        this.updateCourseUseCase = updateCourseUseCase;
        this.listCoursesUseCase = listCoursesUseCase;
        this.getCourseUseCase = getCourseUseCase;
        this.deleteCourseUseCase = deleteCourseUseCase;
    }
    create = async (req, res, next) => {
        try {
            const data = req.body;
            const tenantId = req.user.tenantId;
            const course = await this.createCourseUseCase.execute({ ...data, tenantId });
            return res.status(201).json(ResponseHttp.success("Course created successfully", course));
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const id = req.params.id;
            const data = req.body;
            const tenantId = req.user.tenantId;
            const course = await this.updateCourseUseCase.execute(id, data, tenantId);
            return res.status(200).json(ResponseHttp.success("Course updated successfully", course));
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const tenantId = req.user.tenantId;
            const course = await this.getCourseUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Course fetched successfully", course));
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const tenantId = req.user.tenantId;
            const limit = parseInt(req.query.limit) || 10;
            const offset = parseInt(req.query.offset) || 0;
            const q = req.query.q?.trim();
            const programId = req.query.programId;
            const isActiveParam = req.query.isActive;
            const isActive = isActiveParam === 'true' ? true : (isActiveParam === 'false' ? false : undefined);
            const page = Math.floor(offset / limit) + 1;
            const filters = { tenantId, q, programId, isActive };
            const result = await this.listCoursesUseCase.execute(page, limit, filters);
            return res.status(200).json(ResponseHttp.pagination('Courses retrieved successfully', result.data, result.total, limit, offset));
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = req.params.id;
            const tenantId = req.user.tenantId;
            await this.deleteCourseUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Course deleted successfully", null));
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=course.controller.js.map