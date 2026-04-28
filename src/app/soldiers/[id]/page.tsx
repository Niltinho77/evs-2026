"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Activity,
  CarFront,
  AlertTriangle,
  Calendar,
  X,
} from "lucide-react";
import {
  Section,
  Card,
  Avatar,
  Pill,
  KV,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  LinkButton,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Skeleton,
  EmptyState,
  Textarea,
  Input,
  cn,
} from "@/components/ui";

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
  facebook?: string | null;
  instagram?: string | null;

  healthIssues?: string | null;

  hasGirlfriend: boolean;
  girlfriendAddress?: string | null;

  usedDrugs: boolean;
  drugsDetails?: string | null;

  tattoos?: string | null;
  childrenCount?: number | null;

  hasBeenArrested: boolean;
  arrestDetails?: string | null;

  livesWithParents: boolean;
  livesWithWhom?: string | null;

  lostCloseFamily: boolean;
  lostWhoCause?: string | null;

  livedAway: boolean;
  livedAwayWhere?: string | null;

  householdCount?: number | null;

  familyIncome?: any;
  helpsFamily: boolean;
  helpsFamilyAmount?: any;

  hasSiblings: boolean;
  siblingsCount?: number | null;

  smoker: boolean;
  alcoholUse: boolean;

  policeProblems: boolean;
  policeProblemsDetails?: string | null;

  accidentSequelae: boolean;
  accidentSequelaeDetails?: string | null;

  hadSurgeries: boolean;
  surgeriesDetails?: string | null;

  hasSTDs: boolean;
  stdDetails?: string | null;

  hasSeizuresFainting: boolean;
  mentalSymptoms: boolean;
  mentalSymptomsDetails?: string | null;

  suddenFear: boolean;

  irritabilityAnxietyEtc: boolean;
  irritabilityAnxietyEtcDetails?: string | null;

  hasMilitaryRelative: boolean;
  militaryRelativeDetails?: string | null;

  relationshipFather?: string | null;
  relationshipMother?: string | null;
  relationshipSiblings?: string | null;

  workedBeforeEB: boolean;
  workSignedCard: boolean;
  workSalary?: any;
  workDetails?: string | null;

  volunteeredToServe: boolean;

  identidadeMilitar?: string | null;
  altura?: number | null;
  cabelo?: string | null;
  cutis?: string | null;
  corOlhos?: string | null;
  doadorOrgaos?: boolean | null;

  fatds: FATD[];
  fos: FO[];
};

const PLATOON_LABEL: Record<string, string> = {
  P1: "1º Pelotão",
  P2: "2º Pelotão",
  P3: "3º Pelotão",
};

