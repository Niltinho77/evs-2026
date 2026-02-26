"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type FATD = {
  id: string;
  date: string;
  reason: string;
  punishment: string;
};

type FO = {
  id: string;
  date: string;
  createdAt: string;
  type: "POSITIVO" | "NEGATIVO";
  text: string;
};

type Soldier = {
  id: string;
  createdAt: string;
  updatedAt: string;

  squad: string;
  platoon?: "P1" | "P2" | "P3" | null;

  photoUrl?: string | null;

  fullName: string;
  warName: string;
  cpf: string;
  idt: string;

  phone: string;
  emergencyPhone: string;
  naturalidade: string;
  motherName: string;
  fatherName: string;
  address: string;

  laranjeira: boolean;
  familyHistory?: string | null;
  professionalExp?: string | null;
  education?: string | null;

  hasLicense: boolean;
  licenseCategory?: string | null;

  bloodType?: string | null;

  bank?: string | null;
  agency?: string | null;
  account?: string | null;

  religion?: string | null;
  voterTitle?: string | null;

  isAthlete: boolean;
  physicalActivity?: string | null;

  notesPositive?: string | null;
  notesNegative?: string | null;

  fatds: FATD[];
  fos: FO[];
};

const PLATOON_LABEL: Record<string, string> = {
  P1: "1º Pelotão",
  P2: "2º Pelotão",
  P3: "3º Pelotão",
};

const BANK_LABEL: Record<string, string> = {
  BANCO_DO_BRASIL: "Banco do Brasil",
  CAIXA: "Caixa",
  SANTANDER: "Santander",
  ITAU: "Itaú",
  NUBANK: "Nubank",
  OUTRO: "Outro",
};

const BLOOD_LABEL: Record<string, string> = {
  A_POS: "A+",
  A_NEG: "A-",
  B_POS: "B+",
  B_NEG: "B-",
  AB_POS: "AB+",
  AB_NEG: "AB-",
  O_POS: "O+",
  O_NEG: "O-",
};

const PUNISH_LABEL: Record<string, string> = {
  ADVERTENCIA: "Advertência",
  IMPEDIMENTO: "Impedimento",
  REPREENSAO: "Repreensão",
  DETENCAO: "Detenção",
  CADEIA: "Cadeia",
};

