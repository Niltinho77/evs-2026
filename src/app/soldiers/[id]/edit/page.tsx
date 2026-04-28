"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SoldierForm from "@/components/SoldierForm";
import { Card, LinkButton, Skeleton } from "@/components/ui";

type SoldierApi = {
  id: string;
  photoUrl?: string | null;

  squad: string;
  platoon?: "P1" | "P2" | "P3" | null;

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
  hasBeenArrested?: boolean;
  arrestDetails?: string | null;
  livesWithParents?: boolean;
  livesWithWhom?: string | null;
  lostCloseFamily?: boolean;
  lostWhoCause?: string | null;
  livedAway?: boolean;
  livedAwayWhere?: string | null;
  householdCount?: number | null;
  familyIncome?: any;
  helpsFamily?: boolean;
  helpsFamilyAmount?: any;
  hasSiblings?: boolean;
  siblingsCount?: number | null;
  smoker?: boolean;
  alcoholUse?: boolean;
  policeProblems?: boolean;
  policeProblemsDetails?: string | null;
  accidentSequelae?: boolean;
  accidentSequelaeDetails?: string | null;
  hadSurgeries?: boolean;
  surgeriesDetails?: string | null;
  hasSTDs?: boolean;
  stdDetails?: string | null;
  hasSeizuresFainting?: boolean;
  mentalSymptoms?: boolean;
  mentalSymptomsDetails?: string | null;
  suddenFear?: boolean;
  irritabilityAnxietyEtc?: boolean;
  irritabilityAnxietyEtcDetails?: string | null;
  hasMilitaryRelative?: boolean;
  militaryRelativeDetails?: string | null;
  relationshipFather?: string | null;
  relationshipMother?: string | null;
  relationshipSiblings?: string | null;
  workedBeforeEB?: boolean;
  workSignedCard?: boolean;
  workSalary?: any;
  workDetails?: string | null;
  volunteeredToServe?: boolean;
  identidadeMilitar?: string | null;
  altura?: number | null;
  cabelo?: string | null;
  cutis?: string | null;
  corOlhos?: string | null;
  doadorOrgaos?: boolean | null;
};

