export interface UploadFileParams {
    key: string;
    buffer: Buffer;
    mimeType: string;
}
export interface UploadFileResult {
    url: string;
    key: string;
}
export interface StorageProvider {
    upload(params: UploadFileParams): Promise<UploadFileResult>;
    delete(key: string): Promise<void>;
    replace(params: UploadFileParams): Promise<UploadFileResult>;
    getUrl(key: string): string;
    extractKeyFromUrl(url: string): string;
    getFile(key: string): Promise<{
        buffer: Buffer;
        contentType?: string;
    }>;
}
//# sourceMappingURL=storage.provider.d.ts.map