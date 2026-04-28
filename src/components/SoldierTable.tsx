"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ShieldCheck,
  CarFront,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { Avatar, Pill, cn } from "./ui";

export type SoldierRow = {
  id: string;
  fullName: string;
  warName: string;
  cpf: string;
  idt?: string;
  platoon: "P1" | "P2" | "P3" | null;
  squad: string;
  photoUrl: string | null;
  laranjeira?: boolean;
  isAthlete?: boolean;
  hasLicense?: boolean;
  usedDrugs?: boolean;
  _count?: { fatds?: number; fos?: number };
};

type SortKey = "warName" | "fullName" | "platoon" | "fatds" | "fos";
type SortDir = "asc" | "desc";

const PLATOON_LABEL: Record<string, string> = {
  P1: "1º Pel",
  P2: "2º Pel",
  P3: "3º Pel",
};

const PLATOON_TONE: Record<string, "primary" | "accent" | "info" | "muted"> = {
  P1: "primary",
  P2: "accent",
  P3: "info",
};

function formatCpf(cpf: string) {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function SoldierTable({ rows }: { rows: SoldierRow[] }) {
  const [sortBy, setSortBy] = React.useState<SortKey>("warName");
  const [dir, setDir] = React.useState<SortDir>("asc");

  const sorted = React.useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const va = getVal(a, sortBy);
      const vb = getVal(b, sortBy);
      if (va < vb) return dir === "asc" ? -1 : 1;
      if (va > vb) return dir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, sortBy, dir]);

  function toggleSort(k: SortKey) {
    if (sortBy === k) setDir(dir === "asc" ? "desc" : "asc");
    else {
      setSortBy(k);
      setDir("asc");
    }
  }

  return (
    <>
      {/* DESKTOP TABLE */}
      <div className="hidden overflow-hidden rounded-[var(--r-xl)] border border-line surface md:block">
        <table className="w-full text-left text-sm">
          <thead className="surface-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
            <tr>
              <Th>Foto</Th>
              <Th
                sortable
                active={sortBy === "warName"}
                dir={dir}
                onClick={() => toggleSort("warName")}
              >
                Nome de Guerra
              </Th>
              <Th
                sortable
                active={sortBy === "fullName"}
                dir={dir}
                onClick={() => toggleSort("fullName")}
              >
                Nome Completo
              </Th>
              <Th>CPF</Th>
              <Th
                sortable
                active={sortBy === "platoon"}
                dir={dir}
                onClick={() => toggleSort("platoon")}
              >
                Pelotão
              </Th>
              <Th>Flags</Th>
              <Th
                sortable
                align="right"
                active={sortBy === "fos"}
                dir={dir}
                onClick={() => toggleSort("fos")}
              >
                FOs
              </Th>
              <Th
                sortable
                align="right"
                active={sortBy === "fatds"}
                dir={dir}
                onClick={() => toggleSort("fatds")}
              >
                FATDs
              </Th>
              <Th align="right">Ações</Th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, idx) => (
              <motion.tr
                key={s.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: Math.min(idx * 0.012, 0.18) }}
                className="border-t border-line transition hover:surface-2"
              >
                <td className="px-3 py-2.5">
                  <Avatar
                    src={s.photoUrl}
                    alt={s.warName}
                    size={40}
                    fallback={(s.warName || s.fullName).slice(0, 2)}
                  />
                </td>
                <td className="px-3 py-2.5">
                  <a
                    href={`/soldiers/${s.id}`}
                    className="block font-semibold tracking-tight text-fg hover:underline"
                  >
                    {s.warName || "—"}
                  </a>
                </td>
                <td className="px-3 py-2.5 text-muted">{s.fullName}</td>
                <td className="px-3 py-2.5 font-mono text-[12px] text-muted">
                  {formatCpf(s.cpf)}
                </td>
                <td className="px-3 py-2.5">
                  {s.platoon ? (
                    <Pill kind={PLATOON_TONE[s.platoon] ?? "muted"} size="sm">
                      {PLATOON_LABEL[s.platoon]}
                    </Pill>
                  ) : (
                    <span className="text-faint">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <FlagDots row={s} />
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums text-fg">
                  {s._count?.fos ?? 0}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums text-fg">
                  {s._count?.fatds ?? 0}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <a
                    href={`/soldiers/${s.id}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full surface-2 text-muted ring-1 ring-line transition hover:text-fg hover:surface-3"
                    aria-label="Ver ficha"
                  >
                    <ChevronRight size={14} />
                  </a>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="space-y-2.5 md:hidden">
        {sorted.map((s, idx) => (
          <motion.a
            key={s.id}
            href={`/soldiers/${s.id}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, delay: Math.min(idx * 0.02, 0.16) }}
            className="block rounded-[var(--r-xl)] border border-line surface p-3.5 active:scale-[.99]"
          >
            <div className="flex items-center gap-3.5">
              <Avatar
                src={s.photoUrl}
                alt={s.warName}
                size={56}
                fallback={(s.warName || s.fullName).slice(0, 2)}
                ring
              />
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold tracking-tight">
                  {s.warName || s.fullName}
                </div>
                <div className="truncate text-[12px] text-muted">
                  {s.fullName}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {s.platoon ? (
                    <Pill kind={PLATOON_TONE[s.platoon] ?? "muted"} size="sm">
                      {PLATOON_LABEL[s.platoon]}
                    </Pill>
                  ) : null}
                  <span className="font-mono text-[10px] text-faint">
                    {formatCpf(s.cpf)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <FlagDots row={s} compact />
                <ChevronRight size={14} className="text-faint" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </>
  );
}