export default function EditSoldierPage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<SoldierApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        setErr(null);
        const res = await fetch(`/api/soldiers/${id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error ?? "Falha ao carregar.");
        setData(json.soldier ?? null);
      } catch (e: any) {
        setErr(e?.message ?? "Erro.");
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const normalizedInitial = useMemo(() => {
    if (!data) return null;
    return {
      id: data.id,
      photoUrl: data.photoUrl ?? null,

      fullName: data.fullName ?? "",
      warName: data.warName ?? "",
      cpf: data.cpf ?? "",
      idt: data.idt ?? "",

      phone: data.phone ?? "",
      emergencyPhone: data.emergencyPhone ?? "",
      naturalidade: data.naturalidade ?? "",
      motherName: data.motherName ?? "",
      fatherName: data.fatherName ?? "",
      address: data.address ?? "",

      platoon: (data.platoon ?? "") as "" | "P1" | "P2" | "P3",

      laranjeira: Boolean(data.laranjeira ?? false),
      familyHistory: data.familyHistory ?? "",
      professionalExp: data.professionalExp ?? "",
      education: data.education ?? "",

      hasLicense: Boolean(data.hasLicense ?? false),
      licenseCategory: data.licenseCategory ?? "",

      bloodType: (data.bloodType ?? "") as any,

      bank: (data.bank ?? "") as any,
      agency: data.agency ?? "",
      account: data.account ?? "",

      religion: data.religion ?? "",
      voterTitle: data.voterTitle ?? "",

      isAthlete: Boolean(data.isAthlete ?? false),
      physicalActivity: data.physicalActivity ?? "",

      notesPositive: data.notesPositive ?? "",
      notesNegative: data.notesNegative ?? "",

      facebook: data.facebook ?? "",
      instagram: data.instagram ?? "",

      healthIssues: data.healthIssues ?? "",

      hasGirlfriend: Boolean(data.hasGirlfriend ?? false),
      girlfriendAddress: data.girlfriendAddress ?? "",

      usedDrugs: Boolean(data.usedDrugs ?? false),
      drugsDetails: data.drugsDetails ?? "",

      tattoos: data.tattoos ?? "",
      childrenCount:
        data.childrenCount != null ? String(data.childrenCount) : "",
      hasBeenArrested: Boolean(data.hasBeenArrested ?? false),
      arrestDetails: data.arrestDetails ?? "",
      livesWithParents: Boolean(data.livesWithParents ?? false),
      livesWithWhom: data.livesWithWhom ?? "",
      lostCloseFamily: Boolean(data.lostCloseFamily ?? false),
      lostWhoCause: data.lostWhoCause ?? "",
      livedAway: Boolean(data.livedAway ?? false),
      livedAwayWhere: data.livedAwayWhere ?? "",
      householdCount:
        data.householdCount != null ? String(data.householdCount) : "",
      familyIncome:
        data.familyIncome != null ? String(data.familyIncome) : "",
      helpsFamily: Boolean(data.helpsFamily ?? false),
      helpsFamilyAmount:
        data.helpsFamilyAmount != null ? String(data.helpsFamilyAmount) : "",
      hasSiblings: Boolean(data.hasSiblings ?? false),
      siblingsCount:
        data.siblingsCount != null ? String(data.siblingsCount) : "",
      smoker: Boolean(data.smoker ?? false),
      alcoholUse: Boolean(data.alcoholUse ?? false),
      policeProblems: Boolean(data.policeProblems ?? false),
      policeProblemsDetails: data.policeProblemsDetails ?? "",
      accidentSequelae: Boolean(data.accidentSequelae ?? false),
      accidentSequelaeDetails: data.accidentSequelaeDetails ?? "",
      hadSurgeries: Boolean(data.hadSurgeries ?? false),
      surgeriesDetails: data.surgeriesDetails ?? "",
      hasSTDs: Boolean(data.hasSTDs ?? false),
      stdDetails: data.stdDetails ?? "",
      hasSeizuresFainting: Boolean(data.hasSeizuresFainting ?? false),
      mentalSymptoms: Boolean(data.mentalSymptoms ?? false),
      mentalSymptomsDetails: data.mentalSymptomsDetails ?? "",
      suddenFear: Boolean(data.suddenFear ?? false),
      irritabilityAnxietyEtc: Boolean(data.irritabilityAnxietyEtc ?? false),
      irritabilityAnxietyEtcDetails: data.irritabilityAnxietyEtcDetails ?? "",
      hasMilitaryRelative: Boolean(data.hasMilitaryRelative ?? false),
      militaryRelativeDetails: data.militaryRelativeDetails ?? "",
      relationshipFather: data.relationshipFather ?? "",
      relationshipMother: data.relationshipMother ?? "",
      relationshipSiblings: data.relationshipSiblings ?? "",
      workedBeforeEB: Boolean(data.workedBeforeEB ?? false),
      workSignedCard: Boolean(data.workSignedCard ?? false),
      workSalary: data.workSalary != null ? String(data.workSalary) : "",
      workDetails: data.workDetails ?? "",
      volunteeredToServe: Boolean(data.volunteeredToServe ?? false),
      identidadeMilitar: data.identidadeMilitar ?? "",
      altura: data.altura != null ? String(data.altura) : "",
      cabelo: data.cabelo ?? "",
      cutis: data.cutis ?? "",
      corOlhos: data.corOlhos ?? "",
      doadorOrgaos: Boolean(data.doadorOrgaos ?? false),
    };
  }, [data]);

  if (!id) return null;

  if (err) {
    return (
      <Card className="space-y-3">
        <div className="text-sm text-[rgb(var(--bad))]">{err}</div>
        <LinkButton
          href="/"
          variant="outline"
          leftIcon={<ArrowLeft size={14} />}
        >
          Voltar
        </LinkButton>
      </Card>
    );
  }

  if (loading || !normalizedInitial) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--primary-strong))]">
          Edição · {data?.warName ?? data?.fullName}
        </div>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-fg">
          Editar ficha
        </h1>
        <p className="mt-1 max-w-xl text-sm text-muted">
          Atualização completa dos dados do militar.
        </p>
      </div>

      <SoldierForm mode="edit" initial={normalizedInitial} />
    </div>
  );
}
