import * as React from "react";

export type Tipo = "Ingreso" | "Egreso";

export type Bolsillo = {
  id: string;
  nombre: string;
  color: string;
};

export type Categoria = {
  id: string;
  nombre: string;
  tipo: Tipo;
  color: string;
};

export type Transaccion = {
  id: string;
  fecha: string; // ISO yyyy-mm-dd
  bolsilloId: string;
  tipo: Tipo;
  categoriaId: string;
  descripcion: string;
  tercero: string;
  valor: number;
};

export type TugoData = {
  bolsillos: Bolsillo[];
  categorias: Categoria[];
  transacciones: Transaccion[];
};

const STORAGE_KEY = "tugo:data:v1";

export const uid = () => Math.random().toString(36).slice(2, 10);

const seed: TugoData = {
  bolsillos: [
    { id: "b-nequi", nombre: "Nequi", color: "#8b5cf6" },
    { id: "b-daviplata", nombre: "Daviplata", color: "#ef4444" },
    { id: "b-bancolombia", nombre: "Bancolombia", color: "#f59e0b" },
    { id: "b-efectivo", nombre: "Efectivo", color: "#d4edbc" },
  ],
  categorias: [
    { id: "c-laboral", nombre: "Ingreso Laboral", tipo: "Ingreso", color: "#d4edbc" },
    { id: "c-extra", nombre: "Ingreso Extra", tipo: "Ingreso", color: "#a7e8a0" },
    { id: "c-comida", nombre: "Comida", tipo: "Egreso", color: "#fca5a5" },
    { id: "c-transporte", nombre: "Transporte", tipo: "Egreso", color: "#93c5fd" },
    { id: "c-servicios", nombre: "Servicios", tipo: "Egreso", color: "#fcd34d" },
    { id: "c-ocio", nombre: "Ocio", tipo: "Egreso", color: "#f0abfc" },
  ],
  transacciones: [
    {
      id: "t-1",
      fecha: "2026-04-14",
      bolsilloId: "b-nequi",
      tipo: "Ingreso",
      categoriaId: "c-laboral",
      descripcion: "Salario quincenal",
      tercero: "Triconsi",
      valor: 800000,
    },
    {
      id: "t-2",
      fecha: "2026-04-15",
      bolsilloId: "b-nequi",
      tipo: "Egreso",
      categoriaId: "c-comida",
      descripcion: "Desayuno de Sofía",
      tercero: "Sofía",
      valor: 10000,
    },
  ],
};

type Ctx = {
  data: TugoData;
  hydrated: boolean;
  addTransaccion: () => void;
  updateTransaccion: (id: string, patch: Partial<Transaccion>) => void;
  deleteTransaccion: (id: string) => void;
  addBolsillo: (nombre: string, color: string) => void;
  updateBolsillo: (id: string, patch: Partial<Bolsillo>) => void;
  deleteBolsillo: (id: string) => void;
  addCategoria: (nombre: string, tipo: Tipo, color: string) => void;
  updateCategoria: (id: string, patch: Partial<Categoria>) => void;
  deleteCategoria: (id: string) => void;
};

const TugoContext = React.createContext<Ctx | null>(null);

export function TugoProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<TugoData>(seed);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as TugoData;
        if (parsed && Array.isArray(parsed.transacciones)) setData(parsed);
      }
    } catch {
      /* datos locales ilegibles: se conserva el ejemplo */
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [data, hydrated]);

  const value = React.useMemo<Ctx>(
    () => ({
      data,
      hydrated,
      addTransaccion: () =>
        setData((d) => ({
          ...d,
          transacciones: [
            ...d.transacciones,
            {
              id: uid(),
              fecha: new Date().toISOString().slice(0, 10),
              bolsilloId: d.bolsillos[0]?.id ?? "",
              tipo: "Egreso",
              categoriaId: d.categorias.find((c) => c.tipo === "Egreso")?.id ?? "",
              descripcion: "",
              tercero: "",
              valor: 0,
            },
          ],
        })),
      updateTransaccion: (id, patch) =>
        setData((d) => ({
          ...d,
          transacciones: d.transacciones.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      deleteTransaccion: (id) =>
        setData((d) => ({ ...d, transacciones: d.transacciones.filter((t) => t.id !== id) })),
      addBolsillo: (nombre, color) =>
        setData((d) => ({ ...d, bolsillos: [...d.bolsillos, { id: uid(), nombre, color }] })),
      updateBolsillo: (id, patch) =>
        setData((d) => ({
          ...d,
          bolsillos: d.bolsillos.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        })),
      deleteBolsillo: (id) =>
        setData((d) => ({ ...d, bolsillos: d.bolsillos.filter((b) => b.id !== id) })),
      addCategoria: (nombre, tipo, color) =>
        setData((d) => ({
          ...d,
          categorias: [...d.categorias, { id: uid(), nombre, tipo, color }],
        })),
      updateCategoria: (id, patch) =>
        setData((d) => ({
          ...d,
          categorias: d.categorias.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      deleteCategoria: (id) =>
        setData((d) => ({ ...d, categorias: d.categorias.filter((c) => c.id !== id) })),
    }),
    [data, hydrated],
  );

  return <TugoContext.Provider value={value}>{children}</TugoContext.Provider>;
}

export function useTugo() {
  const ctx = React.useContext(TugoContext);
  if (!ctx) throw new Error("useTugo debe usarse dentro de TugoProvider");
  return ctx;
}

export function saldoBolsillo(data: TugoData, bolsilloId: string) {
  return data.transacciones
    .filter((t) => t.bolsilloId === bolsilloId)
    .reduce((acc, t) => acc + (t.tipo === "Ingreso" ? t.valor : -t.valor), 0);
}

export function contarUsoBolsillo(data: TugoData, bolsilloId: string) {
  return data.transacciones.filter((t) => t.bolsilloId === bolsilloId).length;
}

export function contarUsoCategoria(data: TugoData, categoriaId: string) {
  return data.transacciones.filter((t) => t.categoriaId === categoriaId).length;
}
