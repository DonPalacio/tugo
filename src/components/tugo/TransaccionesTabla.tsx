import * as React from "react";
import { es } from "date-fns/locale";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  dateFromIso,
  formatCOP,
  formatCOPNumber,
  formatFecha,
  isoFromDate,
  parseCOP,
} from "@/lib/currency";
import { useTugo, type Tipo, type Transaccion } from "@/lib/tugo-store";

const COLUMNAS = [
  "Fecha",
  "Medio (Bolsillos)",
  "Tipo",
  "Categoría",
  "Descripción de la transacción",
  "Tercero (entidad)",
  "Valor",
];

function Swatch({ color }: { color: string }) {
  return (
    <span
      className="h-2.5 w-2.5 shrink-0 rounded-full border border-foreground/25"
      style={{ backgroundColor: color }}
    />
  );
}

function ColorBadge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full border border-foreground/15 px-2 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: `${color}33` }}
    >
      <Swatch color={color} />
      <span className="truncate">{children}</span>
    </span>
  );
}

function FechaCelda({ value, onChange }: { value: string; onChange: (iso: string) => void }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm tabular-nums transition-colors hover:bg-accent/60"
        >
          <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          {formatFecha(value)}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={es}
          defaultMonth={dateFromIso(value) ?? new Date()}
          selected={dateFromIso(value)}
          onSelect={(d) => {
            if (d) onChange(isoFromDate(d));
            setOpen(false);
          }}
          autoFocus
          className={cn("pointer-events-auto p-3")}
        />
      </PopoverContent>
    </Popover>
  );
}

function TextoCelda({
  value,
  onChange,
  placeholder,
  align = "left",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  align?: "left" | "right";
}) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full rounded-md bg-transparent px-2 py-1.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 hover:bg-accent/50 focus:bg-accent/60 focus:ring-2 focus:ring-foreground/20",
        align === "right" && "text-right",
      )}
    />
  );
}

function ValorCelda({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [draft, setDraft] = React.useState<string | null>(null);
  return (
    <input
      inputMode="decimal"
      value={draft ?? formatCOP(value)}
      onFocus={() => setDraft(value ? formatCOPNumber(value) : "")}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        if (draft !== null) onChange(parseCOP(draft));
        setDraft(null);
      }}
      className="w-full rounded-md bg-transparent px-2 py-1.5 text-right text-sm font-semibold tabular-nums outline-none transition-colors hover:bg-accent/50 focus:bg-accent/60 focus:ring-2 focus:ring-foreground/20"
    />
  );
}

function TipoSelect({ value, onChange }: { value: Tipo; onChange: (t: Tipo) => void }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as Tipo)}>
      <SelectTrigger
        className="h-auto w-full gap-1 border-0 bg-transparent px-2 py-1 shadow-none hover:bg-accent/50 focus:ring-2 focus:ring-foreground/20"
        aria-label="Tipo"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Ingreso">Ingreso</SelectItem>
        <SelectItem value="Egreso">Egreso</SelectItem>
      </SelectContent>
    </Select>
  );
}

function TipoBadge({ tipo }: { tipo: Tipo }) {
  return tipo === "Ingreso" ? (
    <span
      className="rounded-full border border-foreground/20 px-2 py-0.5 text-xs font-bold"
      style={{ backgroundColor: "#d4edbc" }}
    >
      Ingreso
    </span>
  ) : (
    <span className="rounded-full bg-foreground px-2 py-0.5 text-xs font-bold text-background">
      Egreso
    </span>
  );
}

