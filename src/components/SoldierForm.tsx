"use client";

import React, { useMemo, useRef, useState } from "react";
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
    cpf: initial?.cpf ?? "",
    idt: initial?.idt ?? "",
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
  };
}

export default function SoldierForm({ mode, initial }: Props) {
  const [saving, setSaving] = useState<boolean>(false);

  // FOTO: botão abre câmera (mobile) e mantém preview
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [form, setForm] = useState<FormState>(() => normalizeInitial(initial));

  const previewUrl = useMemo<string | null>(() => {
    if (photoFile) return URL.createObjectURL(photoFile);
    return initial?.photoUrl ?? null;
  }, [photoFile, initial?.photoUrl]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

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
      const data: { soldier?: { id?: string }; error?: string } = await res.json();

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
      {/* FOTO (mobile-first: botão grande + abre câmera) */}
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
              {previewUrl ? "Trocar foto (câmera/galeria)" : "Adicionar foto (câmera)"}
            </button>

            <div className="text-[11px] text-zinc-400">
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const f = e.target.files?.[0] ?? null;
                setPhotoFile(f);
                // permite selecionar a mesma foto novamente
                if (e.target) e.target.value = "";
              }}
            />
          </div>
        </div>
      </Section>

      <Section title="Identificação">
        <Grid>
          <Input label="Nome completo" value={form.fullName} onChange={(v) => setField("fullName", v)} autoCapitalize="words" />
          <Input label="Nome de guerra" value={form.warName} onChange={(v) => setField("warName", v)} autoCapitalize="words" />

          <Input
            label="CPF"
            value={formatCPF(form.cpf)}
            onChange={(v) => setField("cpf", formatCPF(v))}
            inputMode="numeric"
            autoComplete="off"
          />

          <Input
            label="IDT"
            value={form.idt}
            onChange={(v) => setField("idt", onlyDigits(v).slice(0, 10))}
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

          <Input label="Naturalidade" value={form.naturalidade} onChange={(v) => setField("naturalidade", v)} autoCapitalize="words" />
          <Input label="Nome da mãe" value={form.motherName} onChange={(v) => setField("motherName", v)} autoCapitalize="words" />
          <Input label="Nome do pai" value={form.fatherName} onChange={(v) => setField("fatherName", v)} autoCapitalize="words" />
          <Input label="Endereço" value={form.address} onChange={(v) => setField("address", v)} autoCapitalize="sentences" />
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
            placeholder={cnhDisabled ? "Ative 'Possui habilitação' para preencher" : "Ex: B"}
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
          <Input label="Título de eleitor" value={form.voterTitle} onChange={(v) => setField("voterTitle", v)} />

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
            placeholder={athleteDisabled ? "Ative 'Atleta' para preencher" : "Ex: corrida, futebol"}
          />
        </Grid>
      </Section>

      <Section title="Histórico / Observações">
        <Textarea label="Histórico familiar" value={form.familyHistory} onChange={(v) => setField("familyHistory", v)} />
        <Textarea label="Experiência profissional" value={form.professionalExp} onChange={(v) => setField("professionalExp", v)} />
        <Textarea label="Escolaridade" value={form.education} onChange={(v) => setField("education", v)} />
        <Textarea label="Fatos observados positivos (campo)" value={form.notesPositive} onChange={(v) => setField("notesPositive", v)} />
        <Textarea label="Fatos observados negativos (campo)" value={form.notesNegative} onChange={(v) => setField("notesNegative", v)} />
      </Section>

      {/* AÇÕES */}
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