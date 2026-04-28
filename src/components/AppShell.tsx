"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Sun,
  Moon,
  Menu,
  Search,
  X,
  Command as CommandIcon,
  Shield,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { CommandPalette } from "./CommandPalette";
import { cn } from "./ui";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/soldiers/new", label: "Novo militar", icon: UserPlus, exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const { theme, toggle } = useTheme();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // fecha drawer ao navegar
  React.useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen text-fg">
      <CommandPalette />

      {/* ===== TOPBAR (mobile) ===== */}
      <header className="sticky top-0 z-40 border-b border-line glass lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-[var(--r-md)] surface-2 text-fg ring-1 ring-line"
            aria-label="Abrir menu"
          >
            <Menu size={18} />
          </button>

          <a href="/" className="flex items-center gap-2.5">
            <Logo size={32} />
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight">EVS 2026</div>
              <div className="text-[10px] text-muted">Esqd Comando</div>
            </div>
          </a>

          <button
            type="button"
            onClick={() => fakeOpenCommand()}
            className="grid h-10 w-10 place-items-center rounded-[var(--r-md)] surface-2 text-fg ring-1 ring-line"
            aria-label="Buscar"
          >
            <Search size={16} />
          </button>
        </div>
      </header>

      {/* ===== DRAWER (mobile) ===== */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="absolute inset-y-0 left-0 flex w-[80%] max-w-xs flex-col surface border-r border-line p-4"
            >
              <div className="flex items-center justify-between">
                <a href="/" className="flex items-center gap-2.5">
                  <Logo size={36} />
                  <div className="leading-tight">
                    <div className="text-sm font-bold tracking-tight">EVS 2026</div>
                    <div className="text-[10px] text-muted">Esqd Comando</div>
                  </div>
                </a>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-[var(--r-md)] surface-2 ring-1 ring-line"
                >
                  <X size={16} />
                </button>
              </div>

              <NavList pathname={pathname} className="mt-6" />

              <div className="mt-auto pt-4">
                <ThemeRow theme={theme} onToggle={toggle} />
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ===== SIDEBAR (desktop) ===== */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-line lg:surface">
        <div className="flex items-center gap-3 px-5 py-5">
          <Logo size={40} />
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight">EVS 2026</div>
            <div className="text-[10px] text-muted">Esquadrão Comando</div>
          </div>
        </div>

        <NavList pathname={pathname} className="px-3" />

        <div className="mt-auto p-3">
          <SearchPrompt />
          <div className="mt-3">
            <ThemeRow theme={theme} onToggle={toggle} />
          </div>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-24 pt-4 sm:px-6 lg:px-10 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   helpers
============================================================ */

function fakeOpenCommand() {
  // dispatch ⌘K
  const event = new KeyboardEvent("keydown", {
    key: "k",
    metaKey: true,
    ctrlKey: true,
    bubbles: true,
  });
  window.dispatchEvent(event);
}

function NavList({
  pathname,
  className,
}: {
  pathname: string;
  className?: string;
}) {
  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {NAV.map((item) => {
        const active = isActive(pathname, item.href, item.exact);
        const Icon = item.icon;
        return (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex items-center gap-3 rounded-[var(--r-md)] px-3 py-2.5 text-sm font-medium transition",
              active
                ? "text-fg surface-2 ring-1 ring-line"
                : "text-muted hover:text-fg hover:surface-2",
            )}
          >
            {active && (
              <motion.span
                layoutId="nav-active"
                transition={{ type: "spring", stiffness: 360, damping: 32 }}
                className="absolute inset-y-1.5 left-0 w-1 rounded-r-full bg-[rgb(var(--primary))]"
              />
            )}
            <Icon size={16} className={active ? "text-[rgb(var(--primary-strong))]" : ""} />
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

function SearchPrompt() {
  return (
    <button
      type="button"
      onClick={fakeOpenCommand}
      className="flex w-full items-center gap-2 rounded-[var(--r-md)] surface-2 px-3 py-2.5 text-xs text-muted ring-1 ring-line transition hover:text-fg hover:surface-3"
    >
      <Search size={14} />
      <span className="flex-1 text-left">Buscar…</span>
      <span className="flex items-center gap-1">
        <kbd>⌘</kbd>
        <kbd>K</kbd>
      </span>
    </button>
  );
}

function ThemeRow({
  theme,
  onToggle,
}: {
  theme: "dark" | "light";
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-[var(--r-md)] surface-2 px-3 py-2.5 text-xs ring-1 ring-line transition hover:surface-3"
    >
      <span className="flex items-center gap-2">
        {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
        <span>Tema {theme === "dark" ? "escuro" : "claro"}</span>
      </span>
      <span className="text-faint">trocar</span>
    </button>
  );
}

function Logo({ size = 36 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="grid place-items-center rounded-[var(--r-md)] bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))] shadow-[0_8px_18px_rgba(0,0,0,.25)]"
    >
      <Shield size={size * 0.55} strokeWidth={2.4} />
    </div>
  );
}
