import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { AppNav } from "@/components/tugo/AppNav";
import { ColorPicker, ROJO, VERDE } from "@/components/tugo/ColorPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { contarUsoCategoria, useTugo, type Tipo } from "@/lib/tugo-store";
import { toast } from "sonner";

const title = "Categorías — Tugo";
const description =
  "Organiza tus categorías de ingresos y egresos con color personalizado para clasificar cada transacción en Tugo.";

export const Route = createFileRoute("/categorias")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: CategoriasPage,
});

function ListaCategorias({ tipo }: { tipo: Tipo }) {
  const { data, addCategoria, updateCategoria, deleteCategoria } = useTugo();
  const [nombre, setNombre] = React.useState("");
  const [color, setColor] = React.useState(tipo === "Ingreso" ? VERDE : ROJO);

  const lista = data.categorias.filter((c) => c.tipo === tipo);

  const crear = (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = nombre.trim();
    if (!limpio) return;
    addCategoria(limpio, tipo, color);
    setNombre("");
    toast.success(`Categoría "${limpio}" creada`);
  };

  const eliminar = (id: string, nombreCat: string) => {
    const usos = contarUsoCategoria(data, id);
    if (usos > 0) {
      toast.error(`"${nombreCat}" tiene ${usos} transacción(es) asociadas`);
      return;
    }
    deleteCategoria(id);
  };

  return (
    <section className="rounded-xl border border-foreground/20 bg-background">
      <header
        className="flex items-center justify-between rounded-t-xl border-b border-foreground/20 px-4 py-2.5"
        style={tipo === "Ingreso" ? { backgroundColor: "#d4edbc" } : undefined}
      >
        <h2 className="text-sm font-black uppercase tracking-wide">
          {tipo === "Ingreso" ? "Ingresos" : "Egresos"}
        </h2>
        <span className="text-xs font-semibold text-muted-foreground">{lista.length}</span>
      </header>

      <ul className="divide-y divide-foreground/10">
        {lista.map((c) => (
          <li key={c.id} className="space-y-2.5 px-4 py-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="h-6 w-6 shrink-0 rounded-md border border-foreground/20"
                  style={{ backgroundColor: c.color }}
                />
                <Input
                  value={c.nombre}
                  onChange={(e) => updateCategoria(c.id, { nombre: e.target.value })}
                  aria-label="Nombre de la categoría"
                  className="h-9 min-w-0 border-transparent font-semibold shadow-none hover:border-input"
                />
              </div>
              <button
                type="button"
                aria-label={`Eliminar ${c.nombre}`}
                onClick={() => eliminar(c.id, c.nombre)}
                className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <ColorPicker
              value={c.color}
              onChange={(color) => updateCategoria(c.id, { color })}
              label={`Color de ${c.nombre}`}
            />
          </li>
        ))}
        {lista.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-muted-foreground">
            Sin categorías todavía.
          </li>
        )}
      </ul>

      <form onSubmit={crear} className="space-y-3 border-t border-foreground/15 px-4 py-3">
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder={tipo === "Ingreso" ? "Ej. Freelance" : "Ej. Arriendo"}
          />
          <Button
            type="submit"
            className="border border-foreground/20 bg-accent font-bold text-foreground hover:bg-accent/70"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        </div>
        <ColorPicker value={color} onChange={setColor} label="Color de la nueva categoría" />
      </form>
    </section>
  );
}

function CategoriasPage() {
  return (
    <div className="min-h-screen bg-secondary/40">
      <AppNav />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Categorías</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Clasifica tus movimientos con un color para cada categoría.
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <ListaCategorias tipo="Ingreso" />
          <ListaCategorias tipo="Egreso" />
        </div>
      </main>
    </div>
  );
}
