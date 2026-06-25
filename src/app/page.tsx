"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Search,
  Users,
  ShieldCheck,
  Activity,
  CarFront,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  Filter,
  X,
} from "lucide-react";
import {
  Section,
  Input,
  Pill,
  Stat,
  Button,
  LinkButton,
  Skeleton,
  EmptyState,
  cn,
} from "@/components/ui";
import { SoldierTable, type SoldierRow } from "@/components/SoldierTable";
import { useAuth } from "@/components/AuthProvider";

const ExportModal = dynamic(() => import("@/components/ExportModal"), {
  ssr: false,
  loading: () => null,
});

type Platoon = "" | "P1" | "P2" | "P3";

type Stats = {
  total: number;
  byPlatoon: Record<"P1" | "P2" | "P3" | "NA", number>;
  fos: { positive: number; negative: number };
  fatds: { month: number; total: number };
  flags: {
    athletes: number;
    cnh: number;
    laranjeira: number;
    drugs: number;
    arrested: number;
    militaryRelative: number;
    voluntary: number;
  };
};

const PLATOON_OPTIONS: { value: Platoon; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "P1", label: "1º Pelotão" },
  { value: "P2", label: "2º Pelotão" },
  { value: "P3", label: "3º Pelotão" },
];

type FlagFilter = "athlete" | "cnh" | "laranjeira" | "drugs" | "";

