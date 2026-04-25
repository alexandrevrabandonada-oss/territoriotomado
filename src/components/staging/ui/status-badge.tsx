import { cn } from "@/lib/utils/cn";
import type { Criticality, PropertyStatus } from "@/types/domain";

interface StatusBadgeProps {
  type: "status" | "criticality";
  value: PropertyStatus | Criticality;
}

const statusTone: Record<PropertyStatus, string> = {
  ocupado: "border-paper/15 bg-paper/8 text-paper/82",
  vazio: "border-rust/40 bg-rust/12 text-rust-light",
  "em-disputa": "border-signal/45 bg-signal/12 text-signal",
  "uso-institucional": "border-paper/20 bg-ink-alt text-paper/74",
};

const criticalityTone: Record<Criticality, string> = {
  alta: "border-signal/50 bg-signal/14 text-signal",
  media: "border-rust/50 bg-rust/14 text-rust-light",
  baixa: "border-paper/15 bg-paper/8 text-paper/72",
};

export function StatusBadge({ type, value }: StatusBadgeProps) {
  const tone = type === "status" ? statusTone[value as PropertyStatus] : criticalityTone[value as Criticality];
  const label = type === "status" ? value : `criticidade ${value}`;

  return (
    <span
      className={cn(
        "inline-flex items-center border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-[11px]",
        tone,
      )}
    >
      {label}
    </span>
  );
}