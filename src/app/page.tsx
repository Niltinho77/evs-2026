"use client";

import { useEffect, useMemo, useState } from "react";
import { Panel, Input, Pill, Select } from "@/components/ui";

type Platoon = "" | "P1" | "P2" | "P3";

type SoldierListItem = {
  id: string;
  fullName: string;
  warName: string;
  cpf: string;
  platoon: "P1" | "P2" | "P3" | null;
  squad: string;
  photoUrl: string | null;
  _count?: { fatds?: number; fos?: number };
};

const PLATOON_OPTIONS: { value: Platoon; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "P1", label: "1º Pelotão" },
  { value: "P2", label: "2º Pelotão" },
  { value: "P3", label: "3º Pelotão" },
];

type ExportField =
  | "warName"
  | "fullName"
  | "cpf"
  | "idt"
  | "platoon"
  | "phone"
  | "emergencyPhone"
  | "naturalidade"
  | "motherName"
  | "fatherName"
  | "address"
  | "laranjeira"
  | "hasLicense"
  | "licenseCategory"
  | "bloodType"
  | "bank"
  | "agency"
  | "account"
  | "religion"
  | "voterTitle"
  | "isAthlete"
  | "physicalActivity"
  | "facebook"
  | "instagram"
  | "healthIssues"
  | "hasGirlfriend"
  | "girlfriendAddress"
  | "usedDrugs"
  | "drugsDetails";

const REQUIRED_EXPORT: ExportField[] = ["warName", "fullName"];

const EXPORT_FIELDS: { key: ExportField; label: string }[] = [
  { key: "warName", label: "Nome de Guerra (obrigatório)" },
  { key: "fullName", label: "Nome Completo (obrigatório)" },

  { key: "cpf", label: "CPF" },
  { key: "idt", label: "IDT" },
  { key: "platoon", label: "Pelotão" },

  { key: "phone", label: "Telefone" },
  { key: "emergencyPhone", label: "Telefone Emergência" },

  { key: "naturalidade", label: "Naturalidade" },
  { key: "motherName", label: "Nome da Mãe" },
  { key: "fatherName", label: "Nome do Pai" },
  { key: "address", label: "Endereço" },

  { key: "laranjeira", label: "Laranjeira" },

  { key: "hasLicense", label: "Possui CNH" },
  { key: "licenseCategory", label: "Categoria CNH" },

  { key: "bloodType", label: "Tipo Sanguíneo" },

  { key: "bank", label: "Banco" },
  { key: "agency", label: "Agência" },
  { key: "account", label: "Conta" },

  { key: "religion", label: "Religião" },
  { key: "voterTitle", label: "Título de Eleitor" },

  { key: "isAthlete", label: "Atleta" },
  { key: "physicalActivity", label: "Atividade Física" },
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },

  { key: "healthIssues", label: "Problemas de saúde" },

  { key: "hasGirlfriend", label: "Namorada" },
  { key: "girlfriendAddress", label: "Endereço da namorada (ref.)" },

  { key: "usedDrugs", label: "Já usou drogas" },
  { key: "drugsDetails", label: "Quais drogas" },
];

function platoonLabel(p?: SoldierListItem["platoon"]): string {
  if (p === "P1") return "1º Pelotão";
  if (p === "P2") return "2º Pelotão";
  if (p === "P3") return "3º Pelotão";
  return "—";
}

