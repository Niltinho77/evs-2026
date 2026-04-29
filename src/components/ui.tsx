"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronDown } from "lucide-react";

/* ============================================================
   Helpers
============================================================ */

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ============================================================
   Card / Panel
============================================================ */

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  flush?: boolean;
  glass?: boolean;
};
export function Card({ className, flush, glass, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={cn(
        "rounded-[var(--r-xl)] border border-line shadow-soft",
        glass ? "glass" : "surface",
        flush ? "" : "p-4 sm:p-5",
        className,
      )}
    />
  );
}

export function CardHeader({
  title,
  subtitle,
  right,
  className,
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  if (!title && !subtitle && !right) return null;
  return (
    <div className={cn("mb-3 flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        {title ? (
          <div className="truncate text-sm font-semibold tracking-tight text-fg">
            {title}
          </div>
        ) : null}
        {subtitle ? (
          <div className="mt-0.5 text-xs text-muted">{subtitle}</div>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export function Section({
  title,
  description,
  right,
  children,
  className,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader title={title} subtitle={description} right={right} />
      {children}
    </Card>
  );
}

/* ============================================================
   Buttons
============================================================ */

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: false;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const BTN_BASE =
  "relative inline-flex items-center justify-center gap-2 rounded-[var(--r-md)] " +
  "font-semibold tracking-tight transition select-none disabled:opacity-50 disabled:pointer-events-none";

const BTN_SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-sm",
};

const BTN_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))] hover:bg-[rgb(var(--primary-strong))] shadow-[0_6px_18px_rgba(0,0,0,.25)]",
  secondary:
    "surface-2 text-fg border border-line hover:surface-3",
  ghost: "text-fg hover:surface-2",
  outline: "border border-line text-fg hover:surface-2",
  danger:
    "bg-[rgba(240,110,110,.12)] text-[rgb(var(--bad))] border border-[rgba(240,110,110,.28)] hover:bg-[rgba(240,110,110,.18)]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      className,
      leftIcon,
      rightIcon,
      loading,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        {...rest}
        className={cn(
          BTN_BASE,
          BTN_SIZES[size],
          BTN_VARIANTS[variant],
          "active:scale-[.98]",
          className,
        )}
      >
        {loading ? (
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  },
);

/** Botão-link (para `<a>`) */
export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  leftIcon,
  rightIcon,
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}) {
  return (
    <a
      {...rest}
      className={cn(BTN_BASE, BTN_SIZES[size], BTN_VARIANTS[variant], className)}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </a>
  );
}

/* Botão antigo — mantém compatibilidade */
export function Btn({
  variant = "solid",
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost" | "danger";
}) {
  const map: Record<string, ButtonVariant> = {
    solid: "primary",
    ghost: "outline",
    danger: "danger",
  };
  return (
    <Button
      variant={map[variant] ?? "primary"}
      className={cn("w-full", className)}
      {...(rest as any)}
    >
      {children}
    </Button>
  );
}

/* ============================================================
   Field / Input / Textarea / Select / Checkbox / Switch
============================================================ */

