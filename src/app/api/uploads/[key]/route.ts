import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getUploadDir, safeKey } from "@/lib/storage";

export const runtime = "nodejs";

function contentTypeFromExt(ext: string): string {
  const e = ext.toLowerCase();
  if (e === "png") return "image/png";
  if (e === "webp") return "image/webp";
  return "image/jpeg";
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ key: string }> }
) {
  const { key } = await ctx.params;
  const safe = safeKey(key);

  if (!safe) {
    return NextResponse.json({ error: "Arquivo inválido." }, { status: 400 });
  }

  const fullPath = path.join(getUploadDir(), safe);

  try {
    const file = await fs.readFile(fullPath);
    const ext = safe.split(".").pop() || "jpg";

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": contentTypeFromExt(ext),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }
}