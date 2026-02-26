"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Soldier = {
  id: string;
  photoUrl?: string | null;
  fullName: string;
  warName: string;
  cpf: string;
  platoon?: "P1" | "P2" | "P3" | null;
  fatds: { id: string }[];
};

export default function HomePage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/soldiers?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setSoldiers(data.soldiers ?? []);
    setLoading(false);
  }

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    load();
  }, []);

  const total = soldiers.length;

  const comFATD = useMemo(
    () => soldiers.filter((s) => s.fatds.length > 0).length,
    [soldiers]
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card title="Total EVs" value={String(total)} />
        <Card title="Com FATD" value={String(comFATD)} />
        <Card title="Esqd" value="Comando" />
        <Card title="Busca ativa" value={q ? "Sim" : "Não"} />
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3">
        <label className="text-xs text-zinc-400">
          Buscar (nome, guerra, CPF)
        </label>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ex: SILVA ou 12345678900"
          className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm outline-none focus:border-zinc-500"
        />
      </div>

      <div className="text-xs text-zinc-400">
        {loading ? "Carregando..." : `Mostrando ${soldiers.length} registro(s)`}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {soldiers.map((s) => (
          <a
            key={s.id}
            href={`/soldiers/${s.id}`}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-3 active:scale-[0.997]"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                {s.photoUrl ? (
                  <Image
                    src={s.photoUrl}
                    alt={s.warName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-500">
                    sem foto
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">
                  {s.warName}
                </div>
                <div className="truncate text-xs text-zinc-400">
                  {s.fullName}
                </div>
                <div className="mt-1 text-[11px] text-zinc-300">
                  CPF: {s.cpf}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {!loading && soldiers.length === 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-300">
          Nenhum militar encontrado.
        </div>
      )}
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-3">
      <div className="text-xs text-zinc-400">{title}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}