"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { formatCPF, formatPhoneBR, onlyDigits } from "@/lib/format";

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

  // guarda só dígitos
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
  childrenCount: string; // guardamos como string no form e convertemos na API (ou manda e converte no route)

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
};

type Initial = Partial<
  FormState & {
    id: string;
    photoUrl?: string | null;
  }
>;

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
    childrenCount: initial?.childrenCount != null ? String(initial.childrenCount) : "",

    hasBeenArrested: Boolean(initial?.hasBeenArrested ?? false),
    arrestDetails: initial?.arrestDetails ?? "",

    livesWithParents: Boolean(initial?.livesWithParents ?? false),
    livesWithWhom: initial?.livesWithWhom ?? "",

    lostCloseFamily: Boolean(initial?.lostCloseFamily ?? false),
    lostWhoCause: initial?.lostWhoCause ?? "",

    livedAway: Boolean(initial?.livedAway ?? false),
    livedAwayWhere: initial?.livedAwayWhere ?? "",

    householdCount: initial?.householdCount != null ? String(initial.householdCount) : "",

    familyIncome: initial?.familyIncome != null ? String(initial.familyIncome) : "",
    helpsFamily: Boolean(initial?.helpsFamily ?? false),
    helpsFamilyAmount: initial?.helpsFamilyAmount != null ? String(initial.helpsFamilyAmount) : "",

    hasSiblings: Boolean(initial?.hasSiblings ?? false),
    siblingsCount: initial?.siblingsCount != null ? String(initial.siblingsCount) : "",

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
  };
}

