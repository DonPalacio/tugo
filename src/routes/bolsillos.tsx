import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { AppNav } from "@/components/tugo/AppNav";
import { ColorPicker, VERDE } from "@/components/tugo/ColorPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCOP } from "@/lib/currency";
import { contarUsoBolsillo, saldoBolsillo, useTugo } from "@/lib/tugo-store";
import { toast } from "sonner";

const title = "Bolsillos — Tugo";
const description =
  "Crea y personaliza tus bolsillos (Nequi, Daviplata, Bancolombia, Efectivo) con color propio y consulta el saldo calculado de cada uno.";

export const Route = createFileRoute("/bolsillos")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: BolsillosPage,
});

function BolsillosPage() {
  const { data, addBolsillo, updateBolsillo, deleteBolsillo } = useTugo();
  const [nombre, setNombre] = React.useState("");
  const [color, setColor] = React.useState(VERDE);

  const crear = (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = nombre.trim();
    if (!limpio) return;
    addBolsillo(limpio, color);
    setNombre("");
    toast.success(`Bolsillo "${limpio}" creado`);
  };

  const eliminar = (id: string, nombreBolsillo: string) => {
    const usos = contarUsoBolsillo(data, id);
    if (usos > 0) {
      toast.error(`"${nombreBolsillo}" tiene ${usos} transacción(es) asociadas`);
      return;
    }
    deleteBolsillo(id);
  };

  const total = data.bolsillos.reduce((acc, b) => acc + saldoBolsillo(data, b.id), 0);

  return (
    <div className="min-h-screen bg-secondary/40">
      <AppNav />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Bolsillos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tus medios de pago con color propio y saldo calculado.
        </p>

        <form
          onSubmit={crear}
          className="mt-5 space-y-3 rounded-xl border border-foreground/20 bg-background p-4"
        >
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <label className="grid gap-1.5 text-sm font-semibold">
              Nuevo bolsillo
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Nu, Ahorros, Rappipay"
              />
            </label>
            <Button
              type="submit"
              className="border border-foreground/20 bg-accent font-bold text-foreground hover:bg-accent/70"
            >
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          </div>
          <ColorPicker value={color} onChange={setColor} label="Color del bolsillo" />
        </form>

        <ul className="mt-4 space-y-3">
          {data.bolsillos.map((b) => (
            <li
              key={b.id}
              className="space-y-3 rounded-xl border border-foreground/20 bg-background p-4"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="h-8 w-8 shrink-0 rounded-lg border border-foreground/20"
                    style={{ backgroundColor: b.color }}
                  />
                  <Input
                    value={b.nombre}
                    onChange={(e) => updateBolsillo(b.id, { nombre: e.target.value })}
                    aria-label="Nombre del bolsillo"
                    className="h-9 min-w-0 border-transparent font-bold shadow-none hover:border-input"
                  />
                </div>
                <button
                  type="button"
                  aria-label={`Eliminar ${b.nombre}`}
                  onClick={() => eliminar(b.id, b.nombre)}
                  className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-foreground/10 pt-3">
                <ColorPicker
                  value={b.color}
                  onChange={(c) => updateBolsillo(b.id, { color: c })}
                  label={`Color de ${b.nombre}`}
                />
                <div className="text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Saldo
                  </p>
                  <p className="font-black tabular-nums">
                    {formatCOP(saldoBolsillo(data, b.id))}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-foreground/20 bg-foreground px-4 py-3 text-background">
          <span className="text-xs font-bold uppercase tracking-wide">Saldo total</span>
          <span className="text-lg font-black tabular-nums">{formatCOP(total)}</span>
        </div>
      </main>
    </div>
  );
}
