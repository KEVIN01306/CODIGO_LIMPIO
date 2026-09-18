import { AssessmentRepository } from "../domain/assessment.repository.js";
import { CreateAssessmentDTO } from "../domain/assessment.interfaces.js";
import type { StorageProvider } from "../../../../shared/domain/storage.provider.js";
import type { TenantRepository } from "../../../Tenant/domain/tenant.repository.js";
export declare class CreateAssessmentUseCase {
    private readonly repository;
    private readonly storageProvider;
    private readonly tenantRepository?;
    constructor(repository: AssessmentRepository, storageProvider: StorageProvider, tenantRepository?: TenantRepository | undefined);
    execute(data: CreateAssessmentDTO, file?: Express.Multer.File, tenantId?: string): Promise<import("../domain/assessment.entity.js").AssessmentEntity>;
}
//# sourceMappingURL=create-assessment.usecase.d.ts.map