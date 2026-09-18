import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import type { StorageProvider, UploadFileParams, UploadFileResult } from "../domain/storage.provider.js";
import AppError from "../errors/AppError.js";

export class CloudflareR2Provider implements StorageProvider {
    private readonly client: S3Client;
    private readonly bucket: string;
    private readonly publicUrl: string;

    constructor() {
        const endpoint = process.env.R2_ENDPOINT;
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
        const bucketName = process.env.R2_BUCKET_NAME;
        const publicUrl = process.env.R2_PUBLIC_URL;

        if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName) {
            console.error("Missing R2 environment variables");
        }

        this.bucket = bucketName || "assets-storage";
        this.publicUrl = (publicUrl || "").replace(/\/+$/, "");

        this.client = new S3Client({
            region: "auto",
            endpoint: endpoint,
            credentials: {
                accessKeyId: accessKeyId || "",
                secretAccessKey: secretAccessKey || "",
            },
        });
    }

    private normalizeKey(key: string): string {
        return key.replace(/^\/+/, "");
    }

    getUrl(key: string): string {
        const normalized = this.normalizeKey(key);
        if (this.publicUrl) {
            return `${this.publicUrl}/${normalized}`;
        }
        return `/${normalized}`;
    }

    extractKeyFromUrl(url: string): string {
        if (!url) return "";
        try {
            if (this.publicUrl && url.startsWith(this.publicUrl)) {
                return this.normalizeKey(url.slice(this.publicUrl.length));
            }
            const parsed = new URL(url);
            return this.normalizeKey(parsed.pathname);
        } catch {
            return this.normalizeKey(url);
        }
    }

    async upload(params: UploadFileParams): Promise<UploadFileResult> {
        const key = this.normalizeKey(params.key);
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: params.buffer,
                ContentType: params.mimeType,
            });

            await this.client.send(command);

            return {
                key,
                url: this.getUrl(key),
            };
        } catch (error: any) {
            console.error("Cloudflare R2 upload error:", error);
            throw new AppError(`Error uploading file to storage: ${error.message || error}`, "STORAGE_UPLOAD_ERROR", 500);
        }
    }

    async replace(params: UploadFileParams): Promise<UploadFileResult> {
        return this.upload(params);
    }

    async delete(key: string): Promise<void> {
        const cleanKey = this.normalizeKey(key);
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: cleanKey,
            });

            await this.client.send(command);
        } catch (error: any) {
            console.error(`Cloudflare R2 delete error for key ${cleanKey}:`, error);
            throw new AppError(`Error deleting file from storage: ${error.message || error}`, "STORAGE_DELETE_ERROR", 500);
        }
    }

    async getFile(key: string): Promise<{ buffer: Buffer; contentType?: string }> {
        const cleanKey = this.normalizeKey(key);
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: cleanKey,
            });

            const response = await this.client.send(command);
            if (!response.Body) {
                throw new AppError(`Empty body returned for storage key ${cleanKey}`, "STORAGE_NOT_FOUND", 404);
            }

            const byteArray = await response.Body.transformToByteArray();
            const buffer = Buffer.from(byteArray);

            return {
                buffer,
                contentType: response.ContentType,
            };
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            console.error(`Cloudflare R2 getFile error for key ${cleanKey}:`, error);
            throw new AppError(`Error retrieving file from storage: ${error.message || error}`, "STORAGE_GET_ERROR", 500);
        }
    }
}

