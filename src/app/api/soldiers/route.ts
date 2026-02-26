// src/app/api/soldiers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeCPF, onlyDigits } from "@/lib/format";
import { saveUploadedImage } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  const where = q
    ? {
        OR: [
          { fullName: { contains: q, mode: "insensitive" as const } },
          { warName: { contains: q, mode: "insensitive" as const } },
          { cpf: { contains: normalizeCPF(q) } },
          { idt: { contains: onlyDigits(q) } },
        ],
      }
    : {};

  const soldiers = await prisma.soldier.findMany({
    where,
    orderBy: { fullName: "asc" },
    include: { fatds: true, fos: true },
  });

  return NextResponse.json({ soldiers });
}

export async function POST(req: Request) {
  const form = await req.formData();
  const photo = form.get("photo") as File | null;

  const fullName = String(form.get("fullName") ?? "").trim();
  const warName = String(form.get("warName") ?? "").trim();

  const cpfRaw = String(form.get("cpf") ?? "");
  const idtRaw = String(form.get("idt") ?? "");

  const phone = String(form.get("phone") ?? "").trim();
  const emergencyPhone = String(form.get("emergencyPhone") ?? "").trim();
  const naturalidade = String(form.get("naturalidade") ?? "").trim();
  const motherName = String(form.get("motherName") ?? "").trim();
  const fatherName = String(form.get("fatherName") ?? "").trim();
  const address = String(form.get("address") ?? "").trim();

  const platoon = (String(form.get("platoon") ?? "").trim() || null) as any;

  const laranjeira = String(form.get("laranjeira") ?? "false") === "true";
  const hasLicense = String(form.get("hasLicense") ?? "false") === "true";
  const isAthlete = String(form.get("isAthlete") ?? "false") === "true";

  const familyHistory = String(form.get("familyHistory") ?? "").trim() || null;
  const professionalExp = String(form.get("professionalExp") ?? "").trim() || null;
  const education = String(form.get("education") ?? "").trim() || null;

  const licenseCategory = String(form.get("licenseCategory") ?? "").trim() || null;

  const bloodType = (String(form.get("bloodType") ?? "").trim() || null) as any;

  const bank = (String(form.get("bank") ?? "").trim() || null) as any;
  const agency = String(form.get("agency") ?? "").trim() || null;
  const account = String(form.get("account") ?? "").trim() || null;

  const religion = String(form.get("religion") ?? "").trim() || null;
  const voterTitle = String(form.get("voterTitle") ?? "").trim() || null;

  const physicalActivity = String(form.get("physicalActivity") ?? "").trim() || null;

  const notesPositive = String(form.get("notesPositive") ?? "").trim() || null;
  const notesNegative = String(form.get("notesNegative") ?? "").trim() || null;

  const cpf = normalizeCPF(cpfRaw);
  const idt = onlyDigits(idtRaw).slice(0, 9);

  if (!fullName || !warName) {
    return NextResponse.json(
      { error: "Nome completo e nome de guerra são obrigatórios." },
      { status: 400 }
    );
  }

  if (cpf.length !== 11) {
    return NextResponse.json({ error: "CPF inválido." }, { status: 400 });
  }

  if (idt.length !== 9) {
    return NextResponse.json({ error: "IDT inválida." }, { status: 400 });
  }

  let photoUrl: string | null = null;
  if (photo && photo instanceof File && photo.size > 0) {
    const saved = await saveUploadedImage(photo);
    photoUrl = `/api/uploads/${saved.key}`;
  }

  const created = await prisma.soldier.create({
    data: {
      squad: "Comando",
      platoon,
      photoUrl,

      fullName,
      warName,
      cpf,
      idt,

      phone,
      emergencyPhone,
      naturalidade,
      motherName,
      fatherName,
      address,

      laranjeira,
      familyHistory,
      professionalExp,
      education,

      hasLicense,
      licenseCategory,
      bloodType,

      bank,
      agency,
      account,

      religion,
      voterTitle,

      isAthlete,
      physicalActivity,

      notesPositive,
      notesNegative,
    },
    include: {
      fatds: { orderBy: { date: "desc" } },
      fos: { orderBy: { date: "desc" } },
    },
  });

  return NextResponse.json({ soldier: created }, { status: 201 });
}