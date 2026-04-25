import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils/cn";

interface InternalPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

export function InternalPageHeader({ eyebrow, title, description, children, className }: InternalPageHeaderProps) {
  return (
    <section
      className={cn(
        "tt-hero grid gap-4 px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start",
        className,
      )}
    >
      <SectionHeader eyebrow={eyebrow} title={title} description={description} size="compact" />
      {children ? <div className="lg:min-w-[360px]">{children}</div> : null}
    </section>
  );
}
