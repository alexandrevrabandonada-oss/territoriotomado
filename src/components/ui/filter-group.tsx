import { cn } from "@/lib/utils/cn";

interface FilterGroupProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  meta?: React.ReactNode;
  description?: string;
}

export function FilterGroup({ label, children, className, meta, description }: FilterGroupProps) {
  return (
    <label className={cn("space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65", className)}>
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        {meta ? <span className="text-[10px] tracking-[0.14em] text-glass/80">{meta}</span> : null}
      </span>
      {children}
      {description ? <span className="block text-[10px] font-normal uppercase tracking-[0.14em] text-paper/42">{description}</span> : null}
    </label>
  );
}
