import { cn } from "@/lib/utils/cn";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  helper?: string;
  description?: string;
  tone?: "default" | "critical" | "muted" | "steel" | "yellow" | "blue" | "rust" | "alert";
  compact?: boolean;
  className?: string;
}

const toneClasses = {
  default: "tt-metric border-glass/14 bg-ink/10",
  critical: "border-signal/30 bg-signal/6 shadow-[inset_0_1px_0_rgba(255,215,106,0.04)]",
  muted: "border-glass/12 bg-concrete/4 text-paper/60",
  steel: "border-glass/20 bg-steel/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]",
  yellow: "border-signal/28 bg-signal/6 shadow-[inset_0_1px_0_rgba(255,215,106,0.03)]",
  blue: "border-glass/26 bg-steel/14 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
  rust: "border-rust/26 bg-rust/6 shadow-[inset_0_1px_0_rgba(196,139,112,0.03)]",
  alert: "border-signal/40 bg-[linear-gradient(135deg,rgba(233,173,18,0.12),rgba(143,89,68,0.05))] shadow-tt-signal",
};

export function MetricCard({ label, value, helper, description, tone = "default", compact = false, className }: MetricCardProps) {
  const supportingText = description ?? helper;

  return (
    <div className={cn("border px-3", toneClasses[tone], compact ? "py-2.5" : "py-3.5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-paper/50">{label}</p>
        <p className={cn("font-display uppercase leading-none text-paper", compact ? "text-xl" : "text-3xl")}>{value}</p>
      </div>
      {supportingText ? <p className="mt-2 text-xs leading-5 text-paper/58">{supportingText}</p> : null}
    </div>
  );
}
