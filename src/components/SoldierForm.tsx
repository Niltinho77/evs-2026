"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, Save, ArrowLeft } from "lucide-react";
import { formatCPF, formatPhoneBR, onlyDigits } from "@/lib/format";
import {
  Section,
  Field,
  Input,
  Textarea,
  Select,
  Checkbox,
  Button,
  LinkButton,
  Avatar,
  cn,
} from "@/components/ui";

type Mode = "create" | "edit";

export type Platoon = "" | "P1" | "P2" | "P3";
export type BloodType =
  | ""
  | "A_POS"
  | "A_NEG"
  | "B_POS"
  | "B_NEG"
  | "AB_POS"
  | "AB_NEG"
  | "O_POS"
  | "O_NEG";

export type Bank =
  | ""
  | "BANCO_DO_BRASIL"
  | "CAIXA"
  | "SANTANDER"
  | "ITAU"
  | "NUBANK"
  | "OUTRO";

export type FormState = {
  fullName: string;
  warName: string;

  cpf: string;
  idt: string;

  phone: string;
  emergencyPhone: string;

  naturalidade: string;
  motherName: string;
  fatherName: string;
  address: string;

  platoon: Platoon;

  laranjeira: boolean;
  familyHistory: string;
  professionalExp: string;
  education: string;

  hasLicense: boolean;
  licenseCategory: string;

  bloodType: BloodType;

  bank: Bank;
  agency: string;
  account: string;

  religion: string;
  voterTitle: string;

  isAthlete: boolean;
  physicalActivity: string;

  notesPositive: string;
  notesNegative: string;

  facebook: string;
  instagram: string;

  healthIssues: string;

  hasGirlfriend: boolean;
  girlfriendAddress: string;

  usedDrugs: boolean;
  drugsDetails: string;

  tattoos: string;
  childrenCount: string;

  hasBeenArrested: boolean;
  arrestDetails: string;

  livesWithParents: boolean;
  livesWithWhom: string;

  lostCloseFamily: boolean;
  lostWhoCause: string;

  livedAway: boolean;
  livedAwayWhere: string;

  householdCount: string;

  familyIncome: string;
  helpsFamily: boolean;
  helpsFamilyAmount: string;

  hasSiblings: boolean;
  siblingsCount: string;

  smoker: boolean;
  alcoholUse: boolean;

  policeProblems: boolean;
  policeProblemsDetails: string;

  accidentSequelae: boolean;
  accidentSequelaeDetails: string;

  hadSurgeries: boolean;
  surgeriesDetails: string;

  hasSTDs: boolean;
  stdDetails: string;

  hasSeizuresFainting: boolean;

  mentalSymptoms: boolean;
  mentalSymptomsDetails: string;

  suddenFear: boolean;

  irritabilityAnxietyEtc: boolean;
  irritabilityAnxietyEtcDetails: string;

  hasMilitaryRelative: boolean;
  militaryRelativeDetails: string;

  relationshipFather: string;
  relationshipMother: string;
  relationshipSiblings: string;

  workedBeforeEB: boolean;
  workSignedCard: boolean;
  workSalary: string;
  workDetails: string;

  volunteeredToServe: boolean;

  identidadeMilitar: string;
  altura: string;
  cabelo: string;
  cutis: string;
  corOlhos: string;
  doadorOrgaos: boolean;
};

type Initial = Partial<FormState & { id: string; photoUrl?: string | null }>;

type Props = {
  mode: Mode;
  initial?: Initial;
};

const BLOOD_TYPES: { value: BloodType; label: string }[] = [
  { value: "", label: "—" },
  { value: "A_POS", label: "A+" },
  { value: "A_NEG", label: "A-" },
  { value: "B_POS", label: "B+" },
  { value: "B_NEG", label: "B-" },
  { value: "AB_POS", label: "AB+" },
  { value: "AB_NEG", label: "AB-" },
  { value: "O_POS", label: "O+" },
  { value: "O_NEG", label: "O-" },
];

const BANKS: { value: Bank; label: string }[] = [
  { value: "", label: "—" },
  { value: "BANCO_DO_BRASIL", label: "Banco do Brasil" },
  { value: "CAIXA", label: "Caixa" },
  { value: "SANTANDER", label: "Santander" },
  { value: "ITAU", label: "Itaú" },
  { value: "NUBANK", label: "Nubank" },
  { value: "OUTRO", label: "Outro" },
];

