import { NextResponse } from "next/server";
import {
  createSessionToken,
  SESSION_COOKIE,
  validateCredentials,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const username = String(body?.username ?? "");
  const password = String(body?.password ?? "");

  const user = validateCredentials(username, password);
  if (!user) {
    return NextResponse.json({ error: "Usuario ou senha invalidos." }, { status: 401 });
  }

  const token = await createSessionToken(user.username, user.role);
  const res = NextResponse.json({
    user: { username: user.username, role: user.role, label: user.label },
  });

  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return res;
}