export default function SoldierForm({ mode, initial }: Props) {
  const [saving, setSaving] = useState(false);

  // FOTO
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [form, setForm] = useState<FormState>(() => normalizeInitial(initial));

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // preview com cleanup (evita leak)
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
    <div className="space-y-6 pb-4">
      <Section title="Foto">
        <div className="flex items-center gap-4">
          <div className="h-28 w-28 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Foto do militar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                sem foto
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <button
              type="button"
              onClick={pickPhoto}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm font-semibold text-zinc-200 active:scale-[0.99]"
            >
              {previewUrl
                ? "Trocar foto (câmera/galeria)"
                : "Adicionar foto (câmera)"}
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const f = e.target.files?.[0] ?? null;
                setPhotoFile(f);
                if (e.target) e.target.value = "";
              }}
            />
          </div>
        </div>
      </Section>

      <Section title="Identificação">
        <Grid>
          <Input
            label="Nome completo"
            value={form.fullName}
            onChange={(v) => setField("fullName", v)}
            autoCapitalize="words"
          />
          <Input
            label="Nome de guerra"
            value={form.warName}
            onChange={(v) => setField("warName", v)}
            autoCapitalize="words"
          />

          <Input
            label="CPF"
            value={formatCPF(form.cpf)}
            onChange={(v) => setField("cpf", onlyDigits(v).slice(0, 11))}
            inputMode="numeric"
            autoComplete="off"
          />

          <Input
            label="IDT"
            value={form.idt}
            onChange={(v) => setField("idt", onlyDigits(v).slice(0, 9))}
            inputMode="numeric"
            autoComplete="off"
          />

          <Input
            label="Telefone"
            value={formatPhoneBR(form.phone)}
            onChange={(v) => setField("phone", formatPhoneBR(v))}
            inputMode="numeric"
            autoComplete="tel"
          />

          <Input
            label="Telefone emergência"
            value={formatPhoneBR(form.emergencyPhone)}
            onChange={(v) => setField("emergencyPhone", formatPhoneBR(v))}
            inputMode="numeric"
            autoComplete="tel"
          />

          <Input
            label="Naturalidade"
            value={form.naturalidade}
            onChange={(v) => setField("naturalidade", v)}
            autoCapitalize="words"
          />
          <Input
            label="Nome da mãe"
            value={form.motherName}
            onChange={(v) => setField("motherName", v)}
            autoCapitalize="words"
          />
          <Input
            label="Nome do pai"
            value={form.fatherName}
            onChange={(v) => setField("fatherName", v)}
            autoCapitalize="words"
          />
          <Input
            label="Endereço"
            value={form.address}
            onChange={(v) => setField("address", v)}
            autoCapitalize="sentences"
          />
        </Grid>
      </Section>

      <Section title="Dados Militares">
        <Grid>
          <Select
            label="Pelotão"
            value={form.platoon}
            options={PLATOONS}
            onChange={(v) => setField("platoon", v)}
          />

          <Checkbox
            label="Laranjeira"
            checked={form.laranjeira}
            onChange={(v) => setField("laranjeira", v)}
          />

          <Checkbox
            label="Possui habilitação (CNH)"
            checked={form.hasLicense}
            onChange={(v) => {
              setField("hasLicense", v);
              if (!v) setField("licenseCategory", "");
            }}
          />

          <Input
            label="Categoria CNH"
            value={form.licenseCategory}
            onChange={(v) => setField("licenseCategory", v)}
            disabled={cnhDisabled}
            placeholder={
              cnhDisabled
                ? "Ative 'Possui habilitação' para preencher"
                : "Ex: B"
            }
          />

          <Select
            label="Tipo sanguíneo"
            value={form.bloodType}
            options={BLOOD_TYPES}
            onChange={(v) => setField("bloodType", v)}
          />

          <Select
            label="Banco"
            value={form.bank}
            options={BANKS}
            onChange={(v) => setField("bank", v)}
          />

          <Input label="Agência" value={form.agency} onChange={(v) => setField("agency", v)} />
          <Input label="Conta" value={form.account} onChange={(v) => setField("account", v)} />

          <Input label="Religião" value={form.religion} onChange={(v) => setField("religion", v)} />
          <Input
            label="Título de eleitor"
            value={form.voterTitle}
            onChange={(v) => setField("voterTitle", v)}
          />

          <Checkbox
            label="Atleta"
            checked={form.isAthlete}
            onChange={(v) => {
              setField("isAthlete", v);
              if (!v) setField("physicalActivity", "");
            }}
          />

          <Input
            label="Qual atividade física"
            value={form.physicalActivity}
            onChange={(v) => setField("physicalActivity", v)}
            disabled={athleteDisabled}
            placeholder={
              athleteDisabled ? "Ative 'Atleta' para preencher" : "Ex: corrida, futebol"
            }
          />
        </Grid>
      </Section>

      <Section title="Social / Saúde / Relacionamento">
        <Grid>
          <Input
            label="Facebook"
            value={form.facebook}
            onChange={(v) => setField("facebook", v)}
            placeholder="link ou usuário"
          />
          <Input
            label="Instagram"
            value={form.instagram}
            onChange={(v) => setField("instagram", v)}
            placeholder="@usuario"
          />
        </Grid>

        <Textarea
          label="Problemas de saúde"
          value={form.healthIssues}
          onChange={(v) => setField("healthIssues", v)}
        />

        <Grid>
          <Checkbox
            label="Namorada"
            checked={form.hasGirlfriend}
            onChange={(v) => {
              setField("hasGirlfriend", v);
              if (!v) setField("girlfriendAddress", "");
            }}
          />
          <div />
        </Grid>

        {form.hasGirlfriend && (
          <Textarea
            label="Endereço da namorada (ponto de referência)"
            value={form.girlfriendAddress}
            onChange={(v) => setField("girlfriendAddress", v)}
          />
        )}

        <Grid>
          <Checkbox
            label="Já usou drogas"
            checked={form.usedDrugs}
            onChange={(v) => {
              setField("usedDrugs", v);
              if (!v) setField("drugsDetails", "");
            }}
          />
          <div />
        </Grid>

        {form.usedDrugs && (
          <Textarea
            label="Quais?"
            value={form.drugsDetails}
            onChange={(v) => setField("drugsDetails", v)}
          />
        )}
      </Section>

      <Section title="Histórico / Observações">
        <Textarea
          label="Histórico familiar"
          value={form.familyHistory}
          onChange={(v) => setField("familyHistory", v)}
        />
        <Textarea
          label="Experiência profissional"
          value={form.professionalExp}
          onChange={(v) => setField("professionalExp", v)}
        />
        <Textarea
          label="Escolaridade"
          value={form.education}
          onChange={(v) => setField("education", v)}
        />
        <Textarea
          label="Fatos observados positivos (campo)"
          value={form.notesPositive}
          onChange={(v) => setField("notesPositive", v)}
        />
        <Textarea
          label="Fatos observados negativos (campo)"
          value={form.notesNegative}
          onChange={(v) => setField("notesNegative", v)}
        />
      </Section>

      <Section title="Perfil / Família">
  <Textarea label="Tatuagens" value={form.tattoos} onChange={(v) => setField("tattoos", v)} />
  <Input
    label="Qtd. filhos"
    value={form.childrenCount}
    onChange={(v) => setField("childrenCount", onlyDigits(v))}
    inputMode="numeric"
  />

  <Checkbox
    label="Mora com os pais"
    checked={form.livesWithParents}
    onChange={(v) => {
      setField("livesWithParents", v);
      if (!v) setField("livesWithWhom", "");
    }}
  />

  {form.livesWithParents ? (
    <Textarea label="Mora com quem?" value={form.livesWithWhom} onChange={(v) => setField("livesWithWhom", v)} />
  ) : null}

  <Checkbox
    label="Tem irmãos"
    checked={form.hasSiblings}
    onChange={(v) => {
      setField("hasSiblings", v);
      if (!v) setField("siblingsCount", "");
    }}
  />

  {form.hasSiblings ? (
    <Input
      label="Qtd. irmãos"
      value={form.siblingsCount}
      onChange={(v) => setField("siblingsCount", onlyDigits(v))}
      inputMode="numeric"
    />
  ) : null}

  <Checkbox
    label="Perdeu familiar próximo"
    checked={form.lostCloseFamily}
    onChange={(v) => {
      setField("lostCloseFamily", v);
      if (!v) setField("lostWhoCause", "");
    }}
  />

  {form.lostCloseFamily ? (
    <Textarea label="Quem / causa" value={form.lostWhoCause} onChange={(v) => setField("lostWhoCause", v)} />
  ) : null}

  <Checkbox
    label="Já morou fora"
    checked={form.livedAway}
    onChange={(v) => {
      setField("livedAway", v);
      if (!v) setField("livedAwayWhere", "");
    }}
  />

  {form.livedAway ? (
    <Textarea label="Onde morou fora" value={form.livedAwayWhere} onChange={(v) => setField("livedAwayWhere", v)} />
  ) : null}

  <Input
    label="Qtd. pessoas na casa"
    value={form.householdCount}
    onChange={(v) => setField("householdCount", onlyDigits(v))}
    inputMode="numeric"
  />
