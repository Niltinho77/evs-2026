import { NextRequest, NextResponse } from "next/server";

function isPublicAsset(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  );
}

function okToken(req: NextRequest): boolean {
  const token = process.env.REGISTRATION_TOKEN || "";
  if (!token) return false;

  const q = req.nextUrl.searchParams.get("t") || "";
  const c = req.cookies.get("evs_reg")?.value || "";
  return q === token || c === token;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // nunca bloqueia assets do Next
  if (isPublicAsset(pathname)) return NextResponse.next();

  // valida token
  const token = process.env.REGISTRATION_TOKEN || "";
  if (!token || !okToken(req)) {
    // Se você quiser redirecionar pra uma página simples, pode trocar por redirect.
    return NextResponse.json({ error: "Acesso bloqueado." }, { status: 403 });
  }

  // se entrou com ?t=token, grava cookie pra facilitar uso no celular
  const q = req.nextUrl.searchParams.get("t") || "";
  const res = NextResponse.next();

  if (q === token) {
    res.cookies.set("evs_reg", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 12, // 12 horas (ajuste se quiser)
    });
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml).*)"],
};