const PLATOONS: { value: Platoon; label: string }[] = [
  { value: "", label: "— (em branco)" },
  { value: "P1", label: "1º Pelotão" },
  { value: "P2", label: "2º Pelotão" },
  { value: "P3", label: "3º Pelotão" },
];

const CABELO_OPTIONS = [
  { value: "", label: "—" },
  { value: "Preto", label: "Preto" },
  { value: "Castanho", label: "Castanho" },
  { value: "Loiro", label: "Loiro" },
  { value: "Ruivo", label: "Ruivo" },
  { value: "Grisalho", label: "Grisalho" },
  { value: "Branco", label: "Branco" },
];

const CUTIS_OPTIONS = [
  { value: "", label: "—" },
  { value: "Claro", label: "Claro" },
  { value: "Médio", label: "Médio" },
  { value: "Escuro", label: "Escuro" },
];

const OLHOS_OPTIONS = [
  { value: "", label: "—" },
  { value: "Castanho", label: "Castanho" },
  { value: "Preto", label: "Preto" },
  { value: "Verde", label: "Verde" },
  { value: "Azul", label: "Azul" },
  { value: "Avelã", label: "Avelã" },
  { value: "Cinza", label: "Cinza" },
];

function normalizeInitial(initial?: Initial): FormState {
  return {
    fullName: initial?.fullName ?? "",
    warName: initial?.warName ?? "",
    cpf: onlyDigits(initial?.cpf ?? ""),
    idt: onlyDigits(initial?.idt ?? "").slice(0, 9),

    phone: initial?.phone ?? "",
    emergencyPhone: initial?.emergencyPhone ?? "",

    naturalidade: initial?.naturalidade ?? "",
    motherName: initial?.motherName ?? "",
    fatherName: initial?.fatherName ?? "",
    address: initial?.address ?? "",

    platoon: (initial?.platoon as Platoon) ?? "",

    laranjeira: Boolean(initial?.laranjeira ?? false),
    familyHistory: initial?.familyHistory ?? "",
    professionalExp: initial?.professionalExp ?? "",
    education: initial?.education ?? "",

    hasLicense: Boolean(initial?.hasLicense ?? false),
    licenseCategory: initial?.licenseCategory ?? "",

    bloodType: (initial?.bloodType as BloodType) ?? "",

    bank: (initial?.bank as Bank) ?? "",
    agency: initial?.agency ?? "",
    account: initial?.account ?? "",

    religion: initial?.religion ?? "",
    voterTitle: initial?.voterTitle ?? "",

    isAthlete: Boolean(initial?.isAthlete ?? false),
    physicalActivity: initial?.physicalActivity ?? "",

    notesPositive: initial?.notesPositive ?? "",
    notesNegative: initial?.notesNegative ?? "",

    facebook: initial?.facebook ?? "",
    instagram: initial?.instagram ?? "",

    healthIssues: initial?.healthIssues ?? "",

    hasGirlfriend: Boolean(initial?.hasGirlfriend ?? false),
    girlfriendAddress: initial?.girlfriendAddress ?? "",

    usedDrugs: Boolean(initial?.usedDrugs ?? false),
    drugsDetails: initial?.drugsDetails ?? "",

    tattoos: initial?.tattoos ?? "",
    childrenCount:
      initial?.childrenCount != null ? String(initial.childrenCount) : "",

    hasBeenArrested: Boolean(initial?.hasBeenArrested ?? false),
    arrestDetails: initial?.arrestDetails ?? "",

    livesWithParents: Boolean(initial?.livesWithParents ?? false),
    livesWithWhom: initial?.livesWithWhom ?? "",

    lostCloseFamily: Boolean(initial?.lostCloseFamily ?? false),
    lostWhoCause: initial?.lostWhoCause ?? "",

    livedAway: Boolean(initial?.livedAway ?? false),
    livedAwayWhere: initial?.livedAwayWhere ?? "",

    householdCount:
      initial?.householdCount != null ? String(initial.householdCount) : "",

    familyIncome:
      initial?.familyIncome != null ? String(initial.familyIncome) : "",
    helpsFamily: Boolean(initial?.helpsFamily ?? false),
    helpsFamilyAmount:
      initial?.helpsFamilyAmount != null
        ? String(initial.helpsFamilyAmount)
        : "",

    hasSiblings: Boolean(initial?.hasSiblings ?? false),
    siblingsCount:
      initial?.siblingsCount != null ? String(initial.siblingsCount) : "",

    smoker: Boolean(initial?.smoker ?? false),
    alcoholUse: Boolean(initial?.alcoholUse ?? false),

    policeProblems: Boolean(initial?.policeProblems ?? false),
    policeProblemsDetails: initial?.policeProblemsDetails ?? "",

    accidentSequelae: Boolean(initial?.accidentSequelae ?? false),
    accidentSequelaeDetails: initial?.accidentSequelaeDetails ?? "",

    hadSurgeries: Boolean(initial?.hadSurgeries ?? false),
    surgeriesDetails: initial?.surgeriesDetails ?? "",

    hasSTDs: Boolean(initial?.hasSTDs ?? false),
    stdDetails: initial?.stdDetails ?? "",

    hasSeizuresFainting: Boolean(initial?.hasSeizuresFainting ?? false),

    mentalSymptoms: Boolean(initial?.mentalSymptoms ?? false),
    mentalSymptomsDetails: initial?.mentalSymptomsDetails ?? "",

    suddenFear: Boolean(initial?.suddenFear ?? false),

    irritabilityAnxietyEtc: Boolean(initial?.irritabilityAnxietyEtc ?? false),
    irritabilityAnxietyEtcDetails: initial?.irritabilityAnxietyEtcDetails ?? "",

    hasMilitaryRelative: Boolean(initial?.hasMilitaryRelative ?? false),
    militaryRelativeDetails: initial?.militaryRelativeDetails ?? "",

    relationshipFather: initial?.relationshipFather ?? "",
    relationshipMother: initial?.relationshipMother ?? "",
    relationshipSiblings: initial?.relationshipSiblings ?? "",

    workedBeforeEB: Boolean(initial?.workedBeforeEB ?? false),
    workSignedCard: Boolean(initial?.workSignedCard ?? false),
    workSalary: initial?.workSalary != null ? String(initial.workSalary) : "",
    workDetails: initial?.workDetails ?? "",

    volunteeredToServe: Boolean(initial?.volunteeredToServe ?? false),

    identidadeMilitar: initial?.identidadeMilitar ?? "",
    altura: initial?.altura != null ? String(initial.altura) : "",
    cabelo: initial?.cabelo ?? "",
    cutis: initial?.cutis ?? "",
    corOlhos: initial?.corOlhos ?? "",
    doadorOrgaos: Boolean(initial?.doadorOrgaos ?? false),
  };
}

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid gap-3 sm:grid-cols-2">{children}</div>
);

