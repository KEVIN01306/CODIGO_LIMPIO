import { AssessmentRepository } from "../domain/assessment.repository.js";
import type { StorageProvider } from "../../../../shared/domain/storage.provider.js";
export declare class DeleteAssessmentUseCase {
    private readonly repository;
    private readonly storageProvider?;
    constructor(repository: AssessmentRepository, storageProvider?: StorageProvider | undefined);
    execute(id: string): Promise<void>;
}
//# sourceMappingURL=delete-assessment.usecase.d.ts.map