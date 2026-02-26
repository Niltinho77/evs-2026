import "./globals.css";

export const metadata = {
  title: "EVS 2026",
  description: "Cadastro e controle de EVs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <div className="min-h-screen">
          {/* Topbar */}
          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl">
            <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <span className="text-sm font-extrabold tracking-tight">
                    EV
                  </span>
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">EVS 2026</div>
                  <div className="text-[11px] text-white/60">Esquadrão de Comando</div>
                </div>
              </div>

              <a
                href="/soldiers/new"
                className="rounded-2xl bg-[rgb(var(--accent))] px-4 py-2 text-xs font-bold text-black shadow-[var(--shadow)]"
              >
                + Novo
              </a>
            </div>
          </header>

          {/* Page */}
          <main className="mx-auto max-w-3xl px-4 pb-20 pt-4">{children}</main>

          
        </div>
      </body>
    </html>
  );
}