export default function HomePage() {
  const [q, setQ] = useState<string>("");
  const [platoon, setPlatoon] = useState<Platoon>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [soldiers, setSoldiers] = useState<SoldierListItem[]>([]);
  const [error, setError] = useState<string>("");

  // export modal + filtros de export
  const [exportOpen, setExportOpen] = useState<boolean>(false);
  const [onlyCnh, setOnlyCnh] = useState<boolean>(false);
  const [onlyVoter, setOnlyVoter] = useState<boolean>(false);

  const [selected, setSelected] = useState<Record<ExportField, boolean>>(() => {
    const base = {} as Record<ExportField, boolean>;
    for (const f of EXPORT_FIELDS) base[f.key] = false;
    // obrigatórios sempre true
    for (const r of REQUIRED_EXPORT) base[r] = true;
    // defaults úteis
    base.cpf = true;
    base.idt = true;
    base.platoon = true;
    return base;
  });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/soldiers?q=${encodeURIComponent(q)}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as { soldiers?: SoldierListItem[]; error?: string };
        if (!res.ok) throw new Error(data?.error || "Erro ao buscar soldados.");
        const list = Array.isArray(data.soldiers) ? data.soldiers : [];
        if (!cancelled) setSoldiers(list);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erro ao buscar.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const t = setTimeout(run, 180);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q]);

  const filtered = useMemo(() => {
    if (!platoon) return soldiers;
    return soldiers.filter((s) => (s.platoon ?? "") === platoon);
  }, [soldiers, platoon]);

  const total = filtered.length;

  function toggleField(k: ExportField) {
    if (REQUIRED_EXPORT.includes(k)) return; // travado
    setSelected((prev) => ({ ...prev, [k]: !prev[k] }));
  }

  function selectAll() {
    setSelected((prev) => {
      const next = { ...prev };
      for (const f of EXPORT_FIELDS) next[f.key] = true;
      for (const r of REQUIRED_EXPORT) next[r] = true;
      return next;
    });
  }

  function clearAll() {
    setSelected((prev) => {
      const next = { ...prev };
      for (const f of EXPORT_FIELDS) next[f.key] = false;
      for (const r of REQUIRED_EXPORT) next[r] = true; // mantém obrigatórios
      return next;
    });
  }

  function buildExportUrl(): string {
    const picked = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k);

    // garante obrigatórios (mesmo se alguém tentar tirar)
    for (const r of REQUIRED_EXPORT) {
      if (!picked.includes(r)) picked.unshift(r);
    }

    const sp = new URLSearchParams();
    sp.set("fields", picked.join(","));
    if (onlyCnh) sp.set("onlyCnh", "1");
    if (onlyVoter) sp.set("onlyVoter", "1");
    if (platoon) sp.set("platoon", platoon);
    if (q.trim()) sp.set("q", q.trim());

    return `/api/export?${sp.toString()}`;
  }

  return (
    <div className="space-y-4">
      <Panel
        title="Soldados EVS 2026"
        right={<Pill kind="muted">{loading ? "Buscando…" : `${total} registro(s)`}</Pill>}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-[11px] font-semibold text-white/60">Buscar (nome, guerra, CPF, IDT)</div>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ex: SILVA ou 12345678900" />
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold text-white/60">Filtrar por Pelotão</div>
            <Select value={platoon} onChange={(e) => setPlatoon(e.target.value as Platoon)}>
              {PLATOON_OPTIONS.map((o) => (
                <option key={o.value || "ALL"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          {error ? (
            <div className="flex-1 rounded-2xl bg-red-500/10 p-3 text-xs text-red-200 ring-1 ring-red-500/20">
              {error}
            </div>
          ) : (
            <div className="text-xs text-white/50">
            </div>
          )}

          <button
            onClick={() => setExportOpen(true)}
            className="shrink-0 rounded-2xl bg-[rgb(var(--accent))] px-4 py-2 text-xs font-extrabold text-black shadow-[var(--shadow)]"
          >
            Exportar
          </button>
        </div>
      </Panel>

      <div className="space-y-3">
        {filtered.map((s) => (
          <a
            key={s.id}
            href={`/soldiers/${s.id}`}
            className="block rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 shadow-[var(--shadow)] active:scale-[.99]"
          >
            <div className="flex items-center gap-4">
              <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-3xl bg-black/40 ring-2 ring-[rgba(158,226,185,.22)]">
                {s.photoUrl ? (
                  <img src={s.photoUrl} alt={s.warName || s.fullName} className="h-full w-full object-cover object-center" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-[10px] font-semibold text-white/35">
                    SEM FOTO
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-base font-extrabold tracking-tight">{s.warName || s.fullName}</div>
                <div className="truncate text-[12px] text-white/60">{s.fullName}</div>
                <div className="mt-2 rounded-xl bg-black/35 px-2 py-1 text-[11px] text-white/55 ring-1 ring-white/10">
                  CPF: {s.cpf}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Pill kind="muted">{platoonLabel(s.platoon)}</Pill>
              </div>
            </div>
          </a>
        ))}

        {!loading && filtered.length === 0 ? (
          <div className="rounded-3xl bg-white/5 p-6 text-center text-sm text-white/55 ring-1 ring-white/10">
            Nenhum militar encontrado.
          </div>
        ) : null}
      </div>

      {/* MODAL EXPORT */}
{exportOpen && (
  <div className="fixed inset-0 z-50">
    <div
      className="absolute inset-0 bg-black/65"
      onClick={() => setExportOpen(false)}
    />

    {/* container central */}
    <div className="absolute inset-0 flex items-start justify-center p-3 pt-16 sm:pt-20">
      {/* card do modal */}
      <div
        className="
          w-full max-w-3xl
          rounded-3xl border border-white/10 bg-black/80
          shadow-[var(--shadow)] backdrop-blur-xl
          max-h-[calc(100vh-90px)]
          flex flex-col overflow-hidden
        "
      >
        {/* header fixo */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4">
          <div className="min-w-0">
            <div className="truncate text-base font-extrabold">Exportar CSV</div>
            <div className="mt-1 text-xs text-white/60">
              Nome de Guerra e Nome Completo são obrigatórios.
            </div>
          </div>

          <button
            onClick={() => setExportOpen(false)}
            className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80"
          >
            Fechar
          </button>
        </div>

        {/* corpo rolável */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* filtros rápidos */}
        

          {/* ações */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={selectAll}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80"
            >
              Marcar tudo
            </button>
            <button
              onClick={clearAll}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80"
            >
              Limpar
            </button>

            
          </div>

          {/* lista de campos */}
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {EXPORT_FIELDS.map((f) => {
              const locked = REQUIRED_EXPORT.includes(f.key);
              const checked = !!selected[f.key];

              return (
                <label
                  key={f.key}
                  className={`flex items-center gap-3 rounded-2xl border p-3 text-sm ${
                    locked
                      ? "border-emerald-500/25 bg-emerald-500/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={locked}
                    onChange={() => toggleField(f.key)}
                    className="h-4 w-4"
                  />
                  <span className={locked ? "text-emerald-100" : "text-white/85"}>
                    {f.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* footer fixo com CTA */}
        <div className="border-t border-white/10 bg-black/60 p-4">
          <a
            href={buildExportUrl()}
            className="block w-full rounded-2xl bg-[rgb(var(--accent))] px-4 py-4 text-center text-sm font-extrabold text-black shadow-[var(--shadow)]"
          >
            Baixar CSV
          </a>
          
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}