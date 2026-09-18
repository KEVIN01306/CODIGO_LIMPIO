import type { StorageProvider, UploadFileParams, UploadFileResult } from "../domain/storage.provider.js";
export declare class CloudflareR2Provider implements StorageProvider {
    private readonly client;
    private readonly bucket;
    private readonly publicUrl;
    constructor();
    private normalizeKey;
    getUrl(key: string): string;
    extractKeyFromUrl(url: string): string;
    upload(params: UploadFileParams): Promise<UploadFileResult>;
    replace(params: UploadFileParams): Promise<UploadFileResult>;
    delete(key: string): Promise<void>;
    getFile(key: string): Promise<{
        buffer: Buffer;
        contentType?: string;
    }>;
}
//# sourceMappingURL=cloudflare-r2.provider.d.ts.map