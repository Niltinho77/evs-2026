import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export function getUploadDir(): string {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
}

export async function ensureUploadDir(): Promise<void> {
  const dir = getUploadDir();
  await fs.mkdir(dir, { recursive: true });
}

export function guessExt(contentType: string): string {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}

export function makeKey(ext: string): string {
  return `${crypto.randomUUID()}.${ext}`;
}

export async function saveUploadedImage(file: File): Promise<{ key: string; contentType: string }> {
  await ensureUploadDir();

  const contentType = file.type || "image/jpeg";
  const ext = guessExt(contentType);
  const key = makeKey(ext);

  const buf = Buffer.from(await file.arrayBuffer());
  const fullPath = path.join(getUploadDir(), key);

  await fs.writeFile(fullPath, buf);

  return { key, contentType };
}

export function safeKey(input: string): string {
  // evita path traversal
  return input.replace(/[^a-zA-Z0-9._-]/g, "");
}