</Section>

<Section title="Renda / Trabalho">
  <Input
    label="Renda familiar (R$)"
    value={form.familyIncome}
    onChange={(v) => setField("familyIncome", v)}
    inputMode="decimal"
    placeholder="Ex: 2500.00"
  />

  <Checkbox
    label="Ajuda a família"
    checked={form.helpsFamily}
    onChange={(v) => {
      setField("helpsFamily", v);
      if (!v) setField("helpsFamilyAmount", "");
    }}
  />

  {form.helpsFamily ? (
    <Input
      label="Valor que ajuda (R$)"
      value={form.helpsFamilyAmount}
      onChange={(v) => setField("helpsFamilyAmount", v)}
      inputMode="decimal"
      placeholder="Ex: 300.00"
    />
  ) : null}

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

  {form.workedBeforeEB ? (
    <>
      <Checkbox
        label="Carteira assinada"
        checked={form.workSignedCard}
        onChange={(v) => setField("workSignedCard", v)}
      />
      <Input
        label="Salário (R$)"
        value={form.workSalary}
        onChange={(v) => setField("workSalary", v)}
        inputMode="decimal"
        placeholder="Ex: 1800.00"
      />
      <Textarea
        label="Detalhes (trabalho)"
        value={form.workDetails}
        onChange={(v) => setField("workDetails", v)}
      />
    </>
  ) : null}

  <Checkbox
    label="Se voluntariou para servir"
    checked={form.volunteeredToServe}
    onChange={(v) => setField("volunteeredToServe", v)}
  />
</Section>

