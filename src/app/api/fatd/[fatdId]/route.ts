// src/app/api/fatd/[fatdId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, isAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ fatdId: string }> }
) {
  const session = await getSessionFromRequest(req);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Acesso restrito ao admin." }, { status: 403 });
  }

  const { fatdId } = await context.params;

  await prisma.fATD.delete({
    where: { id: fatdId },
  });

  return NextResponse.json({ ok: true });
}
