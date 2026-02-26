import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function saveUploadToPublic(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const safeName = `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}-${file.name}`.replace(/[^a-zA-Z0-9.\-_]/g, "_");

  const fullPath = path.join(uploadDir, safeName);

  await writeFile(fullPath, buffer);

  return `/uploads/${safeName}`;
}