export default function SoldierDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [soldier, setSoldier] = useState<Soldier | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // FO quick modal
  const [foOpen, setFoOpen] = useState(false);
  const [foType, setFoType] = useState<"POSITIVO" | "NEGATIVO">("POSITIVO");
  const [foText, setFoText] = useState("");
  const [foDate, setFoDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [foSaving, setFoSaving] = useState(false);

  const meta = useMemo(() => {
    if (!soldier) return null;
    return {
      platoon: soldier.platoon ? PLATOON_LABEL[soldier.platoon] : "—",
      createdAt: new Date(soldier.createdAt).toLocaleString(),
      updatedAt: new Date(soldier.updatedAt).toLocaleString(),
    };
  }, [soldier]);

  async function load() {
    if (!id) return;
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/soldiers/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Falha ao carregar.");
      setSoldier(data.soldier ?? null);
    } catch (e: any) {
      setErr(e?.message ?? "Erro.");
      setSoldier(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  function openFo(type: "POSITIVO" | "NEGATIVO") {
    setFoType(type);
    setFoText("");
    setFoDate(new Date().toISOString().slice(0, 10));
    setFoOpen(true);
  }

  async function submitFO() {
    if (!id) return;
    const text = foText.trim();
    if (!text) {
      alert("Digite o fato observado.");
      return;
    }

    setFoSaving(true);
    try {
      const res = await fetch(`/api/soldiers/${id}/fo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: foType,
          text,
          date: `${foDate}T12:00:00.000Z`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Erro ao lançar FO.");

      const created: FO = data.fo;
      setSoldier((prev) => (prev ? { ...prev, fos: [created, ...prev.fos] } : prev));
      setFoOpen(false);
    } catch (e: any) {
      alert(e?.message ?? "Erro.");
    } finally {
      setFoSaving(false);
    }
  }

  async function deleteFO(foId: string) {
    if (!confirm("Excluir este FO?")) return;
    const res = await fetch(`/api/fo/${foId}`, { method: "DELETE" });
    if (res.ok) {
      setSoldier((prev) => (prev ? { ...prev, fos: prev.fos.filter((x) => x.id !== foId) } : prev));
    }
  }

  if (!id) return null;

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-300">
        Carregando ficha...
      </div>
    );
  }

  if (err || !soldier) {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl border border-red-900/40 bg-red-950/30 p-4 text-sm text-red-200">
          {err ?? "Militar não encontrado."}
        </div>
        <a
          href="/"
          className="inline-block rounded-2xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm font-semibold text-zinc-200"
        >
          Voltar
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4">
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            {soldier.photoUrl ? (
              <img src={soldier.photoUrl} alt={soldier.warName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">sem foto</div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-xl font-semibold">{soldier.warName}</div>
            <div className="truncate text-sm text-zinc-400">{soldier.fullName}</div>

            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-zinc-300 sm:grid-cols-4">
              <Meta label="CPF" value={soldier.cpf} />
              <Meta label="IDT" value={soldier.idt} />
              <Meta label="Pelotão" value={meta?.platoon ?? "—"} />
              <Meta label="FOs" value={String(soldier.fos?.length ?? 0)} />
              <Meta label="Criado" value={meta?.createdAt ?? "—"} />
              <Meta label="Atualizado" value={meta?.updatedAt ?? "—"} />
              <Meta label="Esqd" value={soldier.squad ?? "Comando"} />
              <Meta label="Laranjeira" value={soldier.laranjeira ? "Sim" : "Não"} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={`/soldiers/${soldier.id}/edit`}
          className="rounded-2xl bg-zinc-100 px-4 py-3 text-center text-sm font-semibold text-zinc-900"
        >
          Editar
        </a>

        <button
          onClick={async () => {
            const ok = confirm(`Excluir ${soldier.warName}?\n\nIsso apaga também FATDs e FOs.`);
            if (!ok) return;
            const res = await fetch(`/api/soldiers/${soldier.id}`, { method: "DELETE" });
            if (res.ok) window.location.href = "/";
          }}
          className="rounded-2xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm font-semibold text-red-200"
        >
          Excluir
        </button>
      </div>

      <Section title={`Fatos Observados (FO) — ${soldier.fos.length}`}>
        {soldier.fos.length === 0 ? (
          <div className="text-sm text-zinc-400">Nenhum FO registrado.</div>
        ) : (
          <div className="space-y-2">
            {soldier.fos.map((fo) => (
              <div key={fo.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{fo.type === "POSITIVO" ? "FO +" : "FO -"}</div>
                    <div className="text-xs text-zinc-400">{new Date(fo.date).toLocaleDateString()}</div>
                  </div>
                  <button
                    onClick={() => deleteFO(fo.id)}
                    className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-2 py-1 text-[11px] font-semibold text-zinc-200"
                  >
                    Excluir
                  </button>
                </div>
                <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-200">{fo.text}</div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Contato / Endereço">
        <KV label="Telefone" value={soldier.phone} />
        <KV label="Telefone emergência" value={soldier.emergencyPhone} />
        <KV label="Naturalidade" value={soldier.naturalidade} />
        <KV label="Endereço" value={soldier.address} />
      </Section>

      <Section title="Família / Histórico">
        <KV label="Nome da mãe" value={soldier.motherName} />
        <KV label="Nome do pai" value={soldier.fatherName} />
        <KV label="Histórico familiar" value={soldier.familyHistory} />
      </Section>

      <Section title="Formação / Profissão">
        <KV label="Escolaridade" value={soldier.education} />
        <KV label="Experiência profissional" value={soldier.professionalExp} />
      </Section>

      <Section title="CNH / Saúde">
        <KV label="Habilitação" value={soldier.hasLicense ? "Sim" : "Não"} />
        <KV label="Categoria" value={soldier.licenseCategory} />
        <KV label="Tipo sanguíneo" value={soldier.bloodType ? (BLOOD_LABEL[soldier.bloodType] ?? soldier.bloodType) : "—"} />
      </Section>

      <Section title="Banco">
        <KV label="Banco" value={soldier.bank ? (BANK_LABEL[soldier.bank] ?? soldier.bank) : "—"} />
        <KV label="Agência" value={soldier.agency} />
        <KV label="Conta" value={soldier.account} />
      </Section>

      <Section title="Outros">
        <KV label="Religião" value={soldier.religion} />
        <KV label="Título de eleitor" value={soldier.voterTitle} />
        <KV label="Atleta" value={soldier.isAthlete ? "Sim" : "Não"} />
        <KV label="Atividade física" value={soldier.physicalActivity} />
      </Section>

      <Section title="Fatos observados (campos livres)">
        <KV label="Positivos (campo)" value={soldier.notesPositive} />
        <KV label="Negativos (campo)" value={soldier.notesNegative} />
      </Section>

      <Section title={`FATDs (${soldier.fatds.length})`}>
        {soldier.fatds.length === 0 ? (
          <div className="text-sm text-zinc-400">Nenhuma FATD registrada.</div>
        ) : (
          <div className="space-y-2">
            {soldier.fatds.map((f) => (
              <div key={f.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">{PUNISH_LABEL[f.punishment] ?? f.punishment}</div>
                  <div className="text-xs text-zinc-400">{new Date(f.date).toLocaleDateString()}</div>
                </div>
                <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-200">{f.reason}</div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <a
        href="/"
        className="block w-full rounded-2xl border border-zinc-800 bg-zinc-900/40 px-4 py-4 text-center text-sm font-semibold text-zinc-200"
      >
        Voltar
      </a>

      {/* Bottom bar - FO quick actions */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-3 px-4 py-3">
          <button
            onClick={() => openFo("POSITIVO")}
            className="flex-1 rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900"
          >
            FO +
          </button>
          <button
            onClick={() => openFo("NEGATIVO")}
            className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm font-semibold text-zinc-100"
          >
            FO -
          </button>
        </div>
      </div>

      {/* Bottom sheet modal */}
      {foOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => !foSaving && setFoOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-6xl rounded-t-3xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold">{foType === "POSITIVO" ? "Registrar FO +" : "Registrar FO -"}</div>
                <div className="text-xs text-zinc-400">{soldier.warName} — {soldier.fullName}</div>
              </div>
              <button
                onClick={() => !foSaving && setFoOpen(false)}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-xs font-semibold text-zinc-200"
              >
                Fechar
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <div className="text-xs text-zinc-400">Data</div>
                <input
                  type="date"
                  value={foDate}
                  onChange={(e) => setFoDate(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900/30 px-3 py-3 text-sm outline-none focus:border-zinc-500"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="text-xs text-zinc-400">Fato observado</div>
                <textarea
                  value={foText}
                  onChange={(e) => setFoText(e.target.value)}
                  placeholder="Digite o FO de forma objetiva..."
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900/30 px-3 py-3 text-sm outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <button
              onClick={submitFO}
              disabled={foSaving}
              className="mt-4 w-full rounded-2xl bg-zinc-100 px-4 py-4 text-sm font-semibold text-zinc-900 disabled:opacity-60"
            >
              {foSaving ? "Salvando..." : "Salvar FO"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4">
      <div className="mb-3 text-sm font-semibold">{title}</div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function KV({ label, value }: { label: string; value?: string | null }) {
  const v = value?.trim?.() ? value : "—";
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
      <div className="text-[11px] text-zinc-400">{label}</div>
      <div className="mt-1 whitespace-pre-wrap text-sm text-zinc-200">{v}</div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2">
      <div className="text-[10px] text-zinc-400">{label}</div>
      <div className="mt-0.5 truncate text-[11px] font-semibold text-zinc-100">{value}</div>
    </div>
  );
}