import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  ctx: { params: { fatdId: string } }
) {
  await prisma.fATD.delete({
    where: { id: ctx.params.fatdId },
  });

  return NextResponse.json({ ok: true });
}