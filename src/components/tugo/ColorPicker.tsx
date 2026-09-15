import { cn } from "@/lib/utils";

export const PALETA = [
  "#d4edbc",
  "#a7e8a0",
  "#93c5fd",
  "#8b5cf6",
  "#f0abfc",
  "#fca5a5",
  "#ef4444",
  "#f59e0b",
  "#fcd34d",
  "#111111",
];

export function ColorPicker({
  value,
  onChange,
  label = "Color",
}: {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={label}>
      {PALETA.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={`${label} ${color}`}
          aria-pressed={value.toLowerCase() === color}
          onClick={() => onChange(color)}
          className={cn(
            "h-6 w-6 rounded-md border transition-transform hover:scale-110",
            value.toLowerCase() === color
              ? "border-foreground ring-2 ring-foreground/25"
              : "border-foreground/20",
          )}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}
