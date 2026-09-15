import { createFileRoute } from "@tanstack/react-router";
import { AppNav } from "@/components/tugo/AppNav";
import { TransaccionesTabla } from "@/components/tugo/TransaccionesTabla";

const title = "Tugo — Tus finanzas personales en una hoja de cálculo";
const description =
  "Registra ingresos y egresos en pesos colombianos con una tabla editable tipo Excel: bolsillos, categorías, terceros y saldos al instante.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-secondary/40">
      <AppNav />
      <main className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Transacciones</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edita cualquier celda directamente, como en una hoja de cálculo.
          </p>
        </div>
        <TransaccionesTabla />
      </main>
    </div>
  );
}
