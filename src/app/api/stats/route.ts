import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    total,
    byPlatoonRaw,
    foPositive,
    foNegative,
    fatdsMonth,
    athletes,
    cnh,
    laranjeira,
    drugs,
    arrested,
    militaryRelative,
    voluntary,
    fatdsTotal,
  ] = await Promise.all([
    prisma.soldier.count(),
    prisma.soldier.groupBy({
      by: ["platoon"],
      _count: { _all: true },
    }),
    prisma.fO.count({ where: { type: "POSITIVO" } }),
    prisma.fO.count({ where: { type: "NEGATIVO" } }),
    prisma.fATD.count({ where: { date: { gte: monthStart } } }),
    prisma.soldier.count({ where: { isAthlete: true } }),
    prisma.soldier.count({ where: { hasLicense: true } }),
    prisma.soldier.count({ where: { laranjeira: true } }),
    prisma.soldier.count({ where: { usedDrugs: true } }),
    prisma.soldier.count({ where: { hasBeenArrested: true } }),
    prisma.soldier.count({ where: { hasMilitaryRelative: true } }),
    prisma.soldier.count({ where: { volunteeredToServe: true } }),
    prisma.fATD.count(),
  ]);

  const platoonMap: Record<"P1" | "P2" | "P3" | "NA", number> = {
    P1: 0,
    P2: 0,
    P3: 0,
    NA: 0,
  };
  for (const row of byPlatoonRaw) {
    const key = (row.platoon ?? "NA") as keyof typeof platoonMap;
    platoonMap[key] = row._count._all;
  }

  return NextResponse.json(
    {
      total,
      byPlatoon: platoonMap,
      fos: { positive: foPositive, negative: foNegative },
      fatds: { month: fatdsMonth, total: fatdsTotal },
      flags: {
        athletes,
        cnh,
        laranjeira,
        drugs,
        arrested,
        militaryRelative,
        voluntary,
      },
    },
    {
      headers: {
        "Cache-Control":
          "private, max-age=30, stale-while-revalidate=60",
      },
    },
  );
}