const PLATOON_TONE: Record<string, "primary" | "accent" | "info"> = {
  P1: "primary",
  P2: "accent",
  P3: "info",
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

function moneyBR(v: any): string {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(String(v).replace(",", "."));
  if (!Number.isFinite(n)) return String(v);
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatCpf(cpf: string) {
  const d = (cpf ?? "").replace(/\D/g, "");
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function YN(v: boolean | null | undefined) {
  return v ? (
    <Pill kind="ok" size="sm">
      Sim
    </Pill>
  ) : (
    <Pill kind="muted" size="sm">
      Não
    </Pill>
  );
}

export default function SoldierDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [soldier, setSoldier] = useState<Soldier | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState<string>("overview");

  // FO modal
  const [foOpen, setFoOpen] = useState(false);
  const [foType, setFoType] = useState<"POSITIVO" | "NEGATIVO">("POSITIVO");
  const [foText, setFoText] = useState("");
  const [foDate, setFoDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [foSaving, setFoSaving] = useState(false);

  const meta = useMemo(() => {
    if (!soldier) return null;
    return {
      platoon: soldier.platoon ? PLATOON_LABEL[soldier.platoon] : "—",
      createdAt: new Date(soldier.createdAt).toLocaleDateString("pt-BR"),
      updatedAt: new Date(soldier.updatedAt).toLocaleDateString("pt-BR"),
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
      setSoldier((prev) =>
        prev ? { ...prev, fos: [created, ...prev.fos] } : prev,
      );
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
      setSoldier((prev) =>
        prev ? { ...prev, fos: prev.fos.filter((x) => x.id !== foId) } : prev,
      );
    }
  }

  async function deleteSoldier() {
    if (!soldier) return;
    const ok = confirm(
      `Excluir ${soldier.warName}?\n\nIsso apaga também FATDs e FOs.`,
    );
    if (!ok) return;
    const res = await fetch(`/api/soldiers/${soldier.id}`, {
      method: "DELETE",
    });
    if (res.ok) window.location.href = "/";
  }

  if (!id) return null;

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-12" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (err || !soldier) {
    return (
      <Card className="space-y-3">
        <div className="text-sm text-[rgb(var(--bad))]">
          {err ?? "Militar não encontrado."}
        </div>
        <LinkButton href="/" variant="outline" leftIcon={<ArrowLeft size={14} />}>
          Voltar
        </LinkButton>
      </Card>
    );
  }

  const counts = {
    fos: soldier.fos.length,
    fosPos: soldier.fos.filter((f) => f.type === "POSITIVO").length,
    fosNeg: soldier.fos.filter((f) => f.type === "NEGATIVO").length,
    fatds: soldier.fatds.length,
  };

  return (
    <div className="space-y-5 pb-28">
      {/* HEADER */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-32 stripe-mil pointer-events-none" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex items-center gap-4">
            <Avatar
              src={soldier.photoUrl}
              alt={soldier.warName}
              size={104}
              fallback={(soldier.warName || soldier.fullName).slice(0, 2)}
              ring
              className="shadow-pop"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted">
                <span>{soldier.squad ?? "Comando"}</span>
                {soldier.platoon ? (
                  <Pill kind={PLATOON_TONE[soldier.platoon] ?? "muted"} size="sm">
                    {PLATOON_LABEL[soldier.platoon]}
                  </Pill>
                ) : null}
              </div>
              <h1 className="mt-1 truncate font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                {soldier.warName || soldier.fullName}
              </h1>
              <div className="truncate text-sm text-muted">
                {soldier.fullName}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {soldier.isAthlete ? (
                  <Pill kind="ok" size="sm" leftIcon={<Activity size={11} />}>
                    Atleta
                  </Pill>
                ) : null}
                {soldier.hasLicense ? (
                  <Pill kind="info" size="sm" leftIcon={<CarFront size={11} />}>
                    CNH {soldier.licenseCategory ?? ""}
                  </Pill>
                ) : null}
                {soldier.laranjeira ? (
                  <Pill kind="accent" size="sm" leftIcon={<ShieldCheck size={11} />}>
                    Laranjeira
                  </Pill>
                ) : null}
                {soldier.usedDrugs ? (
                  <Pill kind="bad" size="sm" leftIcon={<AlertTriangle size={11} />}>
                    Já usou drogas
                  </Pill>
                ) : null}
                {soldier.volunteeredToServe ? (
                  <Pill kind="primary" size="sm">
                    Voluntário
                  </Pill>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            <LinkButton
              href={`/soldiers/${soldier.id}/edit`}
              variant="secondary"
              size="sm"
              leftIcon={<Pencil size={14} />}
            >
              Editar
            </LinkButton>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 size={14} />}
              onClick={deleteSoldier}
            >
              Excluir
            </Button>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Meta label="CPF" value={formatCpf(soldier.cpf)} />
          <Meta label="IDT" value={soldier.idt || "—"} />
          <Meta label="Pelotão" value={meta?.platoon ?? "—"} />
          <Meta
            label="FOs / FATDs"
            value={`${counts.fos} / ${counts.fatds}`}
            hint={`+${counts.fosPos} -${counts.fosNeg}`}
          />
        </div>
      </Card>

      {/* TABS */}
      <Tabs value={tab} onChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão geral</TabsTrigger>
          <TabsTrigger value="family">Família</TabsTrigger>
          <TabsTrigger value="health">Saúde &amp; ocorrências</TabsTrigger>
          <TabsTrigger value="work">Renda &amp; trabalho</TabsTrigger>
          <TabsTrigger value="fos">FOs ({counts.fos})</TabsTrigger>
          <TabsTrigger value="fatds">FATDs ({counts.fatds})</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview">
          <Section title="Identificação">
            <div className="grid gap-2 sm:grid-cols-2">
              <KV label="Nome de guerra" value={soldier.warName} />
              <KV label="Nome completo" value={soldier.fullName} />
              <KV label="Identidade Militar" value={soldier.identidadeMilitar} />
              <KV label="Naturalidade" value={soldier.naturalidade} />
              <KV
                label="Altura"
                value={soldier.altura ? `${soldier.altura} cm` : "—"}
              />
              <KV
                label="Tipo sanguíneo"
                value={
                  soldier.bloodType
                    ? (BLOOD_LABEL[soldier.bloodType] ?? soldier.bloodType)
                    : "—"
                }
              />
              <KV label="Cabelo" value={soldier.cabelo} />
              <KV label="Cútis" value={soldier.cutis} />
              <KV label="Cor dos olhos" value={soldier.corOlhos} />
              <KV label="Doador de órgãos" value={YN(soldier.doadorOrgaos)} />
            </div>
          </Section>

          <Section title="Contato e endereço">
            <div className="grid gap-2 sm:grid-cols-2">
              <KV label="Telefone" value={soldier.phone} />
              <KV label="Telefone emergência" value={soldier.emergencyPhone} />
              <KV label="Endereço" full value={soldier.address} />
              <KV label="Facebook" value={soldier.facebook} />
              <KV label="Instagram" value={soldier.instagram} />
            </div>
          </Section>

          <Section title="Banco">
            <div className="grid gap-2 sm:grid-cols-3">
              <KV
                label="Banco"
                value={soldier.bank ? (BANK_LABEL[soldier.bank] ?? soldier.bank) : "—"}
              />
              <KV label="Agência" value={soldier.agency} />
              <KV label="Conta" value={soldier.account} />
            </div>
          </Section>

          <Section title="Outros">
            <div className="grid gap-2 sm:grid-cols-2">
              <KV label="Religião" value={soldier.religion} />
              <KV label="Título de eleitor" value={soldier.voterTitle} />
              <KV label="Atleta" value={YN(soldier.isAthlete)} />
              <KV label="Atividade física" value={soldier.physicalActivity} />
              <KV label="Voluntariou-se" value={YN(soldier.volunteeredToServe)} />
              <KV label="Cadastrado em" value={meta?.createdAt} />
            </div>
          </Section>

          <Section title="Histórico e observações">
            <div className="grid gap-2 sm:grid-cols-2">
              <KV label="Histórico familiar" full value={soldier.familyHistory} />
              <KV label="Experiência profissional" full value={soldier.professionalExp} />
              <KV label="Escolaridade" value={soldier.education} />
              <KV label="Observações positivas" full value={soldier.notesPositive} />
              <KV label="Observações negativas" full value={soldier.notesNegative} />
            </div>
          </Section>
        </TabsContent>

        {/* FAMILY */}
        <TabsContent value="family">
          <Section title="Pais">
            <div className="grid gap-2 sm:grid-cols-2">
              <KV label="Nome da mãe" value={soldier.motherName} />
              <KV label="Nome do pai" value={soldier.fatherName} />
              <KV label="Relação com a mãe" full value={soldier.relationshipMother} />
              <KV label="Relação com o pai" full value={soldier.relationshipFather} />
              <KV label="Relação com irmãos" full value={soldier.relationshipSiblings} />
            </div>
          </Section>

          <Section title="Convivência e estrutura familiar">
            <div className="grid gap-2 sm:grid-cols-2">
              <KV label="Mora com os pais" value={YN(soldier.livesWithParents)} />
              <KV label="Mora com quem" value={soldier.livesWithWhom} />
              <KV label="Tem irmãos" value={YN(soldier.hasSiblings)} />
              <KV
                label="Qtd. irmãos"
                value={soldier.siblingsCount ?? "—"}
              />
              <KV label="Qtd. filhos" value={soldier.childrenCount ?? "—"} />
              <KV label="Qtd. pessoas na casa" value={soldier.householdCount ?? "—"} />
              <KV label="Já morou fora" value={YN(soldier.livedAway)} />
              <KV label="Onde morou fora" value={soldier.livedAwayWhere} />
              <KV label="Perdeu familiar próximo" value={YN(soldier.lostCloseFamily)} />
              <KV label="Quem / causa" full value={soldier.lostWhoCause} />
              <KV label="Tatuagens" full value={soldier.tattoos} />
            </div>
          </Section>

          <Section title="Relacionamento e parentes">
            <div className="grid gap-2 sm:grid-cols-2">
              <KV label="Namorada" value={YN(soldier.hasGirlfriend)} />
              {soldier.hasGirlfriend ? (
                <KV label="Endereço da namorada" full value={soldier.girlfriendAddress} />
              ) : null}
              <KV label="Parente militar" value={YN(soldier.hasMilitaryRelative)} />
              {soldier.hasMilitaryRelative ? (
                <KV label="Detalhes parente militar" full value={soldier.militaryRelativeDetails} />
              ) : null}
            </div>
          </Section>
        </TabsContent>

        {/* HEALTH */}
        <TabsContent value="health">
          <Section title="Saúde">
            <div className="grid gap-2 sm:grid-cols-2">
              <KV label="Problemas de saúde" full value={soldier.healthIssues} />
              <KV label="Já fez cirurgias" value={YN(soldier.hadSurgeries)} />
              <KV label="Detalhes (cirurgias)" full value={soldier.surgeriesDetails} />
              <KV label="Sequelas de acidente" value={YN(soldier.accidentSequelae)} />
              <KV label="Detalhes (sequelas)" full value={soldier.accidentSequelaeDetails} />
              <KV label="IST/DST" value={YN(soldier.hasSTDs)} />
              <KV label="Detalhes IST/DST" full value={soldier.stdDetails} />
              <KV label="Convulsões/desmaios" value={YN(soldier.hasSeizuresFainting)} />
            </div>
          </Section>

          <Section title="Saúde mental">
            <div className="grid gap-2 sm:grid-cols-2">
              <KV label="Sintomas mentais" value={YN(soldier.mentalSymptoms)} />
              <KV label="Detalhes" full value={soldier.mentalSymptomsDetails} />
              <KV label="Medo súbito" value={YN(soldier.suddenFear)} />
              <KV
                label="Irritabilidade/ansiedade"
                value={YN(soldier.irritabilityAnxietyEtc)}
              />
              <KV
                label="Detalhes"
                full
                value={soldier.irritabilityAnxietyEtcDetails}
              />
            </div>
          </Section>

          <Section title="Hábitos e ocorrências">
            <div className="grid gap-2 sm:grid-cols-2">
              <KV label="Fumante" value={YN(soldier.smoker)} />
              <KV label="Consome álcool" value={YN(soldier.alcoholUse)} />
              <KV label="Já usou drogas" value={YN(soldier.usedDrugs)} />
              <KV label="Quais drogas" full value={soldier.drugsDetails} />
              <KV label="Já foi preso" value={YN(soldier.hasBeenArrested)} />
              <KV label="Detalhes prisão" full value={soldier.arrestDetails} />
              <KV label="Problemas com a polícia" value={YN(soldier.policeProblems)} />
              <KV label="Detalhes (polícia)" full value={soldier.policeProblemsDetails} />
            </div>
          </Section>
        </TabsContent>

        {/* WORK */}
        <TabsContent value="work">
          <Section title="Renda e ajuda à família">
            <div className="grid gap-2 sm:grid-cols-2">
              <KV label="Renda familiar" value={moneyBR(soldier.familyIncome)} />
              <KV label="Ajuda a família" value={YN(soldier.helpsFamily)} />
              <KV label="Quanto ajuda" value={moneyBR(soldier.helpsFamilyAmount)} />
            </div>
          </Section>

          <Section title="Trabalho antes do EB">
            <div className="grid gap-2 sm:grid-cols-2">
              <KV label="Trabalhou antes" value={YN(soldier.workedBeforeEB)} />
              <KV label="Carteira assinada" value={YN(soldier.workSignedCard)} />
              <KV label="Salário" value={moneyBR(soldier.workSalary)} />
              <KV label="Detalhes" full value={soldier.workDetails} />
            </div>
          </Section>
        </TabsContent>

        {/* FOs */}
        <TabsContent value="fos">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              leftIcon={<Plus size={14} />}
              onClick={() => openFo("POSITIVO")}
            >
              Novo FO+
            </Button>
            <Button
              variant="secondary"
              leftIcon={<Minus size={14} />}
              onClick={() => openFo("NEGATIVO")}
            >
              Novo FO-
            </Button>
          </div>

          {soldier.fos.length === 0 ? (
            <EmptyState
              icon={<Calendar size={20} />}
              title="Nenhum FO registrado"
              description="Use FO+ ou FO- pra lançar um fato observado."
            />
          ) : (
            <div className="space-y-2">
              {soldier.fos.map((fo) => (
                <FoCard key={fo.id} fo={fo} onDelete={deleteFO} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* FATDs */}
        <TabsContent value="fatds">
          {soldier.fatds.length === 0 ? (
            <EmptyState
              icon={<AlertTriangle size={20} />}
              title="Nenhuma FATD registrada"
            />
          ) : (
            <div className="space-y-2">
              {soldier.fatds.map((f) => (
                <Card key={f.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Pill kind="warn" size="sm">
                        {PUNISH_LABEL[f.punishment] ?? f.punishment}
                      </Pill>
                      <span className="text-xs text-muted">
                        {new Date(f.date).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 whitespace-pre-wrap text-sm text-fg">
                    {f.reason}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <LinkButton href="/" variant="ghost" leftIcon={<ArrowLeft size={14} />}>
        Voltar pro painel
      </LinkButton>

      {/* FO QUICK BAR */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line glass">
        <div className="mx-auto flex max-w-[1400px] gap-2.5 px-4 py-3 lg:pl-[18.5rem] lg:pr-10">
          <Button
            variant="secondary"
            className="flex-1"
            leftIcon={<Plus size={14} />}
            onClick={() => openFo("POSITIVO")}
          >
            FO +
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            leftIcon={<Minus size={14} />}
            onClick={() => openFo("NEGATIVO")}
          >
            FO −
          </Button>
        </div>
      </div>

      {/* MODAL FO */}
      <Modal open={foOpen} onClose={() => !foSaving && setFoOpen(false)} size="md">
        <ModalHeader
          title={
            <span className="flex items-center gap-2">
              {foType === "POSITIVO" ? (
                <Pill kind="ok">FO Positivo</Pill>
              ) : (
                <Pill kind="bad">FO Negativo</Pill>
              )}
              <span className="text-fg">
                {soldier.warName || soldier.fullName}
              </span>
            </span>
          }
          description="Lance o fato observado de forma objetiva."
          onClose={() => !foSaving && setFoOpen(false)}
        />
        <ModalBody className="space-y-4">
          <div>
            <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted">
              Data
            </div>
            <Input
              type="date"
              value={foDate}
              onChange={(e) => setFoDate(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted">
              Fato observado
            </div>
            <Textarea
              value={foText}
              onChange={(e) => setFoText(e.target.value)}
              rows={5}
              placeholder="Ex: Demonstrou liderança na instrução de tiro de combate."
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={submitFO}
            loading={foSaving}
            className="w-full"
            size="lg"
          >
            Salvar FO
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

function Meta({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--r-md)] surface-2 px-3 py-2 ring-1 ring-line">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </div>
      <div className="mt-0.5 truncate text-sm font-semibold text-fg">{value}</div>
      {hint ? <div className="text-[10px] text-faint">{hint}</div> : null}
    </div>
  );
}

function FoCard({ fo, onDelete }: { fo: FO; onDelete: (id: string) => void }) {
  const isNeg = fo.type === "NEGATIVO";
  return (
    <Card
      className={cn(
        "transition",
        isNeg
          ? "border-[rgba(var(--bad),0.3)] bg-[rgba(var(--bad),0.04)]"
          : "border-[rgba(var(--ok),0.3)] bg-[rgba(var(--ok),0.04)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Pill kind={isNeg ? "bad" : "ok"} size="sm">
            {isNeg ? "FO −" : "FO +"}
          </Pill>
          <span className="text-xs text-muted">
            {new Date(fo.date).toLocaleDateString("pt-BR")}
          </span>
        </div>
        <button
          onClick={() => onDelete(fo.id)}
          aria-label="Excluir FO"
          className="grid h-7 w-7 place-items-center rounded-full surface-2 text-muted ring-1 ring-line hover:text-fg"
        >
          <X size={12} />
        </button>
      </div>
      <div
        className={cn(
          "mt-2 whitespace-pre-wrap text-sm",
          isNeg ? "text-fg" : "text-fg",
        )}
      >
        {fo.text}
      </div>
    </Card>
  );
}