const CONTROL_BASE =
  "w-full rounded-[var(--r-md)] surface-3 border border-line text-fg " +
  "placeholder:text-faint outline-none transition " +
  "focus:border-[rgba(var(--primary),0.7)] focus:bg-[rgba(var(--primary),0.04)] " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const CONTROL_SIZES = "h-11 px-3 text-sm";

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label className="text-[11px] font-medium uppercase tracking-wider text-muted">
          {label}
          {required ? (
            <span className="ml-1 text-[rgb(var(--bad))]">*</span>
          ) : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <div className="text-[11px] text-[rgb(var(--bad))]">{error}</div>
      ) : hint ? (
        <div className="text-[11px] text-faint">{hint}</div>
      ) : null}
    </div>
  );
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...rest }, ref) {
  return (
    <input
      ref={ref}
      {...rest}
      className={cn(CONTROL_BASE, CONTROL_SIZES, className)}
    />
  );
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, rows = 4, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      {...rest}
      className={cn(CONTROL_BASE, "py-3 px-3 text-sm leading-snug", className)}
    />
  );
});

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, children, ...rest } = props;
  return (
    <div className="relative">
      <select
        {...rest}
        className={cn(
          CONTROL_BASE,
          CONTROL_SIZES,
          "appearance-none pr-9 cursor-pointer",
          className,
        )}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

export function Checkbox({
  label,
  description,
  checked,
  onChange,
  disabled,
  className,
}: {
  label: React.ReactNode;
  description?: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "group flex cursor-pointer select-none items-start gap-3 rounded-[var(--r-md)] border border-line surface-2 p-3 transition hover:surface-3",
        checked
          ? "border-[rgba(var(--primary),0.55)] bg-[rgba(var(--primary),0.08)]"
          : "",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        className,
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition",
          checked
            ? "border-[rgb(var(--primary))] bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))]"
            : "border-line surface-3 text-transparent group-hover:border-[rgb(var(--line-strong))]",
        )}
      >
        <Check size={14} strokeWidth={3} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-fg">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-[11px] text-muted">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

export function Switch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition",
        checked ? "bg-[rgb(var(--primary))]" : "surface-3 border border-line",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      )}
    >
      <motion.span
        className="block h-5 w-5 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,.25)]"
        animate={{ x: checked ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

/* ============================================================
   Pill / Badge
============================================================ */

type PillKind = "ok" | "bad" | "warn" | "muted" | "primary" | "info" | "accent";
const PILL_MAP: Record<PillKind, string> = {
  ok: "bg-[rgba(var(--ok),0.14)] text-[rgb(var(--ok))] border-[rgba(var(--ok),0.28)]",
  bad: "bg-[rgba(var(--bad),0.14)] text-[rgb(var(--bad))] border-[rgba(var(--bad),0.28)]",
  warn: "bg-[rgba(var(--warn),0.14)] text-[rgb(var(--warn))] border-[rgba(var(--warn),0.28)]",
  info: "bg-[rgba(var(--info),0.14)] text-[rgb(var(--info))] border-[rgba(var(--info),0.28)]",
  primary:
    "bg-[rgba(var(--primary),0.14)] text-[rgb(var(--primary-strong))] border-[rgba(var(--primary),0.32)]",
  accent:
    "bg-[rgba(var(--accent),0.12)] text-[rgb(var(--accent-strong))] border-[rgba(var(--accent),0.30)]",
  muted: "surface-3 text-muted border-line",
};

export function Pill({
  kind = "muted",
  children,
  className,
  size = "md",
  leftIcon,
}: {
  kind?: PillKind;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
  leftIcon?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-tight",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        PILL_MAP[kind],
        className,
      )}
    >
      {leftIcon}
      {children}
    </span>
  );
}

/* Painel legado — mantém alias pra não quebrar imports antigos */
export function Panel({
  title,
  right,
  children,
}: {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Section title={title} right={right}>
      {children}
    </Section>
  );
}

/* ============================================================
   Stat — métrica do dashboard
============================================================ */

