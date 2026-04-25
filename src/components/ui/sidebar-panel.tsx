import { cn } from "@/lib/utils/cn";

interface SidebarPanelProps {
  title: string;
  children: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  dense?: boolean;
  tone?: "default" | "command" | "alert";
}

export function SidebarPanel({ title, children, badge, className, dense = false, tone = "default" }: SidebarPanelProps) {
  return (
    <section
      className={cn(
        "tt-sidebar",
        tone === "command" && "bg-steel/16 shadow-tt-card",
        tone === "alert" && "border-signal/35 bg-signal/10 shadow-tt-signal",
        dense ? "p-3 sm:p-4" : "p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className={cn("uppercase text-signal", dense ? "text-[11px] tracking-[0.2em]" : "text-xs tracking-[0.22em]")}>{title}</p>
        {badge}
      </div>
      <div className={cn(dense ? "mt-3" : "mt-4")}>{children}</div>
    </section>
  );
}
