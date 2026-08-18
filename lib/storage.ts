import "server-only";

import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export type StoredObject = {
  key: string;
  url: string;
};

export type PresignedUpload = {
  key: string;
  url: string;
  method: "PUT" | "POST";
  headers?: Record<string, string>;
};

export type UploadInput = {
  key: string;
  contentType: string;
  body: Buffer;
};

export type PresignInput = {
  key: string;
  contentType: string;
};

export interface StorageAdapter {
  upload(input: UploadInput): Promise<StoredObject>;
  delete(key: string): Promise<void>;
  getPublicUrl(key: string): string;
  /**
   * Vercel: o browser deve enviar o arquivo direto ao R2 (limite ~4,5 MB nas API routes).
   * O adapter local devolve uma rota interna `/api/upload` (implementada no V3).
   */
  getPresignedUploadUrl(input: PresignInput): Promise<PresignedUpload>;
}

const uploadsDir = path.join(process.cwd(), "public", "uploads");

class LocalStorageAdapter implements StorageAdapter {
  getPublicUrl(key: string) {
    const normalized = key.replace(/^\/+/, "");
    return `/uploads/${normalized}`;
  }

  async upload({ key, body }: UploadInput): Promise<StoredObject> {
    const normalized = key.replace(/^\/+/, "");
    const filePath = path.join(uploadsDir, normalized);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, body);
    return { key: normalized, url: this.getPublicUrl(normalized) };
  }

  async delete(key: string) {
    const normalized = key.replace(/^\/+/, "");
    await unlink(path.join(uploadsDir, normalized)).catch(() => undefined);
  }

  async getPresignedUploadUrl({ key, contentType }: PresignInput): Promise<PresignedUpload> {
    const normalized = key.replace(/^\/+/, "");
    return {
      key: normalized,
      url: `/api/upload?key=${encodeURIComponent(normalized)}`,
      method: "POST",
      headers: { "Content-Type": contentType },
    };
  }
}

let cached: StorageAdapter | undefined;

export function getStorage(): StorageAdapter {
  if (!cached) {
    const provider = process.env.STORAGE_PROVIDER ?? "local";
    if (provider === "r2") {
      throw new Error(
        "Adapter Cloudflare R2 entra no V3 (URL pré-assinada + upload direto do browser).",
      );
    }
    cached = new LocalStorageAdapter();
  }

  return cached;
}
