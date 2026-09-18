import { AssessmentRepository } from "../domain/assessment.repository.js";
import { UpdateAssessmentDTO } from "../domain/assessment.interfaces.js";
import type { StorageProvider } from "../../../../shared/domain/storage.provider.js";
import type { TenantRepository } from "../../../Tenant/domain/tenant.repository.js";
export declare class UpdateAssessmentUseCase {
    private readonly repository;
    private readonly storageProvider;
    private readonly tenantRepository?;
    constructor(repository: AssessmentRepository, storageProvider: StorageProvider, tenantRepository?: TenantRepository | undefined);
    execute(id: string, data: UpdateAssessmentDTO, file?: Express.Multer.File, tenantId?: string): Promise<import("../domain/assessment.entity.js").AssessmentEntity>;
}
//# sourceMappingURL=update-assessment.usecase.d.ts.map