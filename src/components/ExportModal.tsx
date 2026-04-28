"use client";

import * as React from "react";
import { Download, CheckSquare, Square } from "lucide-react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  LinkButton,
  Pill,
  cn,
} from "./ui";

export type ExportField =
  | "id"
  | "createdAt"
  | "updatedAt"
  | "squad"
  | "photoUrl"
  | "platoon"
  | "warName"
  | "fullName"
  | "cpf"
  | "idt"
  | "phone"
  | "emergencyPhone"
  | "address"
  | "naturalidade"
  | "motherName"
  | "fatherName"
  | "laranjeira"
  | "familyHistory"
  | "professionalExp"
  | "education"
  | "hasLicense"
  | "licenseCategory"
  | "bloodType"
  | "healthIssues"
  | "bank"
  | "agency"
  | "account"
  | "religion"
  | "voterTitle"
  | "isAthlete"
  | "physicalActivity"
  | "notesPositive"
  | "notesNegative"
  | "facebook"
  | "instagram"
  | "hasGirlfriend"
  | "girlfriendAddress"
  | "usedDrugs"
  | "drugsDetails"
  | "tattoos"
  | "childrenCount"
  | "hasBeenArrested"
  | "arrestDetails"
  | "livesWithParents"
  | "livesWithWhom"
  | "lostCloseFamily"
  | "lostWhoCause"
  | "livedAway"
  | "livedAwayWhere"
  | "householdCount"
  | "familyIncome"
  | "helpsFamily"
  | "helpsFamilyAmount"
  | "hasSiblings"
  | "siblingsCount"
  | "smoker"
  | "alcoholUse"
  | "policeProblems"
  | "policeProblemsDetails"
  | "accidentSequelae"
  | "accidentSequelaeDetails"
  | "hadSurgeries"
  | "surgeriesDetails"
  | "hasSTDs"
  | "stdDetails"
  | "hasSeizuresFainting"
  | "mentalSymptoms"
  | "mentalSymptomsDetails"
  | "suddenFear"
  | "irritabilityAnxietyEtc"
  | "irritabilityAnxietyEtcDetails"
  | "hasMilitaryRelative"
  | "militaryRelativeDetails"
  | "relationshipFather"
  | "relationshipMother"
  | "relationshipSiblings"
  | "workedBeforeEB"
  | "workSignedCard"
  | "workSalary"
  | "workDetails"
  | "volunteeredToServe"
  | "identidadeMilitar"
  | "altura"
  | "cabelo"
  | "cutis"
  | "corOlhos"
  | "doadorOrgaos";

export const REQUIRED_EXPORT: ExportField[] = ["warName", "fullName"];

type Group = { title: string; fields: { key: ExportField; label: string }[] };

