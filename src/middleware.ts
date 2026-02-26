import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/soldiers", "/api/soldiers"];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function isPublicRoute(pathname: string) {
  // permitir home e rota de imagens
  if (pathname === "/") return true;
  if (pathname.startsWith("/api/uploads/")) return true;

  // liberar acesso ao formulário novo
  if (pathname === "/soldiers/new") return true;

  // se você quiser liberar também /soldiers (lista) durante janela, deixe true
  // caso contrário, comente
  if (pathname === "/soldiers") return true;

  // API POST (criar) será controlada abaixo também
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // deixa rotas públicas passarem e protege o resto do /soldiers e /api/soldiers
  const shouldProtect = isProtected(pathname) && !isPublicRoute(pathname);

  // também protege o POST de criação
  const isCreateApi = pathname === "/api/soldiers" && req.method === "POST";

  if (!shouldProtect && !isCreateApi) return NextResponse.next();

  const token = process.env.REGISTRATION_TOKEN || "";
  const deadline = process.env.REGISTRATION_DEADLINE || "";

  // se token não existir, fecha tudo
  if (!token) return NextResponse.json({ error: "Acesso encerrado." }, { status: 403 });

  // deadline
  if (deadline) {
    const end = new Date(deadline).getTime();
    if (!Number.isNaN(end) && Date.now() > end) {
      return NextResponse.json({ error: "Prazo encerrado." }, { status: 403 });
    }
  }

  const tQuery = searchParams.get("t") || "";
  const tCookie = req.cookies.get("evs_reg")?.value || "";
  const ok = tQuery === token || tCookie === token;

  if (!ok) {
    return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
  }

  // se veio pela query, grava cookie para próximas requisições
  const res = NextResponse.next();
  if (tQuery === token) {
    res.cookies.set("evs_reg", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    });
  }
  return res;
}

export const config = {
  matcher: ["/soldiers/:path*", "/api/soldiers/:path*"],
};