// src/app/api/soldiers/[id]/fatd/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Punishment = "ADVERTENCIA" | "IMPEDIMENTO" | "REPREENSAO" | "DETENCAO" | "CADEIA";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const reason = String(body?.reason ?? "").trim();
  const dateRaw = String(body?.date ?? "").trim();
  const punishment = String(body?.punishment ?? "").trim() as Punishment;

  if (!reason) {
    return NextResponse.json({ error: "Motivo é obrigatório." }, { status: 400 });
  }

  const date = new Date(dateRaw);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "Data inválida." }, { status: 400 });
  }

  const okPunish: Punishment[] = ["ADVERTENCIA", "IMPEDIMENTO", "REPREENSAO", "DETENCAO", "CADEIA"];
  if (!okPunish.includes(punishment)) {
    return NextResponse.json({ error: "Punição inválida." }, { status: 400 });
  }

  const created = await prisma.fATD.create({
    data: {
      soldierId: id,
      reason,
      date,
      punishment,
    },
  });

  return NextResponse.json({ fatd: created }, { status: 201 });
}