import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      username: session.username,
      role: session.role,
      label: session.username === "caveirinha" ? "Caveirinha" : "Admin",
    },
  });
}
