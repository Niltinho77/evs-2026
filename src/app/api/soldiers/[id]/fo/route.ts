import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: soldierId } = await context.params;
  const body = (await req.json()) as {
    type?: "POSITIVO" | "NEGATIVO";
    text?: string;
    date?: string;
  };

  const type = String(body.type ?? "").trim();
  const text = String(body.text ?? "").trim();
  const dateStr = String(body.date ?? "").trim();

  if (type !== "POSITIVO" && type !== "NEGATIVO") {
    return NextResponse.json({ error: "Tipo inválido." }, { status: 400 });
  }
  if (!text) {
    return NextResponse.json({ error: "Texto do FO é obrigatório." }, { status: 400 });
  }

  const date = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(date.getTime())) {
    return NextResponse.json({ error: "Data inválida." }, { status: 400 });
  }

  const fo = await prisma.fO.create({
    data: {
      soldierId,
      type: type as any,
      text,
      date,
    },
  });

  return NextResponse.json({ fo }, { status: 201 });
}