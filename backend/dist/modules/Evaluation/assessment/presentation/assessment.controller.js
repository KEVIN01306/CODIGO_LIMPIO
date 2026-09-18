import ResponseHttp from "../../../../app/http/response.http.js";
import BaseController from "../../../../presentation/base.controller.js";
export class AssessmentController extends BaseController {
    createUseCase;
    updateUseCase;
    getUseCase;
    listUseCase;
    deleteUseCase;
    startUseCase;
    tenantRepository;
    assessmentRepository;
    constructor(createUseCase, updateUseCase, getUseCase, listUseCase, deleteUseCase, startUseCase, tenantRepository, assessmentRepository) {
        super();
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.getUseCase = getUseCase;
        this.listUseCase = listUseCase;
        this.deleteUseCase = deleteUseCase;
        this.startUseCase = startUseCase;
        this.tenantRepository = tenantRepository;
        this.assessmentRepository = assessmentRepository;
    }
    create = async (req, res, next) => {
        try {
            const { tenantId } = this.obtenerEntorno(res);
            const data = req.body;
            const entity = await this.createUseCase.execute(data, req.file, tenantId);
            return res.status(201).json(ResponseHttp.success("Assessment created successfully", entity));
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const { tenantId } = this.obtenerEntorno(res);
            const id = req.params.id;
            const data = req.body;
            const entity = await this.updateUseCase.execute(id, data, req.file, tenantId);
            return res.status(200).json(ResponseHttp.success("Assessment updated successfully", entity));
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const entity = await this.getUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("Assessment fetched successfully", entity));
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const offset = parseInt(req.query.offset) || 0;
            const page = Math.floor(offset / limit) + 1;
            const result = await this.listUseCase.execute(page, limit, req.query);
            return res.status(200).json(ResponseHttp.pagination('Assessments retrieved successfully', result.data, result.total, limit, offset));
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = req.params.id;
            await this.deleteUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("Assessment deleted successfully", null));
        }
        catch (error) {
            next(error);
        }
    };
    start = async (req, res, next) => {
        try {
            const { id: userId } = this.obtenerEntorno(res);
            const id = req.params.id;
            if (!this.startUseCase) {
                throw new Error("StartAssessmentUseCase is not initialized");
            }
            const result = await this.startUseCase.execute(id, userId);
            return res.status(200).json(ResponseHttp.success("Assessment started successfully", result));
        }
        catch (error) {
            next(error);
        }
    };
    getDefaultSebConfig = async (req, res, next) => {
        try {
            const { tenantId } = this.obtenerEntorno(res);
            const offeringId = req.query.offeringId;
            let targetTenantId = tenantId;
            if (offeringId && this.assessmentRepository) {
                const offeringTenantId = await this.assessmentRepository.getOfferingTenantId(offeringId);
                if (offeringTenantId) {
                    targetTenantId = offeringTenantId;
                }
            }
            if (!targetTenantId || !this.tenantRepository) {
                return res.status(200).json(ResponseHttp.success("SEB default config checked", {
                    hasDefaultSeb: false,
                    defaultSebConfigKey: null,
                    defaultSebConfigFilePath: null
                }));
            }
            let tenant = await this.tenantRepository.findById(targetTenantId);
            let hasDefaultSeb = Boolean(tenant?.defaultSebConfigKey?.trim() && tenant?.defaultSebConfigFilePath?.trim());
            if (!hasDefaultSeb && tenantId && tenantId !== targetTenantId) {
                const userTenant = await this.tenantRepository.findById(tenantId);
                if (userTenant?.defaultSebConfigKey?.trim() && userTenant?.defaultSebConfigFilePath?.trim()) {
                    tenant = userTenant;
                    hasDefaultSeb = true;
                }
            }
            return res.status(200).json(ResponseHttp.success("SEB default config fetched", {
                hasDefaultSeb,
                defaultSebConfigKey: tenant?.defaultSebConfigKey || null,
                defaultSebConfigFilePath: tenant?.defaultSebConfigFilePath || null
            }));
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=assessment.controller.js.map