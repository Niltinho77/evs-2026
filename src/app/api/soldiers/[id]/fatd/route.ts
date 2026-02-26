import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  ctx: { params: { id: string } }
) {
  const body = await req.json();

  const reason = String(body.reason ?? "").trim();
  const punishment = String(body.punishment ?? "").trim();
  const dateStr = String(body.date ?? "").trim();

  if (!reason) {
    return NextResponse.json({ error: "Motivo é obrigatório." }, { status: 400 });
  }

  if (!punishment) {
    return NextResponse.json({ error: "Punição é obrigatória." }, { status: 400 });
  }

  if (!dateStr) {
    return NextResponse.json({ error: "Data é obrigatória." }, { status: 400 });
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return NextResponse.json({ error: "Data inválida." }, { status: 400 });
  }

  const fatd = await prisma.fATD.create({
    data: {
      soldierId: ctx.params.id,
      reason,
      punishment: punishment as any,
      date,
    },
  });

  return NextResponse.json({ fatd }, { status: 201 });
}