import SoldierForm from "@/components/SoldierForm";

export default function NewSoldierPage() {
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--primary-strong))]">
          Cadastro · Esquadrão de Comando
        </div>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-fg">
          Novo militar EV
        </h1>
        <p className="mt-1 max-w-xl text-sm text-muted">
          Preencha os dados completos. Nome de guerra, nome completo, CPF e IDT
          são obrigatórios.
        </p>
      </div>

      <SoldierForm mode="create" />
    </div>
  );
}
