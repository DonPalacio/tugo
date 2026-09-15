const copFormatter = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 800000 -> "$ 800.000,00" */
export function formatCOP(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `$ ${copFormatter.format(safe)}`;
}

/** 800000 -> "800.000,00" (sin símbolo, para edición) */
export function formatCOPNumber(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return copFormatter.format(safe);
}

/** "$ 800.000,00" | "800000" | "800.000" -> 800000 */
export function parseCOP(input: string): number {
  const cleaned = input.replace(/[^\d.,-]/g, "").trim();
  if (!cleaned) return 0;

  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");
  let normalized = cleaned;

  if (lastComma > lastDot) {
    // coma decimal (es-CO)
    normalized = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (lastDot > lastComma) {
    const decimals = cleaned.length - lastDot - 1;
    if (decimals === 3) {
      // punto usado como separador de miles
      normalized = cleaned.replace(/\./g, "").replace(/,/g, "");
    } else {
      normalized = cleaned.replace(/,/g, "");
    }
  } else {
    normalized = cleaned.replace(/[.,]/g, "");
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** "2026-04-14" -> "14/04/2026" */
export function formatFecha(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function isoFromDate(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function dateFromIso(iso: string): Date | undefined {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}
