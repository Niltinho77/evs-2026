// src/app/api/soldiers/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeCPF, onlyDigits } from "@/lib/format";
import { saveUploadedImage } from "@/lib/storage";

export const runtime = "nodejs";

function str(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

function optStr(form: FormData, key: string) {
  const v = str(form, key);
  return v.length ? v : null;
}

function bool(form: FormData, key: string) {
  return String(form.get(key) ?? "false") === "true";
}

function optInt(form: FormData, key: string) {
  const v = str(form, key);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function optDecimal(form: FormData, key: string) {
  const v = str(form, key);
  if (!v) return null;
  const norm = v.replace(",", ".");
  const n = Number(norm);
  return Number.isFinite(n) ? norm : null;
}

function optEnum<T extends string>(form: FormData, key: string) {
  const v = str(form, key);
  return v ? (v as T) : null;
}

function detailsWhen(form: FormData, flagKey: string, detailsKey: string) {
  const on = bool(form, flagKey);
  const details = on ? optStr(form, detailsKey) : null;
  return { on, details };
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const soldier = await prisma.soldier.findUnique({
    where: { id },
    include: {
      fatds: { orderBy: { date: "desc" } },
      fos: { orderBy: { date: "desc" } },
    },
  });

  if (!soldier) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ soldier });
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const form = await req.formData();
  const photo = form.get("photo") as File | null;

  // obrigatórios (model)
  const fullName = str(form, "fullName");
  const warName = str(form, "warName");

  const cpfRaw = str(form, "cpf");
  const idtRaw = str(form, "idt");

  const phone = str(form, "phone");
  const emergencyPhone = str(form, "emergencyPhone");
  const naturalidade = str(form, "naturalidade");
  const motherName = str(form, "motherName");
  const fatherName = str(form, "fatherName");
  const address = str(form, "address");

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

  // opcionais / defaults
  const squad = optStr(form, "squad") ?? "Comando";
  const platoon = optEnum<"P1" | "P2" | "P3">(form, "platoon");

  const laranjeira = bool(form, "laranjeira");
  const familyHistory = optStr(form, "familyHistory");
  const professionalExp = optStr(form, "professionalExp");
  const education = optStr(form, "education");

  const hasLicense = bool(form, "hasLicense");
  const licenseCategory = hasLicense ? optStr(form, "licenseCategory") : null;

  const bloodType = optEnum<
    | "A_POS"
    | "A_NEG"
    | "B_POS"
    | "B_NEG"
    | "AB_POS"
    | "AB_NEG"
    | "O_POS"
    | "O_NEG"
  >(form, "bloodType");

  const bank = optEnum<
    "BANCO_DO_BRASIL" | "CAIXA" | "SANTANDER" | "ITAU" | "NUBANK" | "OUTRO"
  >(form, "bank");
  const agency = bank ? optStr(form, "agency") : optStr(form, "agency");
  const account = bank ? optStr(form, "account") : optStr(form, "account");

  const religion = optStr(form, "religion");
  const voterTitle = optStr(form, "voterTitle");

  const isAthlete = bool(form, "isAthlete");
  const physicalActivity = isAthlete ? optStr(form, "physicalActivity") : null;

  const notesPositive = optStr(form, "notesPositive");
  const notesNegative = optStr(form, "notesNegative");

  const facebook = optStr(form, "facebook");
  const instagram = optStr(form, "instagram");
  const healthIssues = optStr(form, "healthIssues");

  const { on: hasGirlfriend, details: girlfriendAddress } = detailsWhen(
    form,
    "hasGirlfriend",
    "girlfriendAddress"
  );
  const { on: usedDrugs, details: drugsDetails } = detailsWhen(
    form,
    "usedDrugs",
    "drugsDetails"
  );

  // ======= NOVOS CAMPOS DO MODEL =======
  const tattoos = optStr(form, "tattoos");
  const childrenCount = optInt(form, "childrenCount");

  const { on: hasBeenArrested, details: arrestDetails } = detailsWhen(
    form,
    "hasBeenArrested",
    "arrestDetails"
  );

  const { on: livesWithParents, details: livesWithWhom } = detailsWhen(
    form,
    "livesWithParents",
    "livesWithWhom"
  );

  const { on: lostCloseFamily, details: lostWhoCause } = detailsWhen(
    form,
    "lostCloseFamily",
    "lostWhoCause"
  );

  const { on: livedAway, details: livedAwayWhere } = detailsWhen(
    form,
    "livedAway",
    "livedAwayWhere"
  );

  const householdCount = optInt(form, "householdCount");

  const familyIncome = optDecimal(form, "familyIncome");
  const helpsFamily = bool(form, "helpsFamily");
  const helpsFamilyAmount = helpsFamily ? optDecimal(form, "helpsFamilyAmount") : null;

  const hasSiblings = bool(form, "hasSiblings");
  const siblingsCount = hasSiblings ? optInt(form, "siblingsCount") : null;

  const smoker = bool(form, "smoker");
  const alcoholUse = bool(form, "alcoholUse");

  const { on: policeProblems, details: policeProblemsDetails } = detailsWhen(
    form,
    "policeProblems",
    "policeProblemsDetails"
  );

  const { on: accidentSequelae, details: accidentSequelaeDetails } = detailsWhen(
    form,
    "accidentSequelae",
    "accidentSequelaeDetails"
  );

  const { on: hadSurgeries, details: surgeriesDetails } = detailsWhen(
    form,
    "hadSurgeries",
    "surgeriesDetails"
  );

  const { on: hasSTDs, details: stdDetails } = detailsWhen(form, "hasSTDs", "stdDetails");

  const hasSeizuresFainting = bool(form, "hasSeizuresFainting");
  const mentalSymptoms = bool(form, "mentalSymptoms");
  const mentalSymptomsDetails = mentalSymptoms ? optStr(form, "mentalSymptomsDetails") : null;

  const suddenFear = bool(form, "suddenFear");

  const irritabilityAnxietyEtc = bool(form, "irritabilityAnxietyEtc");
  const irritabilityAnxietyEtcDetails = irritabilityAnxietyEtc
    ? optStr(form, "irritabilityAnxietyEtcDetails")
    : null;

  const hasMilitaryRelative = bool(form, "hasMilitaryRelative");
  const militaryRelativeDetails = hasMilitaryRelative ? optStr(form, "militaryRelativeDetails") : null;

  const relationshipFather = optStr(form, "relationshipFather");
  const relationshipMother = optStr(form, "relationshipMother");
  const relationshipSiblings = optStr(form, "relationshipSiblings");

  const workedBeforeEB = bool(form, "workedBeforeEB");
  const workSignedCard = bool(form, "workSignedCard");
  const workSalary = optDecimal(form, "workSalary");
  const workDetails = optStr(form, "workDetails");

  const volunteeredToServe = bool(form, "volunteeredToServe");

  // FOTO
  let newPhotoUrl: string | null = null;
  if (photo && photo instanceof File && photo.size > 0) {
    const saved = await saveUploadedImage(photo);
    newPhotoUrl = `/api/uploads/${saved.key}`;
  }

  try {
    const updated = await prisma.soldier.update({
      where: { id },
      data: {
        squad,
        platoon,

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

        facebook,
        instagram,

        healthIssues,

        hasGirlfriend,
        girlfriendAddress,

        usedDrugs,
        drugsDetails,

        tattoos,
        childrenCount,

        hasBeenArrested,
        arrestDetails,

        livesWithParents,
        livesWithWhom,

        lostCloseFamily,
        lostWhoCause,

        livedAway,
        livedAwayWhere,

        householdCount,

        familyIncome,
        helpsFamily,
        helpsFamilyAmount,

        hasSiblings,
        siblingsCount,

        smoker,
        alcoholUse,

        policeProblems,
        policeProblemsDetails,

        accidentSequelae,
        accidentSequelaeDetails,

        hadSurgeries,
        surgeriesDetails,

        hasSTDs,
        stdDetails,

        hasSeizuresFainting,
        mentalSymptoms,
        mentalSymptomsDetails,

        suddenFear,

        irritabilityAnxietyEtc,
        irritabilityAnxietyEtcDetails,

        hasMilitaryRelative,
        militaryRelativeDetails,

        relationshipFather,
        relationshipMother,
        relationshipSiblings,

        workedBeforeEB,
        workSignedCard,
        workSalary,
        workDetails,

        volunteeredToServe,

        ...(newPhotoUrl ? { photoUrl: newPhotoUrl } : {}),
      },
      include: {
        fatds: { orderBy: { date: "desc" } },
        fos: { orderBy: { date: "desc" } },
      },
    });

    return NextResponse.json({ soldier: updated });
  } catch (e: any) {
    if (e?.code === "P2002") {
      const target = Array.isArray(e?.meta?.target) ? e.meta.target.join(", ") : String(e?.meta?.target ?? "");
      if (target.includes("cpf")) {
        return NextResponse.json({ error: "Já existe militar com esse CPF." }, { status: 409 });
      }
      if (target.includes("idt")) {
        return NextResponse.json({ error: "Já existe militar com essa IDT." }, { status: 409 });
      }
      return NextResponse.json({ error: `Campo único duplicado: ${target}` }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Erro ao salvar no banco." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.soldier.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}