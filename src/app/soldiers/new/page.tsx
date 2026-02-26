import SoldierForm from "@/components/SoldierForm";

export default function NewSoldierPage() {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-lg font-semibold">Novo Soldado EV</div>
        <div className="text-xs text-zinc-400">
          Cadastro completo — Esquadrão de Comando
        </div>
      </div>

      <SoldierForm mode="create" />
    </div>
  );
}