const GROUPS: Group[] = [
  {
    title: "Identificação",
    fields: [
      { key: "warName", label: "Nome de Guerra (obrigatório)" },
      { key: "fullName", label: "Nome Completo (obrigatório)" },
      { key: "cpf", label: "CPF" },
      { key: "idt", label: "IDT" },
      { key: "identidadeMilitar", label: "Identidade Militar" },
      { key: "platoon", label: "Pelotão" },
      { key: "squad", label: "Esquadrão" },
      { key: "photoUrl", label: "Foto (URL)" },
      { key: "id", label: "ID" },
      { key: "createdAt", label: "Criado em" },
      { key: "updatedAt", label: "Atualizado em" },
    ],
  },
  {
    title: "Contato e endereço",
    fields: [
      { key: "phone", label: "Telefone" },
      { key: "emergencyPhone", label: "Telefone Emergência" },
      { key: "naturalidade", label: "Naturalidade" },
      { key: "address", label: "Endereço" },
      { key: "motherName", label: "Nome da Mãe" },
      { key: "fatherName", label: "Nome do Pai" },
      { key: "facebook", label: "Facebook" },
      { key: "instagram", label: "Instagram" },
    ],
  },
  {
    title: "Dados militares e pessoais",
    fields: [
      { key: "laranjeira", label: "Laranjeira" },
      { key: "hasLicense", label: "Possui CNH" },
      { key: "licenseCategory", label: "Categoria CNH" },
      { key: "bloodType", label: "Tipo Sanguíneo" },
      { key: "religion", label: "Religião" },
      { key: "voterTitle", label: "Título de Eleitor" },
      { key: "isAthlete", label: "Atleta" },
      { key: "physicalActivity", label: "Atividade Física" },
      { key: "altura", label: "Altura (cm)" },
      { key: "cabelo", label: "Cabelo" },
      { key: "cutis", label: "Cútis" },
      { key: "corOlhos", label: "Cor dos Olhos" },
      { key: "doadorOrgaos", label: "Doador de Órgãos" },
      { key: "volunteeredToServe", label: "Voluntariou-se" },
    ],
  },
  {
    title: "Banco",
    fields: [
      { key: "bank", label: "Banco" },
      { key: "agency", label: "Agência" },
      { key: "account", label: "Conta" },
    ],
  },
  {
    title: "Família e relacionamento",
    fields: [
      { key: "hasGirlfriend", label: "Namorada" },
      { key: "girlfriendAddress", label: "Endereço namorada" },
      { key: "tattoos", label: "Tatuagens" },
      { key: "childrenCount", label: "Qtd. filhos" },
      { key: "livesWithParents", label: "Mora com pais" },
      { key: "livesWithWhom", label: "Mora com quem" },
      { key: "lostCloseFamily", label: "Perdeu familiar próximo" },
      { key: "lostWhoCause", label: "Quem / causa" },
      { key: "livedAway", label: "Já morou fora" },
      { key: "livedAwayWhere", label: "Onde morou fora" },
      { key: "householdCount", label: "Pessoas na casa" },
      { key: "hasSiblings", label: "Tem irmãos" },
      { key: "siblingsCount", label: "Qtd. irmãos" },
      { key: "hasMilitaryRelative", label: "Parente militar" },
      { key: "militaryRelativeDetails", label: "Detalhes parente militar" },
      { key: "relationshipFather", label: "Relação com pai" },
      { key: "relationshipMother", label: "Relação com mãe" },
      { key: "relationshipSiblings", label: "Relação com irmãos" },
    ],
  },
  {
    title: "Renda e trabalho",
    fields: [
      { key: "familyIncome", label: "Renda familiar" },
      { key: "helpsFamily", label: "Ajuda família" },
      { key: "helpsFamilyAmount", label: "Quanto ajuda" },
      { key: "workedBeforeEB", label: "Trabalhou antes do EB" },
      { key: "workSignedCard", label: "Carteira assinada" },
      { key: "workSalary", label: "Salário" },
      { key: "workDetails", label: "Detalhes trabalho" },
    ],
  },
  {
    title: "Saúde e ocorrências",
    fields: [
      { key: "healthIssues", label: "Problemas de saúde" },
      { key: "smoker", label: "Fumante" },
      { key: "alcoholUse", label: "Álcool" },
      { key: "usedDrugs", label: "Já usou drogas" },
      { key: "drugsDetails", label: "Quais drogas" },
      { key: "hasBeenArrested", label: "Já foi preso" },
      { key: "arrestDetails", label: "Detalhes prisão" },
      { key: "policeProblems", label: "Problemas com polícia" },
      { key: "policeProblemsDetails", label: "Detalhes polícia" },
      { key: "accidentSequelae", label: "Sequelas de acidente" },
      { key: "accidentSequelaeDetails", label: "Detalhes sequelas" },
      { key: "hadSurgeries", label: "Já fez cirurgias" },
      { key: "surgeriesDetails", label: "Detalhes cirurgias" },
      { key: "hasSTDs", label: "IST/DST" },
      { key: "stdDetails", label: "Detalhes IST/DST" },
      { key: "hasSeizuresFainting", label: "Convulsões/desmaios" },
      { key: "mentalSymptoms", label: "Sintomas mentais" },
      { key: "mentalSymptomsDetails", label: "Detalhes mentais" },
      { key: "suddenFear", label: "Medo súbito" },
      { key: "irritabilityAnxietyEtc", label: "Irritabilidade/ansiedade" },
      {
        key: "irritabilityAnxietyEtcDetails",
        label: "Detalhes irritabilidade",
      },
    ],
  },
  {
    title: "Histórico e observações",
    fields: [
      { key: "familyHistory", label: "Histórico familiar" },
      { key: "professionalExp", label: "Experiência profissional" },
      { key: "education", label: "Escolaridade" },
      { key: "notesPositive", label: "Fatos positivos (campo)" },
      { key: "notesNegative", label: "Fatos negativos (campo)" },
    ],
  },
];

const ALL_FIELDS: { key: ExportField; label: string }[] = GROUPS.flatMap(
  (g) => g.fields,
);

const DEFAULT_KEYS: ExportField[] = [
  "warName",
  "fullName",
  "cpf",
  "idt",
  "platoon",
  "squad",
  "phone",
];

