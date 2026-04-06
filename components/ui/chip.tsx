import { cn } from "@/lib/utils";

export function Chip({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1 text-xs",
        active ? "border-primary bg-primary/20 text-white" : "border-border bg-card/40 text-muted"
      )}
    >
      {label}
    </span>
  );
}
