// src/app/page.tsx
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

function platoonLabel(p?: SoldierListItem["platoon"]): string {
  if (p === "P1") return "1º Pelotão";
  if (p === "P2") return "2º Pelotão";
  if (p === "P3") return "3º Pelotão";
  return "—";
}

function safeText(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export default function HomePage() {
  const [q, setQ] = useState<string>("");
  const [platoon, setPlatoon] = useState<Platoon>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [soldiers, setSoldiers] = useState<SoldierListItem[]>([]);
  const [error, setError] = useState<string>("");

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

        if (!res.ok) {
          throw new Error(data?.error || "Erro ao buscar soldados.");
        }

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
    const base = soldiers;
    if (!platoon) return base;
    return base.filter((s) => (s.platoon ?? "") === platoon);
  }, [soldiers, platoon]);

  const total = filtered.length;

  return (
    <div className="space-y-4">
      <Panel
        title="Soldados EVS 2026"
        right={
          <Pill kind="muted">
            {loading ? "Buscando…" : `${total} registro(s)`}
          </Pill>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-[11px] font-semibold text-white/60">
              Buscar (nome, guerra, CPF, IDT)
            </div>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ex: SILVA ou 12345678900"
            />
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold text-white/60">
              Filtrar por Pelotão
            </div>
            <Select
              value={platoon}
              onChange={(e) => setPlatoon(e.target.value as Platoon)}
            >
              {PLATOON_OPTIONS.map((o) => (
                <option key={o.value || "ALL"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {error ? (
          <div className="mt-3 rounded-2xl bg-red-500/10 p-3 text-xs text-red-200 ring-1 ring-red-500/20">
            {error}
          </div>
        ) : null}
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
                  <img
                    src={s.photoUrl}
                    alt={safeText(s.warName || s.fullName)}
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-[10px] font-semibold text-white/35">
                    SEM FOTO
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-base font-extrabold tracking-tight">
                  {s.warName || s.fullName}
                </div>
                <div className="truncate text-[12px] text-white/60">
                  {s.fullName}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-xl bg-black/35 px-2 py-1 text-[11px] text-white/55 ring-1 ring-white/10">
                    CPF: {s.cpf}
                  </span>
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
    </div>
  );
}