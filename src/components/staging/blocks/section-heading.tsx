import { Badge } from "@/components/ui/badge";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-4">
      <Badge tone="warning">{eyebrow}</Badge>
      <div className="space-y-3">
        <h2 className="max-w-3xl text-3xl font-black uppercase tracking-[0.1em] text-paper md:text-4xl">{title}</h2>
        <p className="max-w-3xl text-base leading-7 text-paper/72">{description}</p>
      </div>
    </div>
  );
}