export function ExportModal({
  open,
  onClose,
  q,
  platoon,
}: {
  open: boolean;
  onClose: () => void;
  q: string;
  platoon: "" | "P1" | "P2" | "P3";
}) {
  const [selected, setSelected] = React.useState<Record<ExportField, boolean>>(
    () => {
      const base = {} as Record<ExportField, boolean>;
      for (const f of ALL_FIELDS) base[f.key] = false;
      for (const r of REQUIRED_EXPORT) base[r] = true;
      for (const k of DEFAULT_KEYS) base[k] = true;
      return base;
    },
  );
  const [onlyCnh, setOnlyCnh] = React.useState(false);
  const [onlyVoter, setOnlyVoter] = React.useState(false);

  const count = Object.values(selected).filter(Boolean).length;

  function toggle(k: ExportField) {
    if (REQUIRED_EXPORT.includes(k)) return;
    setSelected((p) => ({ ...p, [k]: !p[k] }));
  }

  function selectAll() {
    setSelected((prev) => {
      const next = { ...prev };
      for (const f of ALL_FIELDS) next[f.key] = true;
      return next;
    });
  }
  function clearAll() {
    setSelected((prev) => {
      const next = { ...prev };
      for (const f of ALL_FIELDS) next[f.key] = false;
      for (const r of REQUIRED_EXPORT) next[r] = true;
      return next;
    });
  }
  function selectGroup(g: Group, value: boolean) {
    setSelected((prev) => {
      const next = { ...prev };
      for (const f of g.fields) {
        if (REQUIRED_EXPORT.includes(f.key)) continue;
        next[f.key] = value;
      }
      return next;
    });
  }

  function buildUrl(): string {
    const picked = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k);
    for (const r of REQUIRED_EXPORT) if (!picked.includes(r)) picked.unshift(r);

    const sp = new URLSearchParams();
    sp.set("fields", picked.join(","));
    if (onlyCnh) sp.set("onlyCnh", "1");
    if (onlyVoter) sp.set("onlyVoter", "1");
    if (platoon) sp.set("platoon", platoon);
    if (q.trim()) sp.set("q", q.trim());
    return `/api/export?${sp.toString()}`;
  }

  return (
    <Modal open={open} onClose={onClose} size="xl">
      <ModalHeader
        title="Exportar CSV"
        description="Selecione os campos. Nome de Guerra e Nome Completo são obrigatórios."
        onClose={onClose}
      />
      <ModalBody className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={selectAll} leftIcon={<CheckSquare size={14} />}>
            Marcar tudo
          </Button>
          <Button size="sm" variant="outline" onClick={clearAll} leftIcon={<Square size={14} />}>
            Limpar
          </Button>
          <span className="ml-2 text-xs text-muted">
            {count} campo{count === 1 ? "" : "s"} selecionado
            {count === 1 ? "" : "s"}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={onlyCnh}
            onClick={() => setOnlyCnh((v) => !v)}
            label="Somente com CNH"
          />
          <FilterChip
            active={onlyVoter}
            onClick={() => setOnlyVoter((v) => !v)}
            label="Somente com Título de Eleitor"
          />
          {platoon && (
            <Pill kind="primary" size="sm">
              Filtro pelotão: {platoon === "P1" ? "1º" : platoon === "P2" ? "2º" : "3º"}
            </Pill>
          )}
          {q.trim() && (
            <Pill kind="info" size="sm">
              Filtro busca: “{q.trim()}”
            </Pill>
          )}
        </div>

        <div className="space-y-5">
          {GROUPS.map((g) => {
            const checked = g.fields.filter((f) => selected[f.key]).length;
            return (
              <div key={g.title}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {g.title}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-faint">
                    <span>
                      {checked}/{g.fields.length}
                    </span>
                    <button
                      onClick={() => selectGroup(g, true)}
                      className="rounded-md surface-2 px-2 py-0.5 ring-1 ring-line hover:surface-3"
                    >
                      tudo
                    </button>
                    <button
                      onClick={() => selectGroup(g, false)}
                      className="rounded-md surface-2 px-2 py-0.5 ring-1 ring-line hover:surface-3"
                    >
                      nada
                    </button>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {g.fields.map((f) => {
                    const locked = REQUIRED_EXPORT.includes(f.key);
                    const isOn = !!selected[f.key];
                    return (
                      <label
                        key={f.key}
                        className={cn(
                          "flex cursor-pointer items-center gap-2.5 rounded-[var(--r-md)] border p-2.5 text-xs transition",
                          locked
                            ? "border-[rgba(var(--primary),0.4)] bg-[rgba(var(--primary),0.08)] cursor-not-allowed"
                            : isOn
                              ? "border-[rgba(var(--primary),0.4)] bg-[rgba(var(--primary),0.06)]"
                              : "border-line surface-2 hover:surface-3",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isOn}
                          disabled={locked}
                          onChange={() => toggle(f.key)}
                          className="h-4 w-4 accent-[rgb(var(--primary))]"
                        />
                        <span className="text-fg">{f.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ModalBody>
      <ModalFooter>
        <LinkButton
          href={buildUrl()}
          variant="primary"
          size="lg"
          className="w-full"
          leftIcon={<Download size={16} />}
        >
          Baixar CSV ({count} campos)
        </LinkButton>
      </ModalFooter>
    </Modal>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-[11px] font-semibold transition",
        active
          ? "border-[rgba(var(--primary),0.4)] bg-[rgba(var(--primary),0.12)] text-[rgb(var(--primary-strong))]"
          : "border-line surface-2 text-muted hover:text-fg",
      )}
    >
      {label}
    </button>
  );
}
