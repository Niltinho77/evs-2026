import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ foId: string }> }
) {
  const { foId } = await context.params;

  await prisma.fO.delete({
    where: { id: foId },
  });

  return NextResponse.json({ ok: true });
}