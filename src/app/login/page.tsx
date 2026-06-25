"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, Shield } from "lucide-react";
import { Button, Card, Input } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const params = useSearchParams();
  const next = useMemo(() => params.get("next") || "/", [params]);
  const { refresh } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha no login.");
      await refresh();
      window.location.href = next.startsWith("/") ? next : "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-[var(--r-md)] bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))]">
            <Shield size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-fg">
              EVS 2026
            </h1>
            <p className="text-xs text-muted">Acesso restrito</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted">
              Usuario
            </div>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>
          <div>
            <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted">
              Senha
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <div className="rounded-[var(--r-md)] border border-[rgba(var(--bad),0.3)] bg-[rgba(var(--bad),0.08)] px-3 py-2 text-xs text-[rgb(var(--bad))]">
              {error}
            </div>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
            leftIcon={<Lock size={14} />}
          >
            Entrar
          </Button>
        </form>
      </Card>
    </main>
  );
}
