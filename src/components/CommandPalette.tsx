"use client";

import * as React from "react";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  UserPlus,
  Search,
  Sun,
  Moon,
  FileDown,
  Users,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";

type SoldierHit = {
  id: string;
  fullName: string;
  warName: string;
  cpf: string;
  platoon: "P1" | "P2" | "P3" | null;
};

const PLATOON_LABEL: Record<string, string> = {
  P1: "1º Pelotão",
  P2: "2º Pelotão",
  P3: "3º Pelotão",
};

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [hits, setHits] = React.useState<SoldierHit[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { theme, toggle } = useTheme();

  // ⌘K / Ctrl+K
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // busca remota com debounce simples
  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      const term = q.trim();
      if (term.length < 2) {
        setHits([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/soldiers?q=${encodeURIComponent(term)}`,
          { cache: "no-store" },
        );
        const data = await res.json();
        if (!cancelled)
          setHits(Array.isArray(data?.soldiers) ? data.soldiers.slice(0, 8) : []);
      } catch {
        if (!cancelled) setHits([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q, open]);

  React.useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    window.location.href = href;
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-0 flex items-start justify-center p-4 pt-[12vh]">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="glass w-full max-w-xl overflow-hidden rounded-[var(--r-2xl)] border border-line shadow-pop"
            >
              <Command label="Comando" className="text-fg">
                <div className="flex items-center gap-3 border-b border-line px-4">
                  <Search size={16} className="text-muted" />
                  <Command.Input
                    autoFocus
                    placeholder="Buscar militar, abrir página, mudar tema…"
                    value={q}
                    onValueChange={setQ}
                    className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-faint"
                  />
                  <kbd>esc</kbd>
                </div>

                <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                  <Command.Empty className="px-3 py-6 text-center text-xs text-muted">
                    {loading ? "Buscando…" : "Nada encontrado."}
                  </Command.Empty>

                  {hits.length > 0 && (
                    <Command.Group heading="Militares" className="cmdk-group">
                      {hits.map((s) => (
                        <Command.Item
                          key={s.id}
                          value={`${s.fullName} ${s.warName} ${s.cpf}`}
                          onSelect={() => go(`/soldiers/${s.id}`)}
                          className="cmdk-item"
                        >
                          <div className="grid h-8 w-8 place-items-center rounded-md surface-3 text-muted">
                            <Users size={14} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">
                              {s.warName || s.fullName}
                            </div>
                            <div className="truncate text-[11px] text-muted">
                              {s.fullName} ·{" "}
                              {s.platoon ? PLATOON_LABEL[s.platoon] : "Sem pelotão"}
                            </div>
                          </div>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )}

                  <Command.Group heading="Navegar" className="cmdk-group">
                    <Command.Item
                      value="dashboard inicio home"
                      onSelect={() => go("/")}
                      className="cmdk-item"
                    >
                      <LayoutDashboard size={16} className="text-muted" />
                      <span>Ir para o Dashboard</span>
                    </Command.Item>
                    <Command.Item
                      value="novo militar cadastrar"
                      onSelect={() => go("/soldiers/new")}
                      className="cmdk-item"
                    >
                      <UserPlus size={16} className="text-muted" />
                      <span>Novo militar</span>
                    </Command.Item>
                    <Command.Item
                      value="exportar csv"
                      onSelect={() =>
                        go("/?export=1")
                      }
                      className="cmdk-item"
                    >
                      <FileDown size={16} className="text-muted" />
                      <span>Abrir exportação CSV</span>
                    </Command.Item>
                  </Command.Group>

                  <Command.Group heading="Aparência" className="cmdk-group">
                    <Command.Item
                      value="tema dark light claro escuro"
                      onSelect={() => {
                        toggle();
                        setOpen(false);
                      }}
                      className="cmdk-item"
                    >
                      {theme === "dark" ? (
                        <Sun size={16} className="text-muted" />
                      ) : (
                        <Moon size={16} className="text-muted" />
                      )}
                      <span>
                        Mudar para tema {theme === "dark" ? "claro" : "escuro"}
                      </span>
                    </Command.Item>
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .cmdk-group [cmdk-group-heading] {
          padding: 8px 10px 4px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgb(var(--fg-faint));
        }
        .cmdk-item {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 10px 10px;
          border-radius: var(--r-md);
          font-size: 13px;
          cursor: pointer;
          color: rgb(var(--fg));
        }
        .cmdk-item[data-selected="true"] {
          background: rgba(var(--primary), 0.12);
          color: rgb(var(--fg));
        }
      `}</style>
    </AnimatePresence>
  );
}
