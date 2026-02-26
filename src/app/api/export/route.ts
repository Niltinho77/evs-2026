// src/app/api/export/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const FIELD_MAP = {
  // obrigatórios
  warName: "Nome de Guerra",
  fullName: "Nome Completo",

  // docs / identificação
  cpf: "CPF",
  idt: "IDT",
  platoon: "Pelotão",

  // contato
  phone: "Telefone",
  emergencyPhone: "Telefone Emergência",
  address: "Endereço",
  naturalidade: "Naturalidade",

  // familia
  motherName: "Nome da Mãe",
  fatherName: "Nome do Pai",

  // flags
  laranjeira: "Laranjeira",

  // CNH
  hasLicense: "Possui CNH",
  licenseCategory: "Categoria CNH",

  // saúde / sangue
  bloodType: "Tipo Sanguíneo",
  healthIssues: "Problemas de saúde",

  // banco
  bank: "Banco",
  agency: "Agência",
  account: "Conta",

  // outros
  religion: "Religião",
  voterTitle: "Título de Eleitor",
  isAthlete: "Atleta",
  physicalActivity: "Atividade Física",

  // redes sociais
  facebook: "Facebook",
  instagram: "Instagram",

  // relacionamento
  hasGirlfriend: "Namorada",
  girlfriendAddress: "Endereço da namorada (ref.)",

  // drogas
  usedDrugs: "Já usou drogas",
  drugsDetails: "Quais drogas",
} as const;

type AllowedField = keyof typeof FIELD_MAP;

const REQUIRED_FIELDS: AllowedField[] = ["warName", "fullName"];

function csvEscape(v: unknown): string {
  const s = String(v ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

function yesNo(v: unknown): string {
  return v ? "Sim" : "Não";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const onlyCnh = searchParams.get("onlyCnh") === "1";
  const onlyVoter = searchParams.get("onlyVoter") === "1";
  const platoon = (searchParams.get("platoon") || "").trim(); // P1|P2|P3|""
  const q = (searchParams.get("q") || "").trim();

  const fieldsParam = (searchParams.get("fields") || "").trim();
  const requested = fieldsParam
    ? fieldsParam.split(",").map((x) => x.trim()).filter(Boolean)
    : [];

  const safeRequested = requested.filter((f): f is AllowedField => f in FIELD_MAP);

  // garante obrigatórios sempre
  const fieldSet = new Set<AllowedField>([...REQUIRED_FIELDS, ...safeRequested]);
  const fields: AllowedField[] = Array.from(fieldSet);

  const where: any = {};

  if (platoon) where.platoon = platoon;
  if (onlyCnh) where.hasLicense = true;
  if (onlyVoter) where.voterTitle = { not: null };

  if (q) {
    const digits = q.replace(/\D/g, "");
    where.OR = [
      { fullName: { contains: q } },
      { warName: { contains: q } },
      ...(digits ? [{ cpf: { contains: digits } }, { idt: { contains: digits } }] : []),
    ];
  }

  const rows = await prisma.soldier.findMany({
    where,
    orderBy: { fullName: "asc" },
  });

  const header = fields.map((f) => csvEscape(FIELD_MAP[f])).join(",");

  const BOOLEAN_FIELDS: AllowedField[] = [
    "hasLicense",
    "laranjeira",
    "isAthlete",
    "hasGirlfriend",
    "usedDrugs",
  ];

  const lines = rows.map((r) =>
    fields
      .map((f) => {
        const value = (r as any)[f];
        if (BOOLEAN_FIELDS.includes(f)) return csvEscape(yesNo(value));
        return csvEscape(value ?? "");
      })
      .join(",")
  );

  const csv = "\uFEFF" + [header, ...lines].join("\n");
  const filename = `evs_export_${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}