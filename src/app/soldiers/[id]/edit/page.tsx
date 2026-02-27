"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import SoldierForm from "@/components/SoldierForm";

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

  // ===== campos que o SoldierForm atual usa e estavam faltando aqui =====
  facebook?: string | null;
  instagram?: string | null;

  healthIssues?: string | null;

  hasGirlfriend: boolean;
  girlfriendAddress?: string | null;

  usedDrugs: boolean;
  drugsDetails?: string | null;
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
    };
  }, [data]);

  if (!id) return null;

  if (err) {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl border border-red-900/40 bg-red-950/30 p-4 text-sm text-red-200">
          {err}
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

  if (loading || !normalizedInitial) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-300">
        Carregando...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-lg font-semibold">Editar Soldado EV</div>
        <div className="text-xs text-zinc-400">Atualização completa</div>
      </div>

      <SoldierForm mode="edit" initial={normalizedInitial} />
    </div>
  );
}