import { AssessmentRepository } from "../domain/assessment.repository.js";
import type { StorageProvider } from "@shared/domain/storage.provider.js";
import AppError from "@shared/errors/AppError.js";

export class DeleteAssessmentUseCase {
    constructor(
        private readonly repository: AssessmentRepository,
        private readonly storageProvider?: StorageProvider
    ) { }

    async execute(id: string) {
        const entity = await this.repository.findById(id);
        if (!entity) throw new AppError('Assessment not found', 'NOT_FOUND', 404);

        // Clean up R2 file if exists
        if (entity.sebConfigFilePath && this.storageProvider) {
            const key = this.storageProvider.extractKeyFromUrl(entity.sebConfigFilePath);
            if (key) {
                await this.storageProvider.delete(key).catch((err) =>
                    console.error("Failed to delete SEB file from R2 on assessment deletion:", err)
                );
            }
        }

        await this.repository.delete(id);
    }
}