<Section title="Hábitos / Ocorrências / Saúde (detalhado)">
  <Grid>
    <Checkbox label="Fumante" checked={form.smoker} onChange={(v) => setField("smoker", v)} />
    <Checkbox label="Consome álcool" checked={form.alcoholUse} onChange={(v) => setField("alcoholUse", v)} />
  </Grid>

  <Checkbox
    label="Já foi preso"
    checked={form.hasBeenArrested}
    onChange={(v) => {
      setField("hasBeenArrested", v);
      if (!v) setField("arrestDetails", "");
    }}
  />
  {form.hasBeenArrested ? (
    <Textarea label="Detalhes da prisão" value={form.arrestDetails} onChange={(v) => setField("arrestDetails", v)} />
  ) : null}

  <Checkbox
    label="Problemas com a polícia"
    checked={form.policeProblems}
    onChange={(v) => {
      setField("policeProblems", v);
      if (!v) setField("policeProblemsDetails", "");
    }}
  />
  {form.policeProblems ? (
    <Textarea
      label="Detalhes (polícia)"
      value={form.policeProblemsDetails}
      onChange={(v) => setField("policeProblemsDetails", v)}
    />
  ) : null}

  <Checkbox
    label="Sequelas de acidente"
    checked={form.accidentSequelae}
    onChange={(v) => {
      setField("accidentSequelae", v);
      if (!v) setField("accidentSequelaeDetails", "");
    }}
  />
  {form.accidentSequelae ? (
    <Textarea
      label="Detalhes (sequelas)"
      value={form.accidentSequelaeDetails}
      onChange={(v) => setField("accidentSequelaeDetails", v)}
    />
  ) : null}

  <Checkbox
    label="Já fez cirurgias"
    checked={form.hadSurgeries}
    onChange={(v) => {
      setField("hadSurgeries", v);
      if (!v) setField("surgeriesDetails", "");
    }}
  />
  {form.hadSurgeries ? (
    <Textarea
      label="Detalhes (cirurgias)"
      value={form.surgeriesDetails}
      onChange={(v) => setField("surgeriesDetails", v)}
    />
  ) : null}

  <Checkbox
    label="Possui IST/DST"
    checked={form.hasSTDs}
    onChange={(v) => {
      setField("hasSTDs", v);
      if (!v) setField("stdDetails", "");
    }}
  />
  {form.hasSTDs ? (
    <Textarea label="Detalhes (IST/DST)" value={form.stdDetails} onChange={(v) => setField("stdDetails", v)} />
  ) : null}

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
  {form.mentalSymptoms ? (
    <Textarea
      label="Detalhes (sintomas mentais)"
      value={form.mentalSymptomsDetails}
      onChange={(v) => setField("mentalSymptomsDetails", v)}
    />
  ) : null}

  <Checkbox label="Medo súbito" checked={form.suddenFear} onChange={(v) => setField("suddenFear", v)} />

  <Checkbox
    label="Irritabilidade/ansiedade etc."
    checked={form.irritabilityAnxietyEtc}
    onChange={(v) => {
      setField("irritabilityAnxietyEtc", v);
      if (!v) setField("irritabilityAnxietyEtcDetails", "");
    }}
  />
  {form.irritabilityAnxietyEtc ? (
    <Textarea
      label="Detalhes (ansiedade etc.)"
      value={form.irritabilityAnxietyEtcDetails}
      onChange={(v) => setField("irritabilityAnxietyEtcDetails", v)}
    />
  ) : null}

  <Checkbox
    label="Parente militar"
    checked={form.hasMilitaryRelative}
    onChange={(v) => {
      setField("hasMilitaryRelative", v);
      if (!v) setField("militaryRelativeDetails", "");
    }}
  />
  {form.hasMilitaryRelative ? (
    <Textarea
      label="Detalhes (parente militar)"
      value={form.militaryRelativeDetails}
      onChange={(v) => setField("militaryRelativeDetails", v)}
    />
  ) : null}
</Section>

<Section title="Relações familiares">
  <Textarea label="Relação com o pai" value={form.relationshipFather} onChange={(v) => setField("relationshipFather", v)} />
  <Textarea label="Relação com a mãe" value={form.relationshipMother} onChange={(v) => setField("relationshipMother", v)} />
  <Textarea
    label="Relação com irmãos"
    value={form.relationshipSiblings}
    onChange={(v) => setField("relationshipSiblings", v)}
  />
</Section>

      <div className="space-y-3">
        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="w-full rounded-2xl bg-zinc-100 px-4 py-4 text-sm font-semibold text-zinc-900 disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>

        <a
          href="/"
          className="block w-full rounded-2xl border border-zinc-800 bg-zinc-900/40 px-4 py-4 text-center text-sm font-semibold text-zinc-200"
        >
          Voltar
        </a>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
      <div className="mb-4 text-sm font-semibold">{title}</div>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Input({
  label,
  value,
  onChange,
  inputMode,
  autoComplete,
  autoCapitalize,
  disabled,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  autoCapitalize?: React.HTMLAttributes<HTMLInputElement>["autoCapitalize"];
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="text-xs text-zinc-400">{label}</div>
      <input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        inputMode={inputMode}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        disabled={disabled}
        placeholder={placeholder}
        className={[
          "mt-2 w-full rounded-xl border px-3 py-3 text-sm outline-none",
          disabled
            ? "border-zinc-900 bg-zinc-950/40 text-zinc-500"
            : "border-zinc-800 bg-zinc-950 text-zinc-100 focus:border-zinc-500",
        ].join(" ")}
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-xs text-zinc-400">{label}</div>
      <textarea
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        rows={4}
        className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500"
      />
    </div>
  );
}

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <div className="text-xs text-zinc-400">{label}</div>
      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value as T)}
        className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500"
      >
        {options.map((o) => (
          <option key={o.value || "blank"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 pt-6 text-sm text-zinc-200 sm:pt-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)}
        className="h-4 w-4"
      />
      {label}
    </label>
  );
}