export function Stat({
  label,
  value,
  hint,
  icon,
  tone = "default",
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "default" | "primary" | "accent" | "warn" | "bad" | "ok";
  className?: string;
}) {
  const toneCls: Record<typeof tone, string> = {
    default: "",
    primary: "stripe-mil",
    accent: "stripe-mil",
    warn: "bg-[rgba(var(--warn),0.05)]",
    bad: "bg-[rgba(var(--bad),0.05)]",
    ok: "bg-[rgba(var(--ok),0.05)]",
  } as any;

  return (
    <Card className={cn("relative overflow-hidden", toneCls[tone], className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            {label}
          </div>
          <div className="mt-1.5 font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            {value}
          </div>
          {hint ? (
            <div className="mt-1 text-[11px] text-faint">{hint}</div>
          ) : null}
        </div>
        {icon ? (
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--r-md)] surface-3 text-muted">
            {icon}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

/* ============================================================
   Tabs
============================================================ */

type TabsCtx = { value: string; onChange: (v: string) => void };
const TabsCtx = React.createContext<TabsCtx | null>(null);

export function Tabs({
  value,
  onChange,
  children,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TabsCtx.Provider value={{ value, onChange }}>
      <div className={cn("flex flex-col gap-3", className)}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "no-scrollbar -mx-1 flex items-center gap-1 overflow-x-auto rounded-[var(--r-md)] surface-2 p-1 ring-1 ring-line",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(TabsCtx);
  if (!ctx) return null;
  const active = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => ctx.onChange(value)}
      className={cn(
        "relative whitespace-nowrap rounded-[var(--r-sm)] px-3 py-2 text-xs font-semibold transition",
        active ? "text-fg" : "text-muted hover:text-fg",
      )}
    >
      {active && (
        <motion.span
          layoutId="tab-pill"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="absolute inset-0 rounded-[var(--r-sm)] bg-[rgba(var(--primary),0.16)] ring-1 ring-[rgba(var(--primary),0.35)]"
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(TabsCtx);
  if (!ctx) return null;
  if (ctx.value !== value) return null;
  return (
    <motion.div
      key={value}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn("flex flex-col gap-4", className)}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   Modal / Sheet
============================================================ */

export function Modal({
  open,
  onClose,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const widthCls = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  }[size];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="absolute inset-0 flex items-start justify-center overflow-y-auto p-4 pt-10 sm:pt-16">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
              className={cn(
                "glass relative w-full rounded-[var(--r-2xl)] border border-line shadow-pop",
                "max-h-[calc(100vh-110px)] flex flex-col overflow-hidden",
                widthCls,
              )}
            >
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function ModalHeader({
  title,
  description,
  onClose,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line p-4 sm:p-5">
      <div className="min-w-0">
        {title ? (
          <div className="truncate text-base font-bold tracking-tight">
            {title}
          </div>
        ) : null}
        {description ? (
          <div className="mt-1 text-xs text-muted">{description}</div>
        ) : null}
      </div>
      {onClose ? (
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full surface-2 text-muted ring-1 ring-line transition hover:surface-3 hover:text-fg"
        >
          <X size={16} />
        </button>
      ) : null}
    </div>
  );
}

export function ModalBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex-1 overflow-y-auto p-4 sm:p-5", className)}>
      {children}
    </div>
  );
}

export function ModalFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-t border-line surface-2 p-4 sm:p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ============================================================
   Avatar
============================================================ */

export function Avatar({
  src,
  alt,
  size = 56,
  fallback,
  className,
  ring,
}: {
  src?: string | null;
  alt?: string;
  size?: number;
  fallback?: React.ReactNode;
  className?: string;
  ring?: boolean;
}) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "relative shrink-0 overflow-hidden rounded-[var(--r-lg)] surface-3",
        ring ? "ring-2 ring-[rgba(var(--primary),0.35)]" : "border border-line",
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
      ) : (
        <div className="grid h-full w-full place-items-center text-[10px] font-semibold uppercase tracking-wide text-faint">
          {fallback ?? "—"}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   KV (label/value)
============================================================ */

export function KV({
  label,
  value,
  full,
}: {
  label: React.ReactNode;
  value?: React.ReactNode;
  full?: boolean;
}) {
  const empty =
    value === null ||
    value === undefined ||
    value === "" ||
    (typeof value === "string" && !value.trim());
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-[var(--r-md)] surface-2 p-3 ring-1 ring-line",
        full ? "sm:col-span-2" : "",
      )}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </div>
      <div
        className={cn(
          "text-sm whitespace-pre-wrap",
          empty ? "text-faint" : "text-fg",
        )}
      >
        {empty ? "—" : value}
      </div>
    </div>
  );
}

/* ============================================================
   Empty / Skeleton
============================================================ */

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Card className="text-center">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full surface-3 text-muted">
        {icon}
      </div>
      <div className="text-sm font-semibold text-fg">{title}</div>
      {description ? (
        <div className="mx-auto mt-1 max-w-sm text-xs text-muted">
          {description}
        </div>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </Card>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--r-md)] surface-3",
        className,
      )}
    />
  );
}
