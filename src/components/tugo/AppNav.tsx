import { Link } from "@tanstack/react-router";
import { Table2, Wallet, Tags } from "lucide-react";

const items = [
  { to: "/", label: "Transacciones", icon: Table2 },
  { to: "/bolsillos", label: "Bolsillos", icon: Wallet },
  { to: "/categorias", label: "Categorías", icon: Tags },
] as const;

export function AppNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-foreground/15 bg-background">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:flex sm:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-foreground/20 font-black"
            style={{ backgroundColor: "#d4edbc" }}
          >
            T
          </span>
          <span className="truncate text-lg font-black tracking-tight">Tugo</span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {items.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary sm:px-3"
              activeProps={{
                className:
                  "border-foreground/20 bg-accent text-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.05)]",
              }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
