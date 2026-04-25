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
  default: "tt-metric",
  critical: "border-signal/32 bg-signal/12 shadow-[inset_0_0_0_1px_rgba(255,215,106,0.07)]",
  muted: "border-glass/24 bg-concrete/8 shadow-[inset_0_1px_0_rgba(242,244,239,0.05)]",
  steel: "border-glass/26 bg-steel/18 shadow-[inset_0_1px_0_rgba(242,244,239,0.06)]",
  yellow: "border-signal/32 bg-signal/12 shadow-[inset_0_0_0_1px_rgba(255,215,106,0.07)]",
  blue: "border-glass/34 bg-steel/20 shadow-[inset_0_1px_0_rgba(195,208,210,0.08)]",
  rust: "border-rust/36 bg-rust/12 shadow-[inset_0_1px_0_rgba(196,139,112,0.08)]",
  alert: "border-signal/45 bg-[linear-gradient(135deg,rgba(233,173,18,0.16),rgba(143,89,68,0.08))] shadow-tt-signal",
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
