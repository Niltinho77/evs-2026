import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVS 2026 — Comando",
  description: "Cadastro de Soldados EV 2026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <header className="flex items-center justify-between py-4">
            <div>
              <div className="text-lg font-semibold">EVS 2026</div>
              <div className="text-xs text-zinc-400">
                Esquadrão de Comando
              </div>
            </div>

            <a
              href="/soldiers/new"
              className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 active:scale-[0.99]"
            >
              + Novo EV
            </a>
          </header>

          <main>{children}</main>

          <footer className="mt-10 text-center text-xs text-zinc-500">
            Sistema Interno — Uso restrito
          </footer>
        </div>
      </body>
    </html>
  );
}