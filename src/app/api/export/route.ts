// src/app/api/export/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const FIELD_MAP = {
  // sistema
  id: "ID",
  createdAt: "Criado em",
  updatedAt: "Atualizado em",

  squad: "Esquadrão",
  platoon: "Pelotão",
  photoUrl: "Foto (URL)",

  // obrigatórios
  warName: "Nome de Guerra",
  fullName: "Nome Completo",

  // docs / identificação
  cpf: "CPF",
  idt: "IDT",

  // contato
  phone: "Telefone",
  emergencyPhone: "Telefone Emergência",
  address: "Endereço",
  naturalidade: "Naturalidade",

  // família
  motherName: "Nome da Mãe",
  fatherName: "Nome do Pai",

  // flags
  laranjeira: "Laranjeira",

  // histórico / vida
  familyHistory: "Histórico familiar",
  professionalExp: "Experiência profissional",
  education: "Escolaridade",

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

  // atleta
  isAthlete: "Atleta",
  physicalActivity: "Atividade Física",

  // observações
  notesPositive: "Fatos positivos (campo)",
  notesNegative: "Fatos negativos (campo)",

  // redes sociais
  facebook: "Facebook",
  instagram: "Instagram",

  // relacionamento
  hasGirlfriend: "Namorada",
  girlfriendAddress: "Endereço da namorada (ref.)",

  // drogas
  usedDrugs: "Já usou drogas",
  drugsDetails: "Quais drogas",

  // ======= NOVOS CAMPOS (perfil social / família / saúde / etc.) =======
  tattoos: "Tatuagens",
  childrenCount: "Qtd. filhos",

  hasBeenArrested: "Já foi preso",
  arrestDetails: "Detalhes da prisão",

  livesWithParents: "Mora com os pais",
  livesWithWhom: "Mora com quem",

  lostCloseFamily: "Perdeu familiar próximo",
  lostWhoCause: "Quem / causa",

  livedAway: "Já morou fora",
  livedAwayWhere: "Onde morou fora",

  householdCount: "Qtd. pessoas na casa",

  familyIncome: "Renda familiar (R$)",
  helpsFamily: "Ajuda a família",
  helpsFamilyAmount: "Valor que ajuda (R$)",

  hasSiblings: "Tem irmãos",
  siblingsCount: "Qtd. irmãos",

  smoker: "Fumante",
  alcoholUse: "Consome álcool",

  policeProblems: "Problemas com a polícia",
  policeProblemsDetails: "Detalhes (polícia)",

  accidentSequelae: "Sequelas de acidente",
  accidentSequelaeDetails: "Detalhes (sequelas)",

  hadSurgeries: "Já fez cirurgias",
  surgeriesDetails: "Detalhes (cirurgias)",

  hasSTDs: "Possui IST/DST",
  stdDetails: "Detalhes (IST/DST)",

  hasSeizuresFainting: "Convulsões/desmaios",
  mentalSymptoms: "Sintomas mentais",
  mentalSymptomsDetails: "Detalhes (sintomas mentais)",

  suddenFear: "Medo súbito",

  irritabilityAnxietyEtc: "Irritabilidade/ansiedade etc.",
  irritabilityAnxietyEtcDetails: "Detalhes (ansiedade etc.)",

  hasMilitaryRelative: "Parente militar",
  militaryRelativeDetails: "Detalhes (parente militar)",

  relationshipFather: "Relação com o pai",
  relationshipMother: "Relação com a mãe",
  relationshipSiblings: "Relação com irmãos",

  workedBeforeEB: "Trabalhou antes do EB",
  workSignedCard: "Carteira assinada",
  workSalary: "Salário (R$)",
  workDetails: "Detalhes (trabalho)",

  volunteeredToServe: "Se voluntariou para servir",
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

const BOOLEAN_FIELDS: AllowedField[] = [
  "laranjeira",
  "hasLicense",
  "isAthlete",
  "hasGirlfriend",
  "usedDrugs",

  "hasBeenArrested",
  "livesWithParents",
  "lostCloseFamily",
  "livedAway",
  "helpsFamily",
  "hasSiblings",
  "smoker",
  "alcoholUse",
  "policeProblems",
  "accidentSequelae",
  "hadSurgeries",
  "hasSTDs",
  "hasSeizuresFainting",
  "mentalSymptoms",
  "suddenFear",
  "irritabilityAnxietyEtc",
  "hasMilitaryRelative",
  "workedBeforeEB",
  "workSignedCard",
  "volunteeredToServe",
];

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

  // evita exportar título vazio
  if (onlyVoter) where.voterTitle = { notIn: [null, ""] };

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

  const lines = rows.map((r) =>
    fields
      .map((f) => {
        const value = (r as any)[f];

        // booleans viram Sim/Não
        if (BOOLEAN_FIELDS.includes(f)) return csvEscape(yesNo(value));

        // datas ficam ISO (bom pra Excel/BI)
        if (value instanceof Date) return csvEscape(value.toISOString());

        // Decimal do Prisma geralmente vira string/obj; String(...) resolve
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