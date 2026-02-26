"use client";

export function Panel({ title, right, children }: { title?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 shadow-[var(--shadow)]">
      {(title || right) && (
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs font-semibold tracking-wide text-white/70">{title}</div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-semibold text-white/60">{label}</div>
      {children}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-2xl bg-black/40 px-3 py-3 text-sm",
        "ring-1 ring-white/10 outline-none",
        "focus:ring-2 focus:ring-[rgba(255,92,12,.55)]",
        "placeholder:text-white/25",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "w-full rounded-2xl bg-black/40 px-3 py-3 text-sm",
        "ring-1 ring-white/10 outline-none",
        "focus:ring-2 focus:ring-[rgba(255,92,12,.55)]",
        "placeholder:text-white/25",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "w-full rounded-2xl bg-black/40 px-3 py-3 text-sm",
        "ring-1 ring-white/10 outline-none",
        "focus:ring-2 focus:ring-[rgba(255,92,12,.55)]",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function Btn({
  variant = "solid",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "ghost" | "danger" }) {
  const base =
    "w-full rounded-2xl px-4 py-3 text-sm font-extrabold transition active:scale-[.99]";
  const solid = "bg-[rgb(var(--accent))] text-black";
  const ghost = "bg-white/5 text-white ring-1 ring-white/10";
  const danger = "bg-[rgba(248,113,113,.18)] text-[rgb(var(--bad))] ring-1 ring-[rgba(248,113,113,.28)]";

  const cls = variant === "solid" ? solid : variant === "danger" ? danger : ghost;

  return (
    <button
      {...props}
      className={[base, cls, props.disabled ? "opacity-60" : ""].join(" ")}
    />
  );
}

export function Pill({ kind, children }: { kind: "ok" | "bad" | "warn" | "muted"; children: React.ReactNode }) {
  const map: Record<string, string> = {
    ok: "bg-[rgba(74,222,128,.14)] text-[rgb(var(--ok))] ring-1 ring-[rgba(74,222,128,.25)]",
    bad: "bg-[rgba(248,113,113,.14)] text-[rgb(var(--bad))] ring-1 ring-[rgba(248,113,113,.25)]",
    warn: "bg-[rgba(251,191,36,.14)] text-[rgb(var(--warn))] ring-1 ring-[rgba(251,191,36,.25)]",
    muted: "bg-white/5 text-white/70 ring-1 ring-white/10",
  };
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold ${map[kind]}`}>{children}</span>;
}