export default function HomePage() {
  const { isAdmin } = useAuth();
  const [q, setQ] = useState<string>("");
  const [platoon, setPlatoon] = useState<Platoon>("");
  const [flagFilter, setFlagFilter] = useState<FlagFilter>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [soldiers, setSoldiers] = useState<SoldierRow[]>([]);
  const [error, setError] = useState<string>("");

  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [exportOpen, setExportOpen] = useState(false);

  // abre export se ?export=1 (vindo do command palette)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("export") === "1") {
      setExportOpen(true);
      params.delete("export");
      const next = params.toString();
      window.history.replaceState(
        {},
        "",
        next ? `${window.location.pathname}?${next}` : window.location.pathname,
      );
    }
  }, []);

  // métricas
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatsLoading(true);
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        const data = (await res.json()) as Stats;
        if (!cancelled) setStats(data);
      } catch {
        /* noop */
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // lista
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/soldiers?q=${encodeURIComponent(q)}&platoon=${encodeURIComponent(platoon)}`,
          { cache: "no-store" },
        );
        const data = (await res.json()) as {
          soldiers?: SoldierRow[];
          error?: string;
        };
        if (!res.ok) throw new Error(data?.error || "Erro ao buscar soldados.");
        if (!cancelled) setSoldiers(data.soldiers ?? []);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Erro ao buscar.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    const t = setTimeout(run, 180);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q, platoon]);

  const filtered = useMemo(() => {
    let r = soldiers;
    if (platoon) r = r.filter((s) => (s.platoon ?? "") === platoon);
    if (flagFilter === "athlete") r = r.filter((s) => s.isAthlete);
    if (flagFilter === "cnh") r = r.filter((s) => s.hasLicense);
    if (flagFilter === "laranjeira") r = r.filter((s) => s.laranjeira);
    if (flagFilter === "drugs") r = r.filter((s) => s.usedDrugs);
    return r;
  }, [soldiers, platoon, flagFilter]);

  // Contagens dos chips refletem busca + pelotão (escopo visível),
  // mas ignoram o flagFilter — assim cada chip mostra "quantos seriam
  // selecionados se eu clicasse só nele".
  const scopedSoldiers = useMemo(() => {
    if (!platoon) return soldiers;
    return soldiers.filter((s) => (s.platoon ?? "") === platoon);
  }, [soldiers, platoon]);

  const flagCounts = useMemo(
    () => ({
      athlete: scopedSoldiers.filter((s) => s.isAthlete).length,
      cnh: scopedSoldiers.filter((s) => s.hasLicense).length,
      laranjeira: scopedSoldiers.filter((s) => s.laranjeira).length,
      drugs: scopedSoldiers.filter((s) => s.usedDrugs).length,
    }),
    [scopedSoldiers],
  );

  const total = filtered.length;

  const hasFilter = q.trim() || platoon || flagFilter;

  return (
    <div className="space-y-6">
      {/* HERO / TÍTULO */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--primary-strong))]">
            EVS 2026 · Esquadrão de Comando
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl text-balance">
            Painel de comando
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Visão geral, ficha individual, FOs e FATDs.{" "}
            <kbd>⌘</kbd> <kbd>K</kbd> abre a busca rápida.
          </p>
        </div>
        {isAdmin ? (
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Button
              variant="outline"
              leftIcon={<Download size={14} />}
              onClick={() => setExportOpen(true)}
            >
              Exportar
            </Button>
            <LinkButton href="/soldiers/new" leftIcon={<Plus size={14} />}>
              Novo militar
            </LinkButton>
          </div>
        ) : null}
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statsLoading ? (
          <>
            <Skeleton className="h-[110px]" />
            <Skeleton className="h-[110px]" />
            <Skeleton className="h-[110px]" />
            <Skeleton className="h-[110px]" />
          </>
        ) : stats ? (
          <>
            <Stat
              tone="primary"
              label="Total de militares"
              value={stats.total}
              icon={<Users size={18} />}
              hint={
                stats.byPlatoon.NA > 0
                  ? `${stats.byPlatoon.NA} sem pelotão`
                  : "Distribuídos nos 3 pelotões"
              }
            />
            <Stat
              tone="ok"
              label="FOs positivos"
              value={stats.fos.positive}
              icon={<TrendingUp size={18} />}
              hint={`${stats.fos.negative} negativos no total`}
            />
            <Stat
              tone="warn"
              label="FATDs no mês"
              value={stats.fatds.month}
              icon={<AlertTriangle size={18} />}
              hint={`${stats.fatds.total} acumuladas`}
            />
            <Stat
              tone="accent"
              label="Atletas"
              value={stats.flags.athletes}
              icon={<Activity size={18} />}
              hint={`${stats.flags.cnh} com CNH · ${stats.flags.laranjeira} laranjeira`}
            />
          </>
        ) : null}
      </div>

      {/* SUB-MÉTRICAS POR PELOTÃO */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <PlatoonCard
            label="1º Pelotão"
            count={stats.byPlatoon.P1}
            tone="primary"
            active={platoon === "P1"}
            onClick={() =>
              setPlatoon((p) => (p === "P1" ? "" : "P1"))
            }
          />
          <PlatoonCard
            label="2º Pelotão"
            count={stats.byPlatoon.P2}
            tone="accent"
            active={platoon === "P2"}
            onClick={() =>
              setPlatoon((p) => (p === "P2" ? "" : "P2"))
            }
          />
          <PlatoonCard
            label="3º Pelotão"
            count={stats.byPlatoon.P3}
            tone="info"
            active={platoon === "P3"}
            onClick={() =>
              setPlatoon((p) => (p === "P3" ? "" : "P3"))
            }
          />
          <PlatoonCard
            label="Sem pelotão"
            count={stats.byPlatoon.NA}
            tone="muted"
            active={false}
            onClick={() => {}}
            disabled
          />
        </div>
      )}

      {/* BUSCA + FILTROS */}
      <Section
        title="Militares"
        right={
          <Pill kind="muted">
            {loading ? "Buscando…" : `${total} registro${total === 1 ? "" : "s"}`}
          </Pill>
        }
      >
        <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome, guerra, CPF ou IDT"
              className="pl-9"
            />
          </div>

          <select
            value={platoon}
            onChange={(e) => setPlatoon(e.target.value as Platoon)}
            className="h-11 rounded-[var(--r-md)] surface-3 border border-line px-3 text-sm text-fg outline-none transition focus:border-[rgba(var(--primary),0.7)]"
          >
            {PLATOON_OPTIONS.map((o) => (
              <option key={o.value || "ALL"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {hasFilter ? (
            <Button
              variant="ghost"
              leftIcon={<X size={14} />}
              onClick={() => {
                setQ("");
                setPlatoon("");
                setFlagFilter("");
              }}
            >
              Limpar
            </Button>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
            <Filter size={12} />
            Atributos
          </span>
          <Chip
            active={flagFilter === "athlete"}
            onClick={() =>
              setFlagFilter((f) => (f === "athlete" ? "" : "athlete"))
            }
            icon={<Activity size={12} />}
          >
            Atletas ({flagCounts.athlete})
          </Chip>
          <Chip
            active={flagFilter === "cnh"}
            onClick={() => setFlagFilter((f) => (f === "cnh" ? "" : "cnh"))}
            icon={<CarFront size={12} />}
          >
            CNH ({flagCounts.cnh})
          </Chip>
          <Chip
            active={flagFilter === "laranjeira"}
            onClick={() =>
              setFlagFilter((f) => (f === "laranjeira" ? "" : "laranjeira"))
            }
            icon={<ShieldCheck size={12} />}
          >
            Laranjeira ({flagCounts.laranjeira})
          </Chip>
          {isAdmin ? (
            <Chip
              active={flagFilter === "drugs"}
              onClick={() =>
                setFlagFilter((f) => (f === "drugs" ? "" : "drugs"))
              }
              icon={<AlertTriangle size={12} />}
            >
              Já usaram drogas ({flagCounts.drugs})
            </Chip>
          ) : null}
        </div>

        {error ? (
          <div className="mt-4 rounded-[var(--r-md)] border border-[rgba(var(--bad),0.3)] bg-[rgba(var(--bad),0.08)] px-3 py-2 text-xs text-[rgb(var(--bad))]">
            {error}
          </div>
        ) : null}
      </Section>

      {/* LISTA */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Users size={20} />}
            title="Nenhum militar encontrado"
            description={
              hasFilter
                ? "Tente ajustar os filtros ou limpar a busca."
                : "Cadastre o primeiro militar pra começar."
            }
            action={
              isAdmin ? (
                <LinkButton href="/soldiers/new" leftIcon={<Plus size={14} />}>
                  Novo militar
                </LinkButton>
              ) : undefined
            }
          />
        ) : (
          <SoldierTable rows={filtered} />
        )}
      </div>

      {isAdmin ? (
        <ExportModal
          open={exportOpen}
          onClose={() => setExportOpen(false)}
          q={q}
          platoon={platoon}
        />
      ) : null}
    </div>
  );
}

function Chip({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition",
        active
          ? "border-[rgba(var(--primary),0.45)] bg-[rgba(var(--primary),0.14)] text-[rgb(var(--primary-strong))]"
          : "border-line surface-2 text-muted hover:text-fg",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function PlatoonCard({
  label,
  count,
  tone,
  active,
  onClick,
  disabled,
}: {
  label: string;
  count: number;
  tone: "primary" | "accent" | "info" | "muted";
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  const dot =
    tone === "primary"
      ? "rgb(var(--primary))"
      : tone === "accent"
        ? "rgb(var(--accent-strong))"
        : tone === "info"
          ? "rgb(var(--info))"
          : "rgb(var(--fg-faint))";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex flex-col items-start gap-1 rounded-[var(--r-xl)] border p-3.5 text-left transition",
        active
          ? "border-[rgba(var(--primary),0.45)] bg-[rgba(var(--primary),0.06)]"
          : "border-line surface hover:surface-2",
        disabled ? "cursor-default opacity-70" : "cursor-pointer",
      )}
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: dot }}
        />
        {label}
      </div>
      <div className="font-display text-2xl font-bold tracking-tight text-fg">
        {count}
      </div>
      {!disabled ? (
        <div className="text-[10px] text-faint">
          {active ? "Filtrando" : "Clique para filtrar"}
        </div>
      ) : (
        <div className="text-[10px] text-faint">militar</div>
      )}
    </button>
  );
}
