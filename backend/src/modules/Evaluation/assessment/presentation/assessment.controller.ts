import { Request, Response, NextFunction } from "express";
import ResponseHttp from "@app/http/response.http.js";
import BaseController from "@presentation/base.controller.js";
import { CreateAssessmentUseCase } from "../application/create-assessment.usecase.js";
import { UpdateAssessmentUseCase } from "../application/update-assessment.usecase.js";
import { GetAssessmentUseCase } from "../application/get-assessment.usecase.js";
import { ListAssessmentsUseCase } from "../application/list-assessment.usecase.js";
import { DeleteAssessmentUseCase } from "../application/delete-assessment.usecase.js";

export class AssessmentController extends BaseController {
    constructor(
        private readonly createUseCase: CreateAssessmentUseCase,
        private readonly updateUseCase: UpdateAssessmentUseCase,
        private readonly getUseCase: GetAssessmentUseCase,
        private readonly listUseCase: ListAssessmentsUseCase,
        private readonly deleteUseCase: DeleteAssessmentUseCase
    ) { super(); }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const entity = await this.createUseCase.execute(data);
            return res.status(201).json(ResponseHttp.success("Assessment created successfully", entity));
        } catch (error) { next(error); }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const data = req.body;
            const entity = await this.updateUseCase.execute(id, data);
            return res.status(200).json(ResponseHttp.success("Assessment updated successfully", entity));
        } catch (error) { next(error); }
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const entity = await this.getUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("Assessment fetched successfully", entity));
        } catch (error) { next(error); }
    }

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = parseInt(req.query.offset as string) || 0;
            const page = Math.floor(offset / limit) + 1;

            const result = await this.listUseCase.execute(page, limit, req.query);
            return res.status(200).json(
                ResponseHttp.pagination('Assessments retrieved successfully', result.data, result.total, limit, offset)
            );
        } catch (error) { next(error); }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            await this.deleteUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("Assessment deleted successfully", null));
        } catch (error) { next(error); }
    }
}