function getVal(s: SoldierRow, key: SortKey): string | number {
  switch (key) {
    case "warName":
      return (s.warName || "").toLowerCase();
    case "fullName":
      return (s.fullName || "").toLowerCase();
    case "platoon":
      return s.platoon ?? "ZZ";
    case "fatds":
      return s._count?.fatds ?? 0;
    case "fos":
      return s._count?.fos ?? 0;
  }
}

function Th({
  children,
  sortable,
  active,
  dir,
  onClick,
  align,
}: {
  children: React.ReactNode;
  sortable?: boolean;
  active?: boolean;
  dir?: SortDir;
  onClick?: () => void;
  align?: "left" | "right";
}) {
  return (
    <th
      className={cn(
        "px-3 py-2.5 text-left",
        align === "right" ? "text-right" : "",
      )}
    >
      {sortable ? (
        <button
          onClick={onClick}
          className={cn(
            "inline-flex items-center gap-1 transition",
            active ? "text-fg" : "hover:text-fg",
            align === "right" ? "ml-auto" : "",
          )}
        >
          {children}
          {active ? (
            dir === "asc" ? (
              <ArrowUp size={12} />
            ) : (
              <ArrowDown size={12} />
            )
          ) : (
            <ArrowUpDown size={12} className="opacity-50" />
          )}
        </button>
      ) : (
        children
      )}
    </th>
  );
}

function FlagDots({ row, compact }: { row: SoldierRow; compact?: boolean }) {
  const flags: { on?: boolean; icon: React.ReactNode; label: string; tone: string }[] =
    [
      {
        on: row.isAthlete,
        icon: <Activity size={12} />,
        label: "Atleta",
        tone: "rgb(var(--ok))",
      },
      {
        on: row.hasLicense,
        icon: <CarFront size={12} />,
        label: "CNH",
        tone: "rgb(var(--info))",
      },
      {
        on: row.laranjeira,
        icon: <ShieldCheck size={12} />,
        label: "Laranjeira",
        tone: "rgb(var(--accent-strong))",
      },
      {
        on: row.usedDrugs,
        icon: <AlertTriangle size={12} />,
        label: "Drogas",
        tone: "rgb(var(--bad))",
      },
    ];
  const active = flags.filter((f) => f.on);
  if (active.length === 0)
    return <span className={compact ? "" : "text-faint"}>—</span>;
  return (
    <div className="flex flex-wrap items-center gap-1">
      {active.map((f) => (
        <span
          key={f.label}
          title={f.label}
          style={{ color: f.tone, borderColor: f.tone + "55" }}
          className="grid h-6 w-6 place-items-center rounded-full border surface-3"
        >
          {f.icon}
        </span>
      ))}
    </div>
  );
}