export function TransaccionesTabla() {
  const { data, addTransaccion, updateTransaccion, deleteTransaccion } = useTugo();
  const { bolsillos, categorias, transacciones } = data;

  const filas = React.useMemo(
    () => [...transacciones].sort((a, b) => a.fecha.localeCompare(b.fecha)),
    [transacciones],
  );

  const ingresos = filas.filter((t) => t.tipo === "Ingreso").reduce((a, t) => a + t.valor, 0);
  const egresos = filas.filter((t) => t.tipo === "Egreso").reduce((a, t) => a + t.valor, 0);

  const bolsillo = (id: string) => bolsillos.find((b) => b.id === id);
  const categoria = (id: string) => categorias.find((c) => c.id === id);

  const setTipo = (t: Transaccion, tipo: Tipo) => {
    const actual = categoria(t.categoriaId);
    const nuevaCat =
      actual && actual.tipo === tipo
        ? t.categoriaId
        : (categorias.find((c) => c.tipo === tipo)?.id ?? "");
    updateTransaccion(t.id, { tipo, categoriaId: nuevaCat });
  };

  const BolsilloSelect = ({ t }: { t: Transaccion }) => (
    <Select value={t.bolsilloId} onValueChange={(v) => updateTransaccion(t.id, { bolsilloId: v })}>
      <SelectTrigger
        className="h-auto w-full gap-1 border-0 bg-transparent px-2 py-1 shadow-none hover:bg-accent/50 focus:ring-2 focus:ring-foreground/20"
        aria-label="Medio"
      >
        <SelectValue placeholder="Elegir bolsillo" />
      </SelectTrigger>
      <SelectContent>
        {bolsillos.map((b) => (
          <SelectItem key={b.id} value={b.id}>
            <span className="flex items-center gap-2">
              <Swatch color={b.color} />
              {b.nombre}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const CategoriaSelect = ({ t }: { t: Transaccion }) => (
    <Select value={t.categoriaId} onValueChange={(v) => updateTransaccion(t.id, { categoriaId: v })}>
      <SelectTrigger
        className="h-auto w-full gap-1 border-0 bg-transparent px-2 py-1 shadow-none hover:bg-accent/50 focus:ring-2 focus:ring-foreground/20"
        aria-label="Categoría"
      >
        <SelectValue placeholder="Elegir categoría" />
      </SelectTrigger>
      <SelectContent>
        {categorias
          .filter((c) => c.tipo === t.tipo)
          .map((c) => (
            <SelectItem key={c.id} value={c.id}>
              <span className="flex items-center gap-2">
                <Swatch color={c.color} />
                {c.nombre}
              </span>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="space-y-4">
      {/* Resumen */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div
          className="rounded-xl border border-foreground/15 p-3"
          style={{ backgroundColor: "#d4edbc" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide">Ingresos</p>
          <p className="mt-0.5 text-lg font-black tabular-nums">{formatCOP(ingresos)}</p>
        </div>
        <div className="rounded-xl border border-foreground/15 bg-foreground p-3 text-background">
          <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Egresos</p>
          <p className="mt-0.5 text-lg font-black tabular-nums">{formatCOP(egresos)}</p>
        </div>
        <div className="col-span-2 rounded-xl border border-foreground/15 bg-background p-3 sm:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Saldo neto
          </p>
          <p className="mt-0.5 text-lg font-black tabular-nums">{formatCOP(ingresos - egresos)}</p>
        </div>
      </div>

      {/* Tabla: escritorio */}
      <div className="hidden overflow-x-auto rounded-xl border border-foreground/20 bg-background md:block">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#262626]">
              {COLUMNAS.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className={cn(
                    "border-b border-r border-white/15 px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-white",
                    c === "Valor" && "text-right",
                  )}
                >
                  {c}
                </th>
              ))}
              <th className="w-10 border-b border-white/15 px-2 py-2.5 text-white">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filas.map((t) => (
              <tr key={t.id} className="group border-b border-foreground/10 last:border-b-0">
                <td className="w-32 border-r border-foreground/10 p-0">
                  <FechaCelda
                    value={t.fecha}
                    onChange={(iso) => updateTransaccion(t.id, { fecha: iso })}
                  />
                </td>
                <td className="w-40 border-r border-foreground/10 p-0">
                  <BolsilloSelect t={t} />
                </td>
                <td className="w-32 border-r border-foreground/10 p-0">
                  <TipoSelect value={t.tipo} onChange={(tipo) => setTipo(t, tipo)} />
                </td>
                <td className="w-44 border-r border-foreground/10 p-0">
                  <CategoriaSelect t={t} />
                </td>
                <td className="border-r border-foreground/10 p-0">
                  <TextoCelda
                    value={t.descripcion}
                    placeholder="Describe la transacción"
                    onChange={(v) => updateTransaccion(t.id, { descripcion: v })}
                  />
                </td>
                <td className="w-40 border-r border-foreground/10 p-0">
                  <TextoCelda
                    value={t.tercero}
                    placeholder="Persona o empresa"
                    onChange={(v) => updateTransaccion(t.id, { tercero: v })}
                  />
                </td>
                <td className="w-40 border-r border-foreground/10 p-0">
                  <ValorCelda
                    value={t.valor}
                    onChange={(v) => updateTransaccion(t.id, { valor: v })}
                  />
                </td>
                <td className="p-1 text-center">
                  <button
                    type="button"
                    aria-label="Eliminar fila"
                    onClick={() => deleteTransaccion(t.id)}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filas.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center text-muted-foreground">
                  Aún no hay transacciones. Agrega la primera fila.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-foreground/25 bg-secondary font-bold">
              <td colSpan={6} className="px-3 py-2.5 text-right text-xs uppercase tracking-wide">
                Saldo neto
              </td>
              <td className="px-2 py-2.5 text-right tabular-nums">
                {formatCOP(ingresos - egresos)}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Tarjetas: móvil */}
      <div className="space-y-3 md:hidden">
        {filas.map((t) => {
          const b = bolsillo(t.bolsilloId);
          const c = categoria(t.categoriaId);
          return (
            <div
              key={t.id}
              className="space-y-2 rounded-xl border border-foreground/20 bg-background p-3"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <TipoBadge tipo={t.tipo} />
                  {b && <ColorBadge color={b.color}>{b.nombre}</ColorBadge>}
                </div>
                <button
                  type="button"
                  aria-label="Eliminar transacción"
                  onClick={() => deleteTransaccion(t.id)}
                  className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {c && <ColorBadge color={c.color}>{c.nombre}</ColorBadge>}

              <div className="grid gap-2 border-t border-foreground/10 pt-2">
                <label className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Fecha
                  <FechaCelda
                    value={t.fecha}
                    onChange={(iso) => updateTransaccion(t.id, { fecha: iso })}
                  />
                </label>
                <div className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Medio
                  <BolsilloSelect t={t} />
                </div>
                <div className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tipo
                  <TipoSelect value={t.tipo} onChange={(tipo) => setTipo(t, tipo)} />
                </div>
                <div className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Categoría
                  <CategoriaSelect t={t} />
                </div>
                <label className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Descripción
                  <TextoCelda
                    value={t.descripcion}
                    placeholder="Describe la transacción"
                    onChange={(v) => updateTransaccion(t.id, { descripcion: v })}
                  />
                </label>
                <label className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tercero
                  <TextoCelda
                    value={t.tercero}
                    placeholder="Persona o empresa"
                    onChange={(v) => updateTransaccion(t.id, { tercero: v })}
                  />
                </label>
                <label className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Valor
                  <ValorCelda
                    value={t.valor}
                    onChange={(v) => updateTransaccion(t.id, { valor: v })}
                  />
                </label>
              </div>
            </div>
          );
        })}
        {filas.length === 0 && (
          <p className="rounded-xl border border-dashed border-foreground/25 px-3 py-10 text-center text-sm text-muted-foreground">
            Aún no hay transacciones. Agrega la primera.
          </p>
        )}
      </div>

      <Button
        onClick={addTransaccion}
        className="w-full border border-foreground/20 bg-accent font-bold text-foreground hover:bg-accent/70 sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        Agregar transacción
      </Button>
    </div>
  );
}
