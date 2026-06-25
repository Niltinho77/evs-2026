import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, isAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ foId: string }> }
) {
  const session = await getSessionFromRequest(req);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Acesso restrito ao admin." }, { status: 403 });
  }

  const { foId } = await context.params;

  await prisma.fO.delete({
    where: { id: foId },
  });

  return NextResponse.json({ ok: true });
}