const Grid3 = ({ children }: { children: React.ReactNode }) => (
  <div className="grid gap-3 sm:grid-cols-3">{children}</div>
);

export default function SoldierForm({ mode, initial }: Props) {
  const [saving, setSaving] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [form, setForm] = useState<FormState>(() => normalizeInitial(initial));

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!photoFile) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const previewUrl = objectUrl ?? initial?.photoUrl ?? null;

  function pickPhoto() {
    fileRef.current?.click();
  }

  async function submit(): Promise<void> {
    setSaving(true);
    try {
      const fd = new FormData();
      if (photoFile) fd.set("photo", photoFile);

      (Object.keys(form) as (keyof FormState)[]).forEach((k) => {
        fd.set(k, String(form[k]));
      });

      const endpoint =
        mode === "create" ? "/api/soldiers" : `/api/soldiers/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(endpoint, { method, body: fd });
      const data: { soldier?: { id?: string }; error?: string } =
        await res.json();

      if (!res.ok) {
        alert(data?.error ?? "Erro ao salvar.");
        return;
      }

      const id = data?.soldier?.id ?? initial?.id;
      window.location.href = `/soldiers/${id}`;
    } finally {
      setSaving(false);
    }
  }

  const athleteDisabled = !form.isAthlete;
  const cnhDisabled = !form.hasLicense;

  return (
    <div className="space-y-5 pb-28">
      {/* FOTO */}
      <Section title="Foto">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Avatar
            src={previewUrl ?? undefined}
            size={104}
            ring
            fallback={
              <div className="grid h-full w-full place-items-center text-[10px] uppercase text-faint">
                Sem foto
              </div>
            }
          />
          <div className="flex-1 space-y-2">
            <Button
              type="button"
              variant="secondary"
              onClick={pickPhoto}
              leftIcon={<Camera size={14} />}
            >
              {previewUrl ? "Trocar foto" : "Adicionar foto"}
            </Button>
            <p className="text-xs text-muted">
              Use a câmera traseira em retrato. JPG ou PNG até 5MB.
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setPhotoFile(f);
                if (e.target) e.target.value = "";
              }}
            />
          </div>
        </div>
      </Section>

      {/* IDENTIFICAÇÃO */}
      <Section title="Identificação" description="Dados básicos e físicos">
        <Grid>
          <Field label="Nome completo" required>
            <Input
              value={form.fullName}
              onChange={(e) => setField("fullName", e.target.value)}
              autoCapitalize="words"
            />
          </Field>
          <Field label="Nome de guerra" required>
            <Input
              value={form.warName}
              onChange={(e) => setField("warName", e.target.value)}
              autoCapitalize="words"
            />
          </Field>
          <Field label="CPF" required>
            <Input
              value={formatCPF(form.cpf)}
              onChange={(e) =>
                setField("cpf", onlyDigits(e.target.value).slice(0, 11))
              }
              inputMode="numeric"
              autoComplete="off"
            />
          </Field>
          <Field label="IDT" required>
            <Input
              value={form.idt}
              onChange={(e) =>
                setField("idt", onlyDigits(e.target.value).slice(0, 9))
              }
              inputMode="numeric"
              autoComplete="off"
            />
          </Field>
          <Field label="Identidade Militar (IM)">
            <Input
              value={form.identidadeMilitar}
              onChange={(e) => setField("identidadeMilitar", e.target.value)}
              inputMode="numeric"
            />
          </Field>
          <Field label="Altura (cm)">
            <Input
              value={form.altura}
              onChange={(e) =>
                setField("altura", onlyDigits(e.target.value).slice(0, 3))
              }
              inputMode="numeric"
            />
          </Field>
          <Field label="Cabelo">
            <Select
              value={form.cabelo}
              onChange={(e) => setField("cabelo", e.target.value)}
            >
              {CABELO_OPTIONS.map((o) => (
                <option key={o.value || "blank"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Cútis">
            <Select
              value={form.cutis}
              onChange={(e) => setField("cutis", e.target.value)}
            >
              {CUTIS_OPTIONS.map((o) => (
                <option key={o.value || "blank"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Cor dos olhos">
            <Select
              value={form.corOlhos}
              onChange={(e) => setField("corOlhos", e.target.value)}
            >
              {OLHOS_OPTIONS.map((o) => (
                <option key={o.value || "blank"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Telefone">
            <Input
              value={formatPhoneBR(form.phone)}
              onChange={(e) => setField("phone", formatPhoneBR(e.target.value))}
              inputMode="numeric"
              autoComplete="tel"
            />
          </Field>
          <Field label="Telefone emergência">
            <Input
              value={formatPhoneBR(form.emergencyPhone)}
              onChange={(e) =>
                setField("emergencyPhone", formatPhoneBR(e.target.value))
              }
              inputMode="numeric"
            />
          </Field>
          <Field label="Naturalidade">
            <Input
              value={form.naturalidade}
              onChange={(e) => setField("naturalidade", e.target.value)}
              autoCapitalize="words"
            />
          </Field>
          <Field label="Nome da mãe">
            <Input
              value={form.motherName}
              onChange={(e) => setField("motherName", e.target.value)}
              autoCapitalize="words"
            />
          </Field>
          <Field label="Nome do pai">
            <Input
              value={form.fatherName}
              onChange={(e) => setField("fatherName", e.target.value)}
              autoCapitalize="words"
            />
          </Field>
        </Grid>
        <div className="mt-3 grid gap-3">
          <Field label="Endereço">
            <Input
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
              autoCapitalize="sentences"
            />
          </Field>
          <Checkbox
            label="Doador de órgãos"
            checked={form.doadorOrgaos}
            onChange={(v) => setField("doadorOrgaos", v)}
          />
        </div>
      </Section>

      {/* DADOS MILITARES */}
      <Section title="Dados militares">
        <Grid>
          <Field label="Pelotão">
            <Select
              value={form.platoon}
              onChange={(e) =>
                setField("platoon", e.target.value as Platoon)
              }
            >
              {PLATOONS.map((o) => (
                <option key={o.value || "blank"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Tipo sanguíneo">
            <Select
              value={form.bloodType}
              onChange={(e) =>
                setField("bloodType", e.target.value as BloodType)
              }
            >
              {BLOOD_TYPES.map((o) => (
                <option key={o.value || "blank"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Religião">
            <Input
              value={form.religion}
              onChange={(e) => setField("religion", e.target.value)}
            />
          </Field>
          <Field label="Título de eleitor">
            <Input
              value={form.voterTitle}
              onChange={(e) => setField("voterTitle", e.target.value)}
            />
          </Field>
        </Grid>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Checkbox
            label="Laranjeira"
            description="Marca interna do esquadrão"
            checked={form.laranjeira}
            onChange={(v) => setField("laranjeira", v)}
          />
          <Checkbox
            label="Voluntariou-se para servir"
            checked={form.volunteeredToServe}
            onChange={(v) => setField("volunteeredToServe", v)}
          />
          <Checkbox
            label="Possui CNH"
            checked={form.hasLicense}
            onChange={(v) => {
              setField("hasLicense", v);
              if (!v) setField("licenseCategory", "");
            }}
          />
          <Field label="Categoria CNH">
            <Input
              value={form.licenseCategory}
              onChange={(e) => setField("licenseCategory", e.target.value)}
              disabled={cnhDisabled}
              placeholder={cnhDisabled ? "Marque CNH para preencher" : "Ex: B"}
            />
          </Field>
          <Checkbox
            label="Atleta"
            checked={form.isAthlete}
            onChange={(v) => {
              setField("isAthlete", v);
              if (!v) setField("physicalActivity", "");
            }}
          />
          <Field label="Atividade física">
            <Input
              value={form.physicalActivity}
              onChange={(e) => setField("physicalActivity", e.target.value)}
              disabled={athleteDisabled}
              placeholder={athleteDisabled ? "Marque Atleta para preencher" : "Ex: corrida"}
            />
          </Field>
        </div>
      </Section>

      {/* BANCO */}
      <Section title="Banco">
        <Grid3>
          <Field label="Banco">
            <Select
              value={form.bank}
              onChange={(e) => setField("bank", e.target.value as Bank)}
            >
              {BANKS.map((o) => (
                <option key={o.value || "blank"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Agência">
            <Input
              value={form.agency}
              onChange={(e) => setField("agency", e.target.value)}
            />
          </Field>
          <Field label="Conta">
            <Input
              value={form.account}
              onChange={(e) => setField("account", e.target.value)}
            />
          </Field>
        </Grid3>
      </Section>

      {/* SOCIAL / RELACIONAMENTO */}
      <Section title="Social e relacionamento">
        <Grid>
          <Field label="Facebook">
            <Input
              value={form.facebook}
              onChange={(e) => setField("facebook", e.target.value)}
              placeholder="link ou usuário"
            />
          </Field>
          <Field label="Instagram">
            <Input
              value={form.instagram}
              onChange={(e) => setField("instagram", e.target.value)}
              placeholder="@usuario"
            />
          </Field>
        </Grid>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Checkbox
            label="Namorada"
            checked={form.hasGirlfriend}
            onChange={(v) => {
              setField("hasGirlfriend", v);
              if (!v) setField("girlfriendAddress", "");
            }}
          />
          <Checkbox
            label="Parente militar"
            checked={form.hasMilitaryRelative}
            onChange={(v) => {
              setField("hasMilitaryRelative", v);
              if (!v) setField("militaryRelativeDetails", "");
            }}
          />
        </div>
        {form.hasGirlfriend && (
          <div className="mt-3">
            <Field label="Endereço da namorada (ponto de referência)">
              <Textarea
                value={form.girlfriendAddress}
                onChange={(e) => setField("girlfriendAddress", e.target.value)}
              />
            </Field>
          </div>
        )}
        {form.hasMilitaryRelative && (
          <div className="mt-3">
            <Field label="Detalhes do parente militar">
              <Textarea
                value={form.militaryRelativeDetails}
                onChange={(e) =>
                  setField("militaryRelativeDetails", e.target.value)
                }
              />
            </Field>
          </div>
        )}
      </Section>

      {/* PERFIL / FAMÍLIA */}
      <Section title="Perfil e família">
        <div className="grid gap-3">
          <Field label="Tatuagens">
            <Textarea
              value={form.tattoos}
              onChange={(e) => setField("tattoos", e.target.value)}
            />
          </Field>
          <Grid3>
            <Field label="Qtd. filhos">
              <Input
                value={form.childrenCount}
                onChange={(e) =>
                  setField("childrenCount", onlyDigits(e.target.value))
                }
                inputMode="numeric"
              />
            </Field>
            <Field label="Pessoas na casa">
              <Input
                value={form.householdCount}
                onChange={(e) =>
                  setField("householdCount", onlyDigits(e.target.value))
                }
                inputMode="numeric"
              />
            </Field>
            <Field label="Qtd. irmãos">
              <Input
                value={form.siblingsCount}
                onChange={(e) =>
                  setField("siblingsCount", onlyDigits(e.target.value))
                }
                inputMode="numeric"
                disabled={!form.hasSiblings}
              />
            </Field>
          </Grid3>
          <Grid>
            <Checkbox
              label="Mora com os pais"
              checked={form.livesWithParents}
              onChange={(v) => {
                setField("livesWithParents", v);
                if (!v) setField("livesWithWhom", "");
              }}
            />
            <Checkbox
              label="Tem irmãos"
              checked={form.hasSiblings}
              onChange={(v) => {
                setField("hasSiblings", v);
                if (!v) setField("siblingsCount", "");
              }}
            />
            <Checkbox
              label="Perdeu familiar próximo"
              checked={form.lostCloseFamily}
              onChange={(v) => {
                setField("lostCloseFamily", v);
                if (!v) setField("lostWhoCause", "");
              }}
            />
            <Checkbox
              label="Já morou fora"
              checked={form.livedAway}
              onChange={(v) => {
                setField("livedAway", v);
                if (!v) setField("livedAwayWhere", "");
              }}
            />
          </Grid>
          {form.livesWithParents ? (
            <Field label="Mora com quem?">
              <Textarea
                value={form.livesWithWhom}
                onChange={(e) => setField("livesWithWhom", e.target.value)}
              />
            </Field>
          ) : null}
          {form.lostCloseFamily ? (
            <Field label="Quem / causa">
              <Textarea
                value={form.lostWhoCause}
                onChange={(e) => setField("lostWhoCause", e.target.value)}
              />
            </Field>
          ) : null}
          {form.livedAway ? (
            <Field label="Onde morou fora">
              <Textarea
                value={form.livedAwayWhere}
                onChange={(e) => setField("livedAwayWhere", e.target.value)}
              />
            </Field>
          ) : null}
          <Grid>
            <Field label="Relação com a mãe">
              <Textarea
                value={form.relationshipMother}
                onChange={(e) =>
                  setField("relationshipMother", e.target.value)
                }
              />
            </Field>
            <Field label="Relação com o pai">
              <Textarea
                value={form.relationshipFather}
                onChange={(e) =>
                  setField("relationshipFather", e.target.value)
                }
              />
            </Field>
            <Field label="Relação com irmãos">
              <Textarea
                value={form.relationshipSiblings}
                onChange={(e) =>
                  setField("relationshipSiblings", e.target.value)
                }
              />
            </Field>
          </Grid>
        </div>
      </Section>

      {/* RENDA / TRABALHO */}
      <Section title="Renda e trabalho">
        <Grid>
          <Field label="Renda familiar (R$)">
            <Input
              value={form.familyIncome}
              onChange={(e) => setField("familyIncome", e.target.value)}
              inputMode="decimal"
              placeholder="Ex: 2500.00"
            />
          </Field>
          <Field label="Salário antes do EB (R$)">
            <Input
              value={form.workSalary}
              onChange={(e) => setField("workSalary", e.target.value)}
              inputMode="decimal"
              placeholder="Ex: 1800.00"
              disabled={!form.workedBeforeEB}
            />
          </Field>
        </Grid>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Checkbox
            label="Ajuda a família"
            checked={form.helpsFamily}
            onChange={(v) => {
              setField("helpsFamily", v);
              if (!v) setField("helpsFamilyAmount", "");
            }}
          />
          <Field label="Quanto ajuda (R$)">
            <Input
              value={form.helpsFamilyAmount}
              onChange={(e) => setField("helpsFamilyAmount", e.target.value)}
              inputMode="decimal"
              disabled={!form.helpsFamily}
            />
          </Field>
          <Checkbox
            label="Trabalhou antes do EB"
            checked={form.workedBeforeEB}
            onChange={(v) => {
              setField("workedBeforeEB", v);
              if (!v) {
                setField("workSignedCard", false);
                setField("workSalary", "");
                setField("workDetails", "");
              }
            }}
          />
          <Checkbox
            label="Carteira assinada"
            checked={form.workSignedCard}
            onChange={(v) => setField("workSignedCard", v)}
            disabled={!form.workedBeforeEB}
          />
        </div>
        {form.workedBeforeEB && (
          <div className="mt-3">
            <Field label="Detalhes do trabalho">
              <Textarea
                value={form.workDetails}
                onChange={(e) => setField("workDetails", e.target.value)}
              />
            </Field>
          </div>
        )}
      </Section>

      {/* SAÚDE */}
      <Section title="Saúde">
        <Field label="Problemas de saúde">
          <Textarea
            value={form.healthIssues}
            onChange={(e) => setField("healthIssues", e.target.value)}
          />
        </Field>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Checkbox
            label="Já fez cirurgias"
            checked={form.hadSurgeries}
            onChange={(v) => {
              setField("hadSurgeries", v);
              if (!v) setField("surgeriesDetails", "");
            }}
          />
          <Checkbox
            label="Sequelas de acidente"
            checked={form.accidentSequelae}
            onChange={(v) => {
              setField("accidentSequelae", v);
              if (!v) setField("accidentSequelaeDetails", "");
            }}
          />
          <Checkbox
            label="IST/DST"
            checked={form.hasSTDs}
            onChange={(v) => {
              setField("hasSTDs", v);
              if (!v) setField("stdDetails", "");
            }}
          />
          <Checkbox
            label="Convulsões/desmaios"
            checked={form.hasSeizuresFainting}
            onChange={(v) => setField("hasSeizuresFainting", v)}
          />
          <Checkbox
            label="Sintomas mentais"
            checked={form.mentalSymptoms}
            onChange={(v) => {
              setField("mentalSymptoms", v);
              if (!v) setField("mentalSymptomsDetails", "");
            }}
          />
          <Checkbox
            label="Medo súbito"
            checked={form.suddenFear}
            onChange={(v) => setField("suddenFear", v)}
          />
          <Checkbox
            label="Irritabilidade/ansiedade etc."
            checked={form.irritabilityAnxietyEtc}
            onChange={(v) => {
              setField("irritabilityAnxietyEtc", v);
              if (!v) setField("irritabilityAnxietyEtcDetails", "");
            }}
          />
        </div>
        {form.hadSurgeries && (
          <div className="mt-3">
            <Field label="Detalhes das cirurgias">
              <Textarea
                value={form.surgeriesDetails}
                onChange={(e) => setField("surgeriesDetails", e.target.value)}
              />
            </Field>
          </div>
        )}
        {form.accidentSequelae && (
          <div className="mt-3">
            <Field label="Detalhes (sequelas)">
              <Textarea
                value={form.accidentSequelaeDetails}
                onChange={(e) =>
                  setField("accidentSequelaeDetails", e.target.value)
                }
              />
            </Field>
          </div>
        )}
        {form.hasSTDs && (
          <div className="mt-3">
            <Field label="Detalhes IST/DST">
              <Textarea
                value={form.stdDetails}
                onChange={(e) => setField("stdDetails", e.target.value)}
              />
            </Field>
          </div>
        )}
        {form.mentalSymptoms && (
          <div className="mt-3">
            <Field label="Detalhes (sintomas mentais)">
              <Textarea
                value={form.mentalSymptomsDetails}
                onChange={(e) =>
                  setField("mentalSymptomsDetails", e.target.value)
                }
              />
            </Field>
          </div>
        )}
        {form.irritabilityAnxietyEtc && (
          <div className="mt-3">
            <Field label="Detalhes (irritabilidade/ansiedade)">
              <Textarea
                value={form.irritabilityAnxietyEtcDetails}
                onChange={(e) =>
                  setField("irritabilityAnxietyEtcDetails", e.target.value)
                }
              />
            </Field>
          </div>
        )}
      </Section>

      {/* HÁBITOS / OCORRÊNCIAS */}
      <Section title="Hábitos e ocorrências">
        <div className="grid gap-3 sm:grid-cols-2">
          <Checkbox
            label="Fumante"
            checked={form.smoker}
            onChange={(v) => setField("smoker", v)}
          />
          <Checkbox
            label="Consome álcool"
            checked={form.alcoholUse}
            onChange={(v) => setField("alcoholUse", v)}
          />
          <Checkbox
            label="Já usou drogas"
            checked={form.usedDrugs}
            onChange={(v) => {
              setField("usedDrugs", v);
              if (!v) setField("drugsDetails", "");
            }}
          />
          <Checkbox
            label="Já foi preso"
            checked={form.hasBeenArrested}
            onChange={(v) => {
              setField("hasBeenArrested", v);
              if (!v) setField("arrestDetails", "");
            }}
          />
          <Checkbox
            label="Problemas com a polícia"
            checked={form.policeProblems}
            onChange={(v) => {
              setField("policeProblems", v);
              if (!v) setField("policeProblemsDetails", "");
            }}
          />
        </div>
        {form.usedDrugs && (
          <div className="mt-3">
            <Field label="Quais drogas">
              <Textarea
                value={form.drugsDetails}
                onChange={(e) => setField("drugsDetails", e.target.value)}
              />
            </Field>
          </div>
        )}
        {form.hasBeenArrested && (
          <div className="mt-3">
            <Field label="Detalhes da prisão">
              <Textarea
                value={form.arrestDetails}
                onChange={(e) => setField("arrestDetails", e.target.value)}
              />
            </Field>
          </div>
        )}
        {form.policeProblems && (
          <div className="mt-3">
            <Field label="Detalhes (polícia)">
              <Textarea
                value={form.policeProblemsDetails}
                onChange={(e) =>
                  setField("policeProblemsDetails", e.target.value)
                }
              />
            </Field>
          </div>
        )}
      </Section>

      {/* HISTÓRICO / OBSERVAÇÕES */}
      <Section title="Histórico e observações livres">
        <div className="grid gap-3">
          <Field label="Histórico familiar">
            <Textarea
              value={form.familyHistory}
              onChange={(e) => setField("familyHistory", e.target.value)}
            />
          </Field>
          <Field label="Experiência profissional">
            <Textarea
              value={form.professionalExp}
              onChange={(e) => setField("professionalExp", e.target.value)}
            />
          </Field>
          <Field label="Escolaridade">
            <Textarea
              value={form.education}
              onChange={(e) => setField("education", e.target.value)}
            />
          </Field>
          <Field label="Observações positivas">
            <Textarea
              value={form.notesPositive}
              onChange={(e) => setField("notesPositive", e.target.value)}
            />
          </Field>
          <Field label="Observações negativas">
            <Textarea
              value={form.notesNegative}
              onChange={(e) => setField("notesNegative", e.target.value)}
            />
          </Field>
        </div>
      </Section>

      {/* AÇÕES */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          onClick={submit}
          loading={saving}
          size="lg"
          className="flex-1"
          leftIcon={<Save size={16} />}
        >
          {saving ? "Salvando…" : "Salvar"}
        </Button>
        <LinkButton
          href={initial?.id ? `/soldiers/${initial.id}` : "/"}
          variant="ghost"
          size="lg"
          leftIcon={<ArrowLeft size={16} />}
        >
          Cancelar
        </LinkButton>
      </div>

      {/* STICKY SAVE BAR (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line glass sm:hidden">
        <div className="px-4 py-3">
          <Button
            type="button"
            onClick={submit}
            loading={saving}
            size="lg"
            className="w-full"
            leftIcon={<Save size={16} />}
          >
            {saving ? "Salvando…" : "Salvar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
