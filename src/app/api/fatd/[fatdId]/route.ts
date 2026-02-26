// src/app/api/fatd/[fatdId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ fatdId: string }> }
) {
  const { fatdId } = await context.params;

  await prisma.fATD.delete({
    where: { id: fatdId },
  });

  return NextResponse.json({